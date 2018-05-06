import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { config } from "../../config"
import {
    gravatar,
    gravatarSize
} from "../StellarFox/env"
import Input from "../../lib/common/Input"
import Button from "../../lib/mui-v1/Button"
import Divider from "../../lib/mui-v1/Divider"
import Modal from "../../lib/common/Modal"
import MD5 from "../../lib/md5"
import TxConfirmProfile from "./TxConfirmProfile"
import TxConfirmPay from "./TxConfirmPay"
import TxBroadcast from "./TxBroadcast"
import MsgBadgeError from "./MsgBadgeError"
import MsgBadgeSuccess from "./MsgBadgeSuccess"
import MsgBadgeWarning from "./MsgBadgeWarning"
import {
    dataDigest,
    signatureValid,
    emailValid,
    federationIsAliasOnly,
    insertPathIndex,
    htmlEntities as he,
} from "../../lib/utils"
import { buildSetDataTx, submitTransaction } from "../../lib/stellar-tx"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import { action as AccountAction } from "../../redux/Account"
import { action as AlertAction } from "../../redux/Alert"
import { action as ModalAction } from "../../redux/Modal"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { withLoginManager } from "../LoginManager"




// <Profile> component
class Profile extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    componentDidMount = () => {
        if (this.props.loginManager.isAuthenticated()) {
            this.getUserData()
            this.getAccountData()
        }
    }


    // ...
    getUserData = () => Axios
        .post(`${config.api}/user/`, {
            id: this.props.userId,
            token: this.props.token,
        })
        .then(({data: {data,},}) => {
            this.props.setState({
                firstName: data.first_name || "",
                lastName: data.last_name || "",
                email: data.email,
                gravatarPath: this.setGravatarPath(data.email),
            })
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error.message))


    // ...
    getAccountData = () => Axios
        .post(`${config.api}/account/`, {
            id: this.props.userId,
            token: this.props.token,
        })
        .then(({data: {data,},}) => {
            this.props.setState({
                paymentAddress: (data.alias  &&  data.domain) ?
                    `${data.alias}*${data.domain}` : "",
                discoverable: data.visible,
                memo: data.memo ? data.memo : "",
            })
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error.message))


    // ...
    setGravatarPath = (email) =>
        `${gravatar}${MD5(email)}${gravatarSize}`


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
        this.props.setState({
            message: "",
        })
    }


    // ...
    updateResource = async (resource, attr) => Axios
        .post(`${config.api}/${resource}/update/`, {
            ...attr,
            id: this.props.userId,
            token: this.props.token,
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error))


    // ...
    updateProfile = async () => {
        try {
            
            this.updateUserDataFingerprint()

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

            this.props.setState({
                messageUserData: "",
            })

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

            await this.updateResource("user",{
                first_name: this.props.state.firstName,
                last_name: this.props.state.lastName,
            })

            this.props.popupSnackbar("User data has been updated.")

        } catch (error) {
            this.props.setState({
                messageUserData: "",
            })
            this.props.hideModal()
            this.props.showAlert(error.message, "Error")
        }
    }


    // ...
    updatePaymentData = async () => {
        try {
            
            this.updatePaymentDataFingerprint()
            
            const
                alias = this.props.state.paymentAddress.match(/\*/) ?
                    (this.props.state.paymentAddress) :
                    (`${this.props.state.paymentAddress}*stellarfox.net`),

                memo_type = this.props.state.memo.length > 0 ? "text" : null,

                memo = this.props.state.memo
            
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

            this.props.setState({
                messagePaymentData: "",
            })

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

            await this.updateResource("account", {
                alias,
                memo_type,
                memo,
            })

            this.props.popupSnackbar("Payment data has been updated.")

        } catch (error) {
            this.props.setState({
                messagePaymentData: "",
            })
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
            paymentAddress: this.props.state.paymentAddress,
            memo: this.props.state.memo,
        }),
    })

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
                            src={this.props.state.gravatarPath}
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
                    label="Email"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={this.changeEmail}
                    subLabel={`Email: ${this.props.state.email}`}
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
                    value={this.props.state.memo}
                    label="Memo"
                    inputType="text"
                    maxLength="28"
                    autoComplete="off"
                    handleChange={this.changeMemo}
                    subLabel={`Memo: ${this.props.state.memo}`}
                />
                
                {this.props.paySig ?
                    (signatureValid({
                        paymentAddress: this.props.state.paymentAddress,
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
        }, dispatch)
    )
)(Profile)
