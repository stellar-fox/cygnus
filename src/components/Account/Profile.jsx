import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { string } from "@xcmats/js-toolbox"
import { config } from "../../config"
import { gravatar, gravatarSize, appTLD } from "../StellarFox/env"
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

import firebaseApp from "../../firebase"

// import { firebaseApp } from "../../components/StellarFox"
import { signTransaction } from "../../lib/ledger"
import { action as AccountAction } from "../../redux/Account"
import { action as AlertAction } from "../../redux/Alert"
import { action as ModalAction } from "../../redux/Modal"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { action as TransactionAction } from "../../redux/Transaction"
import LCARSInput from "../../lib/common/LCARSInput"
import Button from "../../lib/mui-v1/Button"
import Divider from "../../lib/mui-v1/Divider"
import Modal from "../../lib/common/Modal"
import TxConfirm from "./TxConfirm"
import TxBroadcastMsg from "../Balances/TxBroadcastMsg"
import MsgBadgeError from "./MsgBadgeError"
import MsgBadgeSuccess from "./MsgBadgeSuccess"
import MsgBadgeWarning from "./MsgBadgeWarning"
import { Fade, CircularProgress, Typography } from "@material-ui/core"
import { surfaceSnacky } from "../../thunks/main"
import { queryDevice } from "../../thunks/ledgerhq"

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
    showError = message => {
        this.props.hideModal()
        this.props.showAlert(message, "Error")
        this.props.setState({ message: string.empty() })
    }

    // ...
    updateResource = async (resource, attr) =>
        Axios.post(`${config.api}/${resource}/update/`, {
            ...attr,
            user_id: this.props.userId,
            token: this.props.token,
        })

    // ...
    updateProfile = async () => {
        if (!this.props.emailVerified) {
            this.props.surfaceSnacky(
                "error",
                "Please verify your email address first."
            )
            return
        }

        /**
         * Update backend with user info data.
         */
        try {
            this.setState({ loadingUpdateProfile: true })
            await this.props.setState({
                messageUserData: "Preparing data ...",
            })
            await this.updateUserDataFingerprint()
            await this.updateResource("user", {
                first_name: this.props.state.firstName,
                last_name: this.props.state.lastName,
            })
        } catch (error) {
            this.setState({ loadingUpdateProfile: false })
            await this.props.surfaceSnacky("error", error.message)
            return
        }

        /**
         * Update Stellar Ledger with user info digest hash.
         */
        try {
            await this.props.setState({
                messageUserData: "Waiting for device ...",
            })

            await this.props.queryDevice()

            await this.props.setState({
                messageUserData: "Preparing transaction ...",
            })

            const tx = await this.buildTransaction(
                "idSig",
                this.props.state.fingerprintUserData
            )

            await this.props.setTransaction(tx)

            await this.props.showModal("txConfirmProfile")

            await this.props.setState({ messageUserData: string.empty() })

            const signedTx = await signTransaction(
                insertPathIndex(this.props.bip32Path),
                this.props.publicKey,
                tx
            )

            await this.props.showModal("txBroadcast")

            await submitTransaction(signedTx)

            await this.props.hideModal()

            await this.props.updateAccountTree(
                await loadAccount(this.props.publicKey)
            )

            this.setState({ loadingUpdateProfile: false })

            await this.props.surfaceSnacky(
                "success",
                "User data has been updated."
            )

            await this.props.clearTransaction()
        } catch (error) {
            await this.props.clearTransaction()
            this.setState({ loadingUpdateProfile: false })
            await this.props.setState({ messageUserData: string.empty() })
            await this.props.hideModal()
            await this.props.surfaceSnacky(
                "warning",
                "User data updated without signature."
            )
        }
    }

    // ...
    updatePaymentData = async () => {
        if (!this.props.emailVerified) {
            this.props.surfaceSnacky(
                "error",
                "Please verify your email address first."
            )
            return
        }

        /**
         * Update backend with user payment data.
         */
        try {
            this.setState({ loadingUpdatePaymentAddress: true })
            await this.props.setState({
                messagePaymentData: "Preparing data ...",
            })

            this.updatePaymentDataFingerprint()

            const alias = this.props.state.paymentAddress.match(/\*/)
                    ? this.props.state.paymentAddress
                    : `${this.props.state.paymentAddress}*${appTLD}`,
                memo_type = this.props.state.memo.length > 0 ? "text" : null,
                memo = this.props.state.memo

            await this.updateResource("account", {
                alias,
                memo_type,
                memo,
            })

            await this.props.setState({
                paymentAddress: federationIsAliasOnly(
                    this.props.state.paymentAddress
                )
                    ? `${this.props.state.paymentAddress}*${appTLD}`
                    : this.props.state.paymentAddress,
            })
        } catch (error) {
            if (error.response.data) {
                await this.props.surfaceSnacky(
                    "error",
                    error.response.data.error
                )
            } else {
                await this.props.surfaceSnacky("error", error.message)
            }

            this.setState({ loadingUpdatePaymentAddress: false })
            await this.props.setState({ messagePaymentData: string.empty() })

            return
        }

        /**
         * Update Stellar Ledger with user payment data digest hash.
         */
        try {
            await this.props.setState({
                messagePaymentData: "Waiting for device ...",
            })

            await this.props.queryDevice()

            await this.props.setState({
                messagePaymentData: "Preparing transaction ...",
            })

            const tx = await this.buildTransaction(
                "paySig",
                this.props.state.fingerprintPaymentData
            )

            await this.props.setTransaction(tx)

            await this.props.showModal("txConfirmPay")

            await this.props.setState({ messagePaymentData: string.empty() })

            const signedTx = await signTransaction(
                insertPathIndex(this.props.bip32Path),
                this.props.publicKey,
                tx
            )

            await this.props.showModal("txBroadcast")

            await submitTransaction(signedTx)

            await this.props.hideModal()

            await this.props.updateAccountTree(
                await loadAccount(this.props.publicKey)
            )

            this.setState({ loadingUpdatePaymentAddress: false })

            await this.props.clearTransaction()

            await this.props.surfaceSnacky(
                "success",
                "Payment data has been updated."
            )
        } catch (error) {
            await this.props.clearTransaction()
            this.setState({ loadingUpdatePaymentAddress: false })
            await this.props.setState({ messagePaymentData: string.empty() })
            await this.props.hideModal()
            await this.props.surfaceSnacky(
                "warning",
                "Payment data updated without signature."
            )
        }
    }

    // ...
    changeFirstName = event =>
        this.props.setState({ firstName: event.target.value })

    // ...
    changeLastName = event =>
        this.props.setState({ lastName: event.target.value })

    // ...
    changePaymentAddress = event =>
        this.props.setState({ paymentAddress: event.target.value })

    // ...
    changeMemo = event => this.props.setState({ memo: event.target.value })

    // ...
    changeEmail = event => {
        if (emailValid(event.target.value)) {
            this.props.setState({
                gravatarPath: this.setGravatarPath(event.target.value),
            })
        }
        this.props.setState({ email: event.target.value })
    }

    // ...
    updateUserDataFingerprint = async () =>
        await this.props.setState({
            fingerprintUserData: dataDigest({
                firstName: this.props.state.firstName,
                lastName: this.props.state.lastName,
                email: this.props.state.email,
            }),
        })

    // ...
    updatePaymentDataFingerprint = () =>
        this.props.setState({
            fingerprintPaymentData: dataDigest({
                paymentAddress: federationIsAliasOnly(
                    this.props.state.paymentAddress
                )
                    ? `${this.props.state.paymentAddress}*${appTLD}`
                    : this.props.state.paymentAddress,
                memo: this.props.state.memo,
            }),
        })

    // ...
    verifyEmail = async () => {
        try {
            this.setState({ loadingVerifyEmail: true })
            await firebaseApp
                .auth("session")
                .currentUser.sendEmailVerification()
            this.setState({ loadingVerifyEmail: false })
            this.props.surfaceSnacky("success", "Verification email sent.")
        } catch (error) {
            this.props.surfaceSnacky("error", error.message)
            this.setState({ loadingVerifyEmail: false })
        }
    }

    // ...
    render = () => (
        <Fragment>
            <Modal
                open={
                    (this.props.Modal.modalId === "txConfirmProfile" ||
                        this.props.Modal.modalId === "txConfirmPay") &&
                    this.props.Modal.visible
                }
            >
                <TxConfirm
                    data={
                        this.props.Modal.modalId === "txConfirmProfile"
                            ? "idSig"
                            : "paySig"
                    }
                />
            </Modal>

            <Modal
                open={
                    this.props.Modal.modalId === "txBroadcast" &&
                    this.props.Modal.visible
                }
            >
                <TxBroadcastMsg title="Digital fingerprint is being lodged." />
            </Modal>

            <div className="tab-content">
                <div className="flex-box-row space-between">
                    <div>
                        <Typography variant="body1" color="secondary">
                            Sign your digital profile identity.
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            This information is only visible to your contacts
                            and requires your cryptographic signature to change.
                        </Typography>
                    </div>
                    <div>
                        <img
                            className="image"
                            src={`${gravatar}${this.props.state.gravatar}?${gravatarSize}&d=robohash`}
                            alt="Gravatar"
                        />
                    </div>
                </div>

                <LCARSInput
                    width="100%"
                    className="lcars-input p-b p-t"
                    value={this.props.state.firstName || string.empty()}
                    label="First Name"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeFirstName}
                    subLabel={`First Name: ${this.props.state.firstName}`}
                />
                <LCARSInput
                    className="lcars-input p-b p-t"
                    value={this.props.state.lastName || string.empty()}
                    label="Last Name"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeLastName}
                    subLabel={`Last Name: ${this.props.state.lastName}`}
                />
                <LCARSInput
                    className="lcars-input p-t p-b"
                    value={this.props.state.email}
                    label={
                        <span
                            className={
                                this.props.emailVerified
                                    ? "lcars-label-badge verified"
                                    : "lcars-label-badge unverified"
                            }
                        >
                            Email
                        </span>
                    }
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeEmail}
                    subLabel={`Email: ${this.props.state.email}`}
                    disabled
                />

                {this.props.idSig ? (
                    signatureValid(
                        {
                            firstName: this.props.state.firstName,
                            lastName: this.props.state.lastName,
                            email: this.props.state.email,
                        },
                        this.props.idSig
                    ) ? (
                        <MsgBadgeSuccess />
                    ) : (
                        <MsgBadgeError />
                    )
                ) : (
                    <MsgBadgeWarning />
                )}

                <Button
                    disabled={this.state.loadingUpdateProfile}
                    color="secondary"
                    onClick={this.updateProfile}
                    style={{ minWidth: "200px" }}
                >
                    {this.state.loadingUpdateProfile ? (
                        <CircularProgress
                            color="secondary"
                            thickness={4}
                            size={25}
                        />
                    ) : (
                        "Update User Data"
                    )}
                </Button>
                <he.Nbsp />
                <he.Nbsp />
                {!this.props.emailVerified && (
                    <Button
                        disabled={this.state.loadingVerifyEmail}
                        color="secondary"
                        onClick={this.verifyEmail}
                        style={{ minWidth: "200px" }}
                    >
                        {this.state.loadingVerifyEmail ? (
                            <CircularProgress
                                color="secondary"
                                thickness={4}
                                size={25}
                            />
                        ) : (
                            "Verify Email"
                        )}
                    </Button>
                )}

                <div style={{ height: "2rem" }} className="f-b p-t-small tiny">
                    {this.props.state.messageUserData.length > 0 ? (
                        <Fade in={true} out={true}>
                            <span className="yellow-light">
                                {this.props.state.messageUserData}
                            </span>
                        </Fade>
                    ) : (
                        <he.Nbsp />
                    )}
                </div>

                <Divider color="secondary" />

                <div className="p-t flex-box-row">
                    <div>
                        <Typography variant="body1" color="secondary">
                            Sign your digital payment identity.
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            This information is published in a global directory
                            and requires your cryptographic signature to change.
                        </Typography>
                    </div>
                </div>

                <LCARSInput
                    className="lcars-input p-t-large p-b"
                    value={this.props.state.paymentAddress || string.empty()}
                    label="Payment Address Alias"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changePaymentAddress}
                    subLabel={
                        federationIsAliasOnly(this.props.state.paymentAddress)
                            ? `Payment Address: ${this.props.state.paymentAddress}*${appTLD}`
                            : `Payment Address: ${this.props.state.paymentAddress}`
                    }
                />
                <LCARSInput
                    className="lcars-input p-t p-b"
                    value={ntoes(this.props.state.memo)}
                    label="Memo"
                    inputType="text"
                    maxLength="28"
                    autoComplete="off"
                    handleChange={this.changeMemo}
                    subLabel={`Memo: ${this.props.state.memo}`}
                />

                {this.props.paySig ? (
                    signatureValid(
                        {
                            paymentAddress: federationIsAliasOnly(
                                this.props.state.paymentAddress
                            )
                                ? `${this.props.state.paymentAddress}*${appTLD}`
                                : this.props.state.paymentAddress,
                            memo: this.props.state.memo,
                        },
                        this.props.paySig
                    ) ? (
                        <MsgBadgeSuccess />
                    ) : (
                        <MsgBadgeError />
                    )
                ) : (
                    <MsgBadgeWarning />
                )}

                <Button
                    disabled={this.state.loadingUpdatePaymentAddress}
                    color="secondary"
                    onClick={this.updatePaymentData}
                    style={{ minWidth: "200px" }}
                >
                    {this.state.loadingUpdatePaymentAddress ? (
                        <CircularProgress
                            color="secondary"
                            thickness={4}
                            size={25}
                        />
                    ) : (
                        "Update Payment Data"
                    )}
                </Button>

                <div className="f-b p-t-small tiny">
                    {this.props.state.messagePaymentData.length > 0 ? (
                        <Fade in={true} out={true}>
                            <span className="yellow-light">
                                {this.props.state.messagePaymentData}
                            </span>
                        </Fade>
                    ) : (
                        <he.Nbsp />
                    )}
                </div>
            </div>
        </Fragment>
    )
}

// ...
export default connect(
    // bind state to props.
    state => ({
        emailVerified: state.Auth.verified,
        state: state.Account,
        token: state.LoginManager.token,
        userId: state.LoginManager.userId,
        accountId: state.StellarAccount.accountId,
        network: state.StellarAccount.horizon,
        publicKey: state.LedgerHQ.publicKey,
        bip32Path: state.LedgerHQ.bip32Path,
        Modal: state.Modal,
        paySig: state.StellarAccount.data
            ? state.StellarAccount.data.paySig
                ? state.StellarAccount.data.paySig
                : null
            : null,
        idSig: state.StellarAccount.data
            ? state.StellarAccount.data.idSig
                ? state.StellarAccount.data.idSig
                : null
            : null,
    }),
    // bind dispatch to props.
    dispatch =>
        bindActionCreators(
            {
                setState: AccountAction.setState,
                showAlert: AlertAction.showAlert,
                hideModal: ModalAction.hideModal,
                showModal: ModalAction.showModal,
                updateAccountTree: StellarAccountAction.updateAccountAttributes,
                surfaceSnacky,
                queryDevice,
                setTransaction: TransactionAction.setTransaction,
                clearTransaction: TransactionAction.clearTransaction,
            },
            dispatch
        )
)(Profile)
