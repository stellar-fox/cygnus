import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { emptyString } from "@xcmats/js-toolbox"
import { config } from "../../config"
import {
    gravatar,
    gravatarSize
} from "../StellarFox/env"
import {
    dataDigest,
    emailValid,
    federationIsAliasOnly,
    htmlEntities as he,
    insertPathIndex,
    ntoes,
    signatureValid,
} from "../../lib/utils"
import {
    buildSetDataTx,
    loadAccount,
    submitTransaction,
} from "../../lib/stellar-tx"
import { withLoginManager } from "../LoginManager"
import { firebaseApp } from "../../components/StellarFox"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import { action as AccountAction } from "../../redux/Account"
import { action as AlertAction } from "../../redux/Alert"
import { action as ModalAction } from "../../redux/Modal"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import Input from "../../lib/common/Input"
import Button from "../../lib/mui-v1/Button"
import Divider from "../../lib/mui-v1/Divider"
import Modal from "../../lib/common/Modal"
import TxConfirmProfile from "./TxConfirmProfile"
import TxConfirmPay from "./TxConfirmPay"
import TxBroadcast from "./TxBroadcast"
import MsgBadgeError from "./MsgBadgeError"
import MsgBadgeSuccess from "./MsgBadgeSuccess"
import MsgBadgeWarning from "./MsgBadgeWarning"




// <Profile> component
class Profile extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    state = {
        verifyEmailDisabled: false,
    }

    // ...
    buildTransaction = async (name, value) => {
        const txData = {
            source: this.props.accountId,
            network: this.props.network,
            name,
            value,
        }
        return await buildSetDataTx(txData)
    }


    // ...
    showError = (message) => {
        this.props.hideModal()
        this.props.showAlert(message, "Error")
        this.props.setState({ message: emptyString(), })
    }


    // ...
    updateResource = async (resource, attr) => Axios
        .post(`${config.api}/${resource}/update/`, {
            ...attr,
            user_id: this.props.userId,
            token: this.props.token,
        })


    // ...
    updateProfile = async () => {

        /**
         * Update backend with user info data.
         */
        try {
            this.props.setState({
                messageUserData: "Preparing data ...",
            })

            this.updateUserDataFingerprint()

            await this.updateResource("user",{
                first_name: this.props.state.firstName,
                last_name: this.props.state.lastName,
            })

        } catch (error) {

            this.props.showAlert(error.message, "Error")
            return

        }

        /**
         * User's account is not on Stellar Ledger so there is no place to
         * lodge the signature, hence, return from the function at this point.
         */
        if (!this.props.accountId) {
            this.props.popupSnackbar("User data updated without signature.")
            this.props.setState({ messageUserData: emptyString(), })
            return
        }

        /**
         * Update Stellar Ledger with user info digest hash.
         */
        try {

            this.props.setState({
                messageUserData: "Waiting for device ...",
            })

            await getSoftwareVersion()

            this.props.setState({
                messageUserData: "Preparing transaction ...",
            })

            const tx = await this.buildTransaction(
                "idSig",
                this.props.state.fingerprintUserData
            )

            this.props.showModal("txConfirmProfile")

            this.props.setState({ messageUserData: emptyString(), })

            const signedTx = await signTransaction(
                insertPathIndex(this.props.bip32Path),
                this.props.publicKey,
                tx
            )

            this.props.showModal("txBroadcast")

            await submitTransaction(
                signedTx, this.props.network
            )

            this.props.hideModal()

            this.props.updateAccountTree(await loadAccount(
                this.props.publicKey, this.props.network
            ))

            this.props.popupSnackbar("User data has been updated.")

        } catch (error) {

            this.props.setState({ messageUserData: emptyString(), })
            this.props.hideModal()
            this.props.showAlert(error.message, "Error")

        }
    }


    // ...
    updatePaymentData = async () => {

        /**
         * Update backend with user payment data.
         */
        try {
            this.props.setState({
                messagePaymentData: "Preparing data ...",
            })

            this.updatePaymentDataFingerprint()

            const
                alias = this.props.state.paymentAddress.match(/\*/) ?
                    (this.props.state.paymentAddress) :
                    (`${this.props.state.paymentAddress}*stellarfox.net`),

                memo_type = this.props.state.memo.length > 0 ? "text" : null,

                memo = this.props.state.memo

            await this.updateResource("account", {
                alias,
                memo_type,
                memo,
            })

            this.props.setState({
                paymentAddress: federationIsAliasOnly(this.props.state.paymentAddress) ?
                    `${this.props.state.paymentAddress}*stellarfox.net` :
                    this.props.state.paymentAddress,
            })

        } catch (error) {

            this.props.showAlert(error.message, "Error")
            return

        }

        /**
         * User's account is not on Stellar Ledger so there is no place to
         * lodge the signature, hence, return from the function at this point.
         */
        if (!this.props.accountId) {
            this.props.popupSnackbar("Payment data updated without signature.")
            this.props.setState({ messagePaymentData: emptyString(), })
            return
        }

        /**
         * Update Stellar Ledger with user payment data digest hash.
         */
        try {

            this.props.setState({
                messagePaymentData: "Waiting for device ...",
            })

            await getSoftwareVersion()

            this.props.setState({
                messagePaymentData: "Preparing transaction ...",
            })

            const tx = await this.buildTransaction(
                "paySig",
                this.props.state.fingerprintPaymentData
            )

            this.props.showModal("txConfirmPay")

            this.props.setState({ messagePaymentData: emptyString(), })

            const signedTx = await signTransaction(
                insertPathIndex(this.props.bip32Path),
                this.props.publicKey,
                tx
            )

            this.props.showModal("txBroadcast")

            await submitTransaction(
                signedTx, this.props.network
            )

            this.props.hideModal()

            this.props.updateAccountTree(await loadAccount(
                this.props.publicKey, this.props.network
            ))

            this.props.popupSnackbar("Payment data has been updated.")

        } catch (error) {

            this.props.setState({ messagePaymentData: emptyString(), })
            this.props.hideModal()
            this.props.showAlert(error.message, "Error")

        }
    }


    // ...
    changeFirstName = (event) =>
        this.props.setState({ firstName: event.target.value, })


    // ...
    changeLastName = (event) =>
        this.props.setState({ lastName: event.target.value, })


    // ...
    changePaymentAddress = (event) =>
        this.props.setState({paymentAddress: event.target.value,})


    // ...
    changeMemo = (event) =>
        this.props.setState({ memo: event.target.value, })


    // ...
    changeEmail = (event) => {
        if (emailValid(event.target.value)) {
            this.props.setState({
                gravatarPath: this.setGravatarPath(event.target.value),
            })
        }
        this.props.setState({ email: event.target.value, })
    }


    // ...
    updateUserDataFingerprint = () => this.props.setState({
        fingerprintUserData: dataDigest({
            firstName: this.props.state.firstName,
            lastName: this.props.state.lastName,
            email: this.props.state.email,
        }),
    })


    // ...
    updatePaymentDataFingerprint = () => this.props.setState({
        fingerprintPaymentData: dataDigest({
            paymentAddress: federationIsAliasOnly(this.props.state.paymentAddress) ?
                `${this.props.state.paymentAddress}*stellarfox.net` :
                this.props.state.paymentAddress,
            memo: this.props.state.memo,
        }),
    })


    // ...
    verifyEmail = () => {
        try {
            firebaseApp.auth("session").currentUser.sendEmailVerification()
            this.setState({ verifyEmailDisabled: true, })
            this.props.popupSnackbar("Verification email sent.")
        } catch (error) {
            this.props.showAlert(error.message, "Error")
            this.setState({ verifyEmailDisabled: false, })
        }

    }


    // ...
    render = () =>
        <Fragment>
            <Modal
                open={
                    this.props.Modal.modalId === "txConfirmProfile" &&
                    this.props.Modal.visible
                }
                title="Confirm on Hardware Device"
            >
                <TxConfirmProfile />
            </Modal>

            <Modal
                open={
                    this.props.Modal.modalId === "txConfirmPay" &&
                    this.props.Modal.visible
                }
                title="Confirm on Hardware Device"
            >
                <TxConfirmPay />
            </Modal>

            <Modal
                open={
                    this.props.Modal.modalId === "txBroadcast" &&
                    this.props.Modal.visible
                }
                title="Updating ..."
            >
                <TxBroadcast />
            </Modal>

            <div className="tab-content">
                <div className="f-b space-between">
                    <div>
                        <h2 className="tab-content-headline">
                            Account Profile
                        </h2>
                        <div className="account-title">
                            Manage your profile details.
                        </div>
                        <div className="account-subtitle">
                            The details of your account profile are
                            confidential and contribute to KYC/AML
                            compliance. Any changes to the following fields
                            will require your digital signature.
                        </div>
                    </div>
                    <figure style={{ marginRight: "0px", marginBottom: "0px",}}>
                        <img
                            className="image"
                            src={`${gravatar}${this.props.state.gravatar}?${
                                gravatarSize}&d=robohash`
                            }
                            alt="Gravatar"
                        />
                    </figure>
                </div>
                <Input
                    width="100%"
                    className="lcars-input p-b p-t-large"
                    value={this.props.state.firstName}
                    label="First Name"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeFirstName}
                    subLabel={`First Name: ${this.props.state.firstName}`}
                />
                <Input
                    className="lcars-input p-b p-t"
                    value={this.props.state.lastName}
                    label="Last Name"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeLastName}
                    subLabel={`Last Name: ${this.props.state.lastName}`}
                />
                <Input
                    className="lcars-input p-t p-b"
                    value={this.props.state.email}
                    label={this.props.emailVerified ?
                        "Email" : "Email - Not Verified"}
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeEmail}
                    subLabel={`Email: ${this.props.state.email}`}
                    disabled
                />

                {this.props.idSig ?
                    (signatureValid({
                        firstName: this.props.state.firstName,
                        lastName: this.props.state.lastName,
                        email: this.props.state.email,
                    }, this.props.idSig) ?
                        <MsgBadgeSuccess /> :
                        <MsgBadgeError />) :
                    <MsgBadgeWarning />
                }

                <Button
                    color="secondary"
                    onClick={this.updateProfile}
                >Update User Data</Button>
                <he.Nbsp /><he.Nbsp />
                {!this.props.emailVerified &&
                    <Button
                        disabled={this.state.verifyEmailDisabled}
                        color="secondary"
                        onClick={this.verifyEmail}
                    >Verify Email</Button>
                }

                <div className="f-b p-t-small tiny">{
                    this.props.state.messageUserData.length > 0 ?
                        this.props.state.messageUserData : <he.Nbsp />
                }</div>
                <Divider color="secondary" />

                <div className="f-b space-between">
                    <div>
                        <h2 className="tab-content-headline">
                            Payment Address
                        </h2>
                        <div className="account-title">
                            Manage your payment address details.
                        </div>
                        <div className="account-subtitle">
                            Your payment address is visible
                            to the public by default. Any changes to the
                            following settings will require your digital
                            signature.
                        </div>
                    </div>
                </div>
                <Input
                    className="lcars-input p-t-large p-b"
                    value={this.props.state.paymentAddress}
                    label="Payment Address Alias"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changePaymentAddress}
                    subLabel={
                        federationIsAliasOnly(this.props.state.paymentAddress)
                            ? `Payment Address: ${
                                this.props.state
                                    .paymentAddress
                            }*stellarfox.net`
                            : `Payment Address: ${
                                this.props.state
                                    .paymentAddress
                            }`
                    }
                />
                <Input
                    className="lcars-input p-t p-b"
                    value={ntoes(this.props.state.memo)}
                    label="Memo"
                    inputType="text"
                    maxLength="28"
                    autoComplete="off"
                    handleChange={this.changeMemo}
                    subLabel={`Memo: ${this.props.state.memo}`}
                />

                {this.props.paySig ?
                    (signatureValid({
                        paymentAddress: federationIsAliasOnly(this.props.state.paymentAddress) ?
                            `${this.props.state.paymentAddress}*stellarfox.net` :
                            this.props.state.paymentAddress,
                        memo: this.props.state.memo,
                    }, this.props.paySig) ?
                        <MsgBadgeSuccess /> :
                        <MsgBadgeError />) :
                    <MsgBadgeWarning />
                }

                <Button color="secondary" onClick={this.updatePaymentData}>
                    Update Payment Data
                </Button>
                <div className="f-b p-t-small tiny">{
                    this.props.state.messagePaymentData.length > 0 ?
                        this.props.state.messagePaymentData : <he.Nbsp />
                }</div>
            </div>
        </Fragment>
}


// ...
export default compose(
    withLoginManager,
    connect(
        // bind state to props.
        (state) => ({
            emailVerified: state.Auth.verified,
            state: state.Account,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
            accountId: state.StellarAccount.accountId,
            network: state.StellarAccount.horizon,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            Modal: state.Modal,
            paySig: state.StellarAccount.data ?
                (state.StellarAccount.data.paySig ?
                    state.StellarAccount.data.paySig : null) : null,
            idSig: state.StellarAccount.data ?
                (state.StellarAccount.data.idSig ?
                    state.StellarAccount.data.idSig : null) : null,
        }),
        // bind dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            popupSnackbar: SnackbarAction.popupSnackbar,
            showAlert: AlertAction.showAlert,
            hideModal: ModalAction.hideModal,
            showModal: ModalAction.showModal,
            updateAccountTree: StellarAccountAction.loadStellarAccount,
        }, dispatch)
    )
)(Profile)
