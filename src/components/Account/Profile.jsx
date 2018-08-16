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

import { CircularProgress, Typography } from "@material-ui/core"
import { Animated } from "react-animated-css"


// ...
const RequestProgress = ({ color, label, }) =>
    <div style={{ height: "0px", opacity: "0.75", }}>
        <div style={{ height: "0px", marginBottom: "-0.65rem", opacity: "0.5", }}>
            {label}
        </div>
        <CircularProgress color={color || "primary"} thickness={4} size={20} />
    </div>



// <Profile> component
class Profile extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    state = {
        loadingVerifyEmail: false,
        loadingUpdateProfile: false,
        loadingUpdatePaymentAddress: false,
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
            this.setState({ loadingUpdateProfile: true, })
            this.props.setState({
                messageUserData: "Preparing data ...",
            })

            this.updateUserDataFingerprint()

            await this.updateResource("user",{
                first_name: this.props.state.firstName,
                last_name: this.props.state.lastName,
            })
        } catch (error) {
            this.setState({ loadingUpdateProfile: false, })
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
            this.setState({ loadingUpdateProfile: false, })
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
            this.setState({ loadingUpdateProfile: false, })
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
            this.setState({ loadingUpdatePaymentAddress: true, })
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
            this.setState({ loadingUpdatePaymentAddress: false, })
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
            this.setState({ loadingUpdatePaymentAddress: false, })
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
            this.setState({ loadingUpdatePaymentAddress: false, })
            this.props.popupSnackbar("Payment data has been updated.")

        } catch (error) {
            this.setState({ loadingUpdatePaymentAddress: false, })
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
            this.setState({ loadingVerifyEmail: true, })
            firebaseApp.auth("session").currentUser.sendEmailVerification()
            this.setState({ loadingVerifyEmail: false, })
            this.props.popupSnackbar("Verification email sent.")
        } catch (error) {
            this.props.showAlert(error.message, "Error")
            this.setState({ loadingVerifyEmail: false, })
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

                <div className="flex-box-row space-between">
                    <div>
                        <Typography variant="title" color="secondary">
                            Account Profile
                        </Typography>
                        <Typography variant="body1" color="secondary">
                            Manage your profile details.
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            This information is only visible to your contacts.
                        </Typography>
                    </div>
                    <div>
                        <img
                            className="image"
                            src={`${gravatar}${this.props.state.gravatar}?${
                                gravatarSize}&d=robohash`
                            }
                            alt="Gravatar"
                        />
                    </div>
                </div>

                <Input
                    width="100%"
                    className="lcars-input p-b p-t"
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
                        "Email" : <span className="unverified">Email</span>}
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
                    disabled={this.state.loadingUpdateProfile}
                    color="secondary"
                    onClick={this.updateProfile}
                >
                    {this.state.loadingUpdateProfile ?
                        <RequestProgress
                            label="Update User Data"
                            color="secondary"
                        /> : "Update User Data"
                    }
                </Button>
                <he.Nbsp /><he.Nbsp />
                {!this.props.emailVerified &&
                    <Button
                        disabled={this.state.loadingVerifyEmail}
                        color="secondary"
                        onClick={this.verifyEmail}
                    >
                        {this.state.loadingVerifyEmail ?
                            <RequestProgress label="Verify Email"
                                color="secondary"
                            /> : "Verify Email"
                        }
                    </Button>
                }

                <div style={{ height: "2rem", }} className="f-b p-t-small tiny">{
                    this.props.state.messageUserData.length > 0 ?
                        <Animated animationIn="fadeInDown"
                            animationOut="fadeOutUp"
                            isVisible={true}
                        >{this.props.state.messageUserData}
                        </Animated> : <he.Nbsp />
                }</div>

                <Divider color="secondary" />

                <div className="p-t flex-box-row">
                    <div>
                        <Typography variant="title" color="secondary">
                            Payment Address
                        </Typography>
                        <Typography variant="body1" color="secondary">
                            Manage your payment address details.
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            This information is published in publically
                            accessable directory.
                        </Typography>
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

                <Button
                    disabled={this.state.loadingUpdatePaymentAddress}
                    color="secondary"
                    onClick={this.updatePaymentData}
                >
                    {this.state.loadingUpdatePaymentAddress ?
                        <RequestProgress label="Update Payment Data"
                            color="secondary"
                        /> : "Update Payment Data"
                    }

                </Button>

                <div className="f-b p-t-small tiny">{
                    this.props.state.messagePaymentData.length > 0 ?
                        <Animated animationIn="fadeInDown"
                            animationOut="fadeOutUp"
                            isVisible={true}
                        >
                            {this.props.state.messagePaymentData}
                        </Animated> : <he.Nbsp />
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
