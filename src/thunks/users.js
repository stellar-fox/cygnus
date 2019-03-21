import { firebaseApp } from "../components/StellarFox"
import Axios from "axios"
import { config } from "../config"
import md5 from "../lib/md5"
import { subscribeEmail } from "../components/Account/api"
import { string } from "@xcmats/js-toolbox"
import { action as AccountAction } from "../redux/Account"
import { action as AuthActions } from "../redux/Auth"
import { actions as AppActions } from "../redux/App"
import { action as AssetsAction } from "../redux/AssetManager"
import { action as AuthAction } from "../redux/Auth"
import { action as BalancesAction } from "../redux/Balances"
import { action as BankAction } from "../redux/Bank"
import { action as ContactsAction } from "../redux/Contacts"
import { actions as ErrorsActions } from "../redux/Errors"
import { action as LedgerHQAction } from "../redux/LedgerHQ"
import { action as LoginManagerAction } from "../redux/LoginManager"
import { action as PaymentsAction } from "../redux/Payments"
import { actions as ProgressActions } from "../redux/Progress"
import { action as StellarAccountAction } from "../redux/StellarAccount"
import { surfaceSnacky } from "../thunks/main"




/**
 * Helper thunk action authenticates user on the backend and sets login
 * related Redux tree keys.
 *
 * @function doBackendSignIn
 * @param {String} email
 * @param {String} password
 * @returns {Function} thunk action
 */
export const doBackendSignIn = (email, password) =>
    async (dispatch, _getState) => {

        const authResp = await Axios
            .post(`${config.api}/user/authenticate/`, {
                email,
                password,
            })

        await dispatch(LoginManagerAction.setUserId(authResp.data.user_id))
        await dispatch(LoginManagerAction.setApiToken(authResp.data.token))
        await dispatch(
            LedgerHQAction.setBip32Path(
                authResp.data.bip32Path.toString(10)
            )
        )
        await dispatch(LedgerHQAction.setPublicKey(authResp.data.pubkey))
        await dispatch(AuthActions.setSignupComplete())
    }




/**
 * Signs user in via _Firebase_.
 *
 * @function signIn
 * @param {String} email
 * @param {String} password
 * @returns {Function} thunk action
 */
export const signIn = (email, password) =>
    async (dispatch, _getState) => {
        await dispatch(clearInputErrorMessages())
        try {
            await dispatch(ProgressActions.toggleProgress(
                "signin", "Logging you in ..."
            ))
            await firebaseApp.auth("session").signInWithEmailAndPassword(
                email,
                password
            )
            await dispatch(doBackendSignIn(email, password))

        } catch (error) {
            await dispatch(setError(error))
        } finally {
            await dispatch(ProgressActions.toggleProgress(
                "signin", string.empty()
            ))
        }
    }




/**
 * Signs user out of the session and clears Redux tree.
 *
 * @function signOut
 * @returns {Function} thunk action
 */
export const signOut = () =>
    async (dispatch, _getState) => {
        await firebaseApp.auth("session").signOut()
        await dispatch(AccountAction.resetState())
        await dispatch(AppActions.resetState())
        await dispatch(AssetsAction.resetState())
        await dispatch(AuthAction.resetState())
        await dispatch(BalancesAction.resetState())
        await dispatch(BankAction.resetState())
        await dispatch(ContactsAction.resetState())
        await dispatch(LedgerHQAction.resetState())
        await dispatch(LoginManagerAction.resetState())
        await dispatch(PaymentsAction.resetState())
        await dispatch(StellarAccountAction.resetState())
        await dispatch(surfaceSnacky(
            "success",
            "You were signed out of your account."
        ))
    }




/**
 * Clears errors from email/password inputs.
 *
 * @function clearInputErrorMessages
 * @returns {Function} thunk action
 */
export const clearInputErrorMessages = () =>
    async (dispatch, _getState) => {
        await dispatch(ErrorsActions.clearEmailInputError())
        await dispatch(ErrorsActions.clearPasswordInputError())
        await dispatch(ErrorsActions.clearOtherError())
    }




/**
 * Signs up a new user via _Firebase_
 *
 * @function signUpNewUser
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @returns {Function} thunk action
 */
export const signUpNewUser = (accountId, account, email, password) =>
    async (dispatch, getState) => {

        await dispatch(clearInputErrorMessages())


        try {
            await dispatch(AuthActions.toggleSignupProgress(true))
            await dispatch(ProgressActions.toggleProgress(
                "signup", "Creating user account ..."
            ))

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

            await dispatch(doBackendSignIn(email, password))

            await dispatch(ProgressActions.toggleProgress(
                "signup", "Almost done ..."
            ))


            const { userId, token } = getState().LoginManager
            await subscribeEmail(userId, token, email)

            await firebaseApp.auth("session")
                .currentUser.sendEmailVerification()
            await dispatch(ProgressActions.toggleProgress(
                "signup", string.empty()
            ))
            await dispatch(AuthActions.setSignupComplete())
        } catch (error) {
            await dispatch(ProgressActions.toggleProgress(
                "signup", string.empty()
            ))
            await dispatch(setError(error))
        } finally {
            await dispatch(AuthActions.toggleSignupProgress(false))
        }

    }




/**
 * Sets the proper message in Redux tree so the UI element can display it.
 *
 * @function setError
 * @param {Object} error
 * @returns {Function} thunk action
 */
export const setError = (error) =>
    async (dispatch, _getState) => {
        if (error.code === "auth/invalid-email") {
            await dispatch(ErrorsActions.setEmailInputError(error.message))
            return
        }

        if (error.code === "auth/email-already-in-use") {
            await dispatch(ErrorsActions.setEmailInputError(error.message))
            return
        }

        if (error.code === "auth/wrong-password") {
            await dispatch(ErrorsActions.setPasswordInputError(
                "Password is invalid."
            ))
            return
        }

        if (error.code === "auth/weak-password") {
            await dispatch(ErrorsActions.setPasswordInputError(error.message))
            return
        }

        if (error.code === "auth/user-not-found") {
            await dispatch(ErrorsActions.setEmailInputError("Email not found."))
            return
        }

        await dispatch(ErrorsActions.setOtherError(
            `[${error.code}]: ${error.message}`
        ))
    }
