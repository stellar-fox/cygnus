import { firebaseApp } from "../components/StellarFox"
import { actions as ErrorsActions } from "../redux/Errors"



/**
 * Signs up a new user via _Firebase_
 * 
 * @function signUpNewUser
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @returns {Function} thunk action
 */
export const signUpNewUser = (_accountId, email, password) =>
    async (dispatch, _getState) => {

        await dispatch(ErrorsActions.clearEmailInputError())
        await dispatch(ErrorsActions.clearPasswordInputError())


        try {
            await firebaseApp.auth("session").createUserWithEmailAndPassword(
                email, password
            )    
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
