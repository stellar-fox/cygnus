import { firebaseApp } from "../components/StellarFox"
import { actions as ErrorsActions } from "../redux/Errors"
import Axios from "axios"
import { config } from "../config"
import md5 from "../lib/md5"
import { subscribeEmail } from "../components/Account/api"


export const clearInputErrorMessages = () =>
    async (dispatch, _getState) => {
        await dispatch(ErrorsActions.clearEmailInputError())
        await dispatch(ErrorsActions.clearPasswordInputError())
    }



/**
 * Signs up a new user via _Firebase_
 * 
 * @function signUpNewUser
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @returns {Function} thunk action
 */
export const signUpNewUser = (accountId, account, email, password) =>
    async (dispatch, _getState) => {

        await clearInputErrorMessages()

        try {

            await firebaseApp.auth("session").createUserWithEmailAndPassword(
                email, password
            )

            const userResp = await Axios.post(
                `${config.apiV2}/user/create/`, {
                    email,
                    password,
                    token: (await firebaseApp.auth("session")
                        .currentUser.getIdToken()),
                }
            )

            await Axios
                .post(`${config.api}/account/create/`, {
                    user_id: userResp.data.userid,
                    pubkey: accountId,
                    path: account,
                    email_md5: md5(email),
                })

            const authResp = await Axios
                .post(`${config.api}/user/authenticate/`, {
                    email,
                    password,
                })

            await subscribeEmail(
                userResp.data.userid,
                authResp.data.token,
                email
            )

            await firebaseApp.auth("session")
                .currentUser.sendEmailVerification()

        } catch (error) {
            if (error.code === "auth/invalid-email") {
                await dispatch(ErrorsActions.setEmailInputError(error.message))
                return
            }

            if (error.code === "auth/email-already-in-use") {
                await dispatch(ErrorsActions.setEmailInputError(error.message))
                return
            }

            if (error.code === "auth/wrong-password") {
                await dispatch(ErrorsActions.setPasswordInputError("Password is invalid."))
                return
            }

            if (error.code === "auth/weak-password") {
                await dispatch(ErrorsActions.setPasswordInputError(error.message))
                return
            }

            // in case of other error - display the code/message
            await dispatch(ErrorsActions.setEmailInputError(error.code))
            await dispatch(ErrorsActions.setPasswordInputError(error.message))

        }
        

    }
