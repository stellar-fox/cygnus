import { firebaseApp } from "../components/StellarFox"
import Axios from "axios"
import { config } from "../config"
import md5 from "../lib/md5"
import { subscribeEmail } from "../components/Account/api"
import {
    listInternal,
    listPending,
    listRequested,
} from "../components/Contacts/api"
import { string } from "@xcmats/js-toolbox"
import { paymentAddress } from "../lib/utils"
import { action as AccountAction } from "../redux/Account"
import { action as AuthActions } from "../redux/Auth"
import { actions as AppActions } from "../redux/App"
import { action as AssetManagerAction } from "../redux/AssetManager"
import { action as AuthAction } from "../redux/Auth"
import { action as BalancesAction } from "../redux/Balances"
import { action as BankAction } from "../redux/Bank"
import { action as ContactsAction } from "../redux/Contacts"
import { actions as ErrorsActions } from "../redux/Errors"
import { action as LedgerHQAction } from "../redux/LedgerHQ"
import { action as LoginManagerAction } from "../redux/LoginManager"
import { action as ModalAction } from "../redux/Modal"
import { action as PaymentsAction } from "../redux/Payments"
import { actions as ProgressActions } from "../redux/Progress"
import { action as StellarAccountAction } from "../redux/StellarAccount"
import { action as TransactionAction } from "../redux/Transaction"
import { surfaceSnacky } from "../thunks/main"
import { queryDevice } from "../thunks/ledgerhq"
import {
    fedToPub,
    getUserExternalContacts,
    invalidPaymentAddressMessage,
} from "../lib/utils"
import {
    buildClearDataTx,
    submitTransaction,
} from "../lib/stellar-tx"
import { insertPathIndex } from "../lib/utils"
import { signTransaction } from "../lib/ledger"
import {
    implodeCloudData,
    unsubscribeEmail,
} from "../components/Account/api"




/**
 * Signs out current user if present in Firebase auth object.
 *
 * @function signOutFirebaseUser
 * @returns {Function} thunk action
 */
export const signOutFirebaseUser = () =>
    async (_dispatch, _getState) => {
        if (firebaseApp.auth("session").currentUser) {
            await firebaseApp.auth("session").signOut()
        }
    }




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
 * Signs user in to explorer only view.
 *
 * @function enterExplorer
 * @param {String} inputValue Account ID or payment address.
 * @returns {Function} thunk action
 */
export const enterExplorer = (inputValue) =>
    async (dispatch, _getState) => {

        await dispatch(signOutFirebaseUser())
        await dispatch(ErrorsActions.clearOtherError())

        try {

            const inputInvalidMsg = invalidPaymentAddressMessage(inputValue)

            if (inputInvalidMsg) {
                await dispatch(
                    ErrorsActions.setOtherError(inputInvalidMsg)
                )
                return
            }

            await dispatch(ProgressActions.toggleProgress(
                "signin", "Resolving address ..."
            ))

            if (inputValue.match(/\*/)) {
                await dispatch(LedgerHQAction.setPublicKey(
                    await fedToPub(inputValue))
                )
            } else {
                await dispatch(LedgerHQAction.setPublicKey(inputValue))
            }

        } catch (error) {

            if (error.response.status === 404) {
                await dispatch(ErrorsActions.setOtherError("Not found."))
            } else {
                await dispatch(ErrorsActions.setOtherError(error.message))
            }

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
        await dispatch(await AccountAction.resetState())
        await dispatch(await AppActions.resetState())
        await dispatch(await AssetManagerAction.resetState())
        await dispatch(await AuthAction.resetState())
        await dispatch(await BalancesAction.resetState())
        await dispatch(await BankAction.resetState())
        await dispatch(await ContactsAction.resetState())
        await dispatch(await ErrorsActions.resetState())
        await dispatch(await LedgerHQAction.resetState())
        await dispatch(await LoginManagerAction.resetState())
        await dispatch(await ModalAction.resetState())
        await dispatch(await PaymentsAction.resetState())
        await dispatch(await ProgressActions.resetState())
        await dispatch(await StellarAccountAction.resetState())
        await dispatch(await TransactionAction.resetState())
        await dispatch(await surfaceSnacky(
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
        await dispatch(await ErrorsActions.clearEmailInputError())
        await dispatch(await ErrorsActions.clearPasswordInputError())
        await dispatch(await ErrorsActions.clearOtherError())
    }




/**
 * Sends password reset link to given email.
 *
 * @function sendPasswordResetLink
 * @param {String} email User email.
 * @returns {Function} Thunk action.
 *
*/
export const sendPasswordResetLink = (email) =>
    async (dispatch, _getState) => {
        await dispatch(await ErrorsActions.clearEmailInputError())
        try {
            await firebaseApp.auth().sendPasswordResetEmail(email)
            await dispatch(await surfaceSnacky(
                "success",
                "Password reset link sent. Please check your email."
            ))
        } catch (error) {
            await dispatch(setError(error))
            return Promise.reject(error)
        }
    }




/**
 * Validates password reset link.
 *
 * @function validateLink
 * @param {String} actionCode Firebase generated action code.
 * @returns {Function} Thunk action.
 *
*/
export const validateLink = (actionCode) =>
    async (_dispatch, _getState) => (
        await firebaseApp.auth("session").verifyPasswordResetCode(actionCode)
    )




/**
 * Applies action code from the email verification link.
 *
 * @function processActionCode
 * @param {String} actionCode Firebase generated action code.
 * @returns {Function} Thunk action.
 *
*/
export const processActionCode = (actionCode) =>
    async (_dispatch, _getState) => (
        await firebaseApp.auth("session").applyActionCode(actionCode)
    )




/**
 * Updates user password in Firebase and backend.
 *
 * @function updatePassword
 * @param {String} actionCode Firebase generated action code.
 * @param {String} email
 * @param {String} password
 * @returns {Function} Thunk action.
 *
*/
export const updatePassword = (actionCode, email, password) =>
    async (_dispatch, _getState) => {
        await firebaseApp.auth().confirmPasswordReset(actionCode, password)
        await Axios.post(
            `${config.apiV2}/user/update-password/`, {
                email,
                password,
            }
        )
    }




/**
 * Signs up a new user via _Firebase_
 *
 * @function signUpNewUser
 * @param {String} accountId Stellar account id.
 * @param {String} account HD account path index.
 * @param {String} email
 * @param {String} password
 * @returns {Function} thunk action
 */
export const signUpNewUser = (accountId, account, email, password) =>
    async (dispatch, getState) => {

        await dispatch(signOutFirebaseUser())
        await dispatch(await clearInputErrorMessages())
        await dispatch(await AuthActions.toggleSignupProgress(true))
        await dispatch(await ProgressActions.toggleProgress(
            "signup", "Creating user account ..."
        ))


        // 1. Create user in Firebase and on the backend side.

        let user = null
        let userResp = null

        try {
            user = await firebaseApp.auth("session").createUserWithEmailAndPassword(
                email, password
            )

            userResp = await Axios.post(
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

            await dispatch(await ProgressActions.toggleProgress(
                "signup", "Almost done ..."
            ))

            await firebaseApp.auth("session").currentUser.sendEmailVerification()

            // sign user in after signup is completed
            await dispatch(await doBackendSignIn(email, password))

        } catch (error) {

            // delete Firebase user.
            if (user) {
                await firebaseApp.auth("session").currentUser.delete()
            } else {
                await dispatch(setError(error))
                await dispatch(await ProgressActions.resetState())
                await dispatch(await AuthActions.toggleSignupProgress(false))
                return
            }

            // clear backend data
            if (getState().LoginManager.userId && getState().LoginManager.token) {
                await implodeCloudData(
                    getState().LoginManager.userId,
                    getState().LoginManager.token
                )
            }

            await dispatch(await clearInputErrorMessages())
            await dispatch(await ProgressActions.resetState())
            await dispatch(await surfaceSnacky("error", error.message))
            await dispatch(await AuthActions.toggleSignupProgress(false))
            return
        }



        // 2. Subscribe user to mailing list
        try {

            await subscribeEmail(
                getState().LoginManager.userId,
                getState().LoginManager.token,
                email
            )

        } catch (error) {

            // eslint-disable-next-line no-console
            console.log("Could not add email to subscription list.")

        } finally {

            await dispatch(await ProgressActions.toggleProgress(
                "signup",
                string.empty()
            ))
            await dispatch(AuthActions.setSignupComplete())
            await dispatch(await AuthActions.toggleSignupProgress(false))

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

        if (error.code === "auth/argument-error") {
            await dispatch(ErrorsActions.setEmailInputError("Please enter valid email."))
            return
        }

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




/**
 * Fetches user profile from the back-end and sets appropriate Redux keys.
 *
 * @function getUserProfile
 * @returns {Function} thunk action
 */
export const getUserProfile = () =>
    async (dispatch, getState) => {

        try {

            const userData = (await Axios.post(`${config.api}/user/`, {
                user_id: getState().LoginManager.userId,
                token: getState().LoginManager.token,
            })).data.data

            await dispatch(AccountAction.setState({
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                gravatar: userData.email_md5,
                paymentAddress: paymentAddress(
                    userData.alias,
                    userData.domain
                ),
                memo: userData.memo,
                discoverable: userData.visible,
                currency: userData.currency,
                needsRegistration: false,
            }))

        } catch (error) {
            await dispatch(
                surfaceSnacky("error", "Could not load user profile.")
            )
        }

    }




/**
 * Fetches user contacts from the back-end and sets appropriate Redux keys.
 *
 * @function getUserContacts
 * @returns {Function} thunk action
 */
export const getUserContacts = () =>
    async (dispatch, getState) => {

        try {
            const internal = await listInternal(
                getState().LoginManager.userId,
                getState().LoginManager.token
            )

            internal ? dispatch(ContactsAction.setState({ internal })) :
                dispatch(ContactsAction.setState({ internal: [] }))

            const pending = await listPending(
                getState().LoginManager.userId,
                getState().LoginManager.token
            )

            pending ? dispatch(ContactsAction.setState({ pending })) :
                dispatch(ContactsAction.setState({ pendig: [] }))

            const requests = await listRequested(
                getState().LoginManager.userId,
                getState().LoginManager.token
            )

            requests ? dispatch(ContactsAction.setState({ requests })) :
                dispatch(ContactsAction.setState({ requests: [] }))

            const external = await getUserExternalContacts(
                getState().LoginManager.userId,
                getState().LoginManager.token
            )

            external ? dispatch(ContactsAction.setState({ external })) :
                dispatch(ContactsAction.setState({ external: [] }))
        } catch (error) {
            await dispatch(
                surfaceSnacky("error", "Could not load user contacts.")
            )
        }

    }




/**
 * Surfaces registration marketing card.
 *
 * @function surfaceRegistrationCard
 * @returns {Function} thunk action
 */
export const surfaceRegistrationCard = () =>
    async (dispatch, _getState) =>
        await dispatch(AccountAction.setState({ needsRegistration: true }))




/**
 * Deletes user data and user from the cloud. If data entries exist in
 * the Account then they will also be deleted.
 *
 * @function implodeAccount
 * @param {Object} password object passed from component state
 * @param {Boolean} keepEmail boolean passed from component state
 * @returns {Function} thunk action
 *
 * */
export const implodeAccount = (password, keepEmail) =>
    async (dispatch, getState) => {

        // reset all messages / errors on the UI
        await dispatch(await clearInputErrorMessages())
        await dispatch(await ProgressActions.resetState())

        if (!password) {
            await dispatch(await ErrorsActions.setPasswordInputError(
                "Please enter your password."
            ))
            return
        }

        // Re-authenticate user with Firebase to confirm password and
        // update user as recently re-authenticated.
        try {
            await dispatch(await ProgressActions.toggleProgress(
                "implosion", "Authenticating ..."
            ))

            var user = firebaseApp.auth("session").currentUser

            await firebaseApp.auth("session").signInWithEmailAndPassword(
                user.email,
                password.password,
            )

            await dispatch(await ProgressActions.toggleProgress(
                "implosion", string.empty()
            ))

        } catch (error) {
            await dispatch(await ProgressActions.resetState())
            await dispatch(await ErrorsActions.setPasswordInputError(
                "Password is invalid."
            ))
            return
        }


        // Delete Stellar account entries if they exist.
        try {

            const idSig = getState().StellarAccount.data ?
                getState().StellarAccount.data.idSig : string.empty()
            const paySig =  getState().StellarAccount.data ?
                getState().StellarAccount.data.paySig : string.empty()

            if (idSig || paySig) {
                await dispatch(await ProgressActions.toggleProgress(
                    "ledgerauth", "Waiting for device ..."
                ))
                await dispatch(await queryDevice())
                await dispatch(await ProgressActions.toggleProgress(
                    "ledgerauth", "Building transaction ..."
                ))

                const clearDataTx = await buildClearDataTx(
                    getState().LedgerHQ.publicKey
                )

                await dispatch(await ProgressActions.toggleProgress(
                    "ledgerauth", "Awaiting signature ..."
                ))

                const signedClearDataTx = await signTransaction(
                    insertPathIndex(getState().LedgerHQ.bip32Path),
                    getState().LedgerHQ.publicKey,
                    clearDataTx
                )

                await dispatch(await ProgressActions.toggleProgress(
                    "ledgerauth", "Submitting transaction ..."
                ))
                await submitTransaction(signedClearDataTx)
                await dispatch(await ProgressActions.toggleProgress(
                    "ledgerauth", string.empty()
                ))
            }


        } catch (error) {

            await dispatch(await surfaceSnacky("error", error.message))
            await dispatch(await clearInputErrorMessages())
            await dispatch(await ProgressActions.resetState())
            return // Stop right here if declined Ledger action

        }


        const { userId, token } = getState().LoginManager


        // Delete user from the email subscription list (if desired).
        try {
            if (!keepEmail) {
                await dispatch(await ProgressActions.toggleProgress(
                    "implosion", "Unsubscribing your email ..."
                ))

                await unsubscribeEmail(userId, token, user.email)
            }
        } catch (error) {

            await dispatch(await surfaceSnacky("error", error.message))

        }


        // Delete Firebase user and backend data.
        try {

            await dispatch(await ProgressActions.toggleProgress(
                "implosion", "Wiping cloud data ..."
            ))

            await implodeCloudData(userId, token)

            await dispatch(await ProgressActions.toggleProgress(
                "implosion", "Deleting user ..."
            ))

            await user.delete()


        } catch (error) {

            await dispatch(await surfaceSnacky("error", error.message))

        } finally {

            await dispatch(await signOut())
            await dispatch(await clearInputErrorMessages())
            await dispatch(await ProgressActions.resetState())

        }
    }
