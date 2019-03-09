import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { config } from "../../config"
import RadioButtonGroup from "../../lib/mui-v1/RadioButtonGroup"
import Button from "../../lib/mui-v1/Button"
import Switch from "../../lib/mui-v1/Switch"
import { appName } from "../StellarFox/env"
import { action as AccountAction } from "../../redux/Account"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as ModalAction } from "../../redux/Modal"
import { action as AssetsAction } from "../../redux/AssetManager"
import { action as BalancesAction } from "../../redux/Balances"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { action as PaymentsAction } from "../../redux/Payments"

import Modal from "../../lib/common/Modal"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import { accountIsLocked } from "../../lib/utils"
import {
    Checkbox, CircularProgress, FormControlLabel, Icon, LinearProgress,
    Typography,
} from "@material-ui/core"
import AlertChoiceModal from "../Layout/AlertChoiceModal"
import { action as AlertAction } from "../../redux/Alert"
import { action as AlertChoiceAction } from "../../redux/AlertChoice"
import { withStyles } from "@material-ui/core/styles"
import { delay } from "lodash"
import { htmlEntities as he, insertPathIndex } from "../../lib/utils"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import {
    buildSetDataTx,
    submitTransaction,
} from "../../lib/stellar-tx"
import { implodeCloudData, unsubscribeEmail } from "./api"
import { firebaseApp } from "../../components/StellarFox"
import InputField from "../../lib/mui-v1/InputField"
import { string } from "@xcmats/js-toolbox"




// ...
const styles = (theme) => ({
    barRoot: {
        height: "3px",
        borderRadius: "2px",
    },

    colorPrimary: {
        backgroundColor: theme.palette.secondary.light,
    },

    barColorPrimary: {
        backgroundColor: theme.palette.primary.light,
    },
})




// ...
const RequestProgress = ({ color, label }) =>
    <div style={{ height: "0px", opacity: "0.75" }}>
        <div style={{ height: "0px", marginBottom: "-0.65rem", opacity: "0.5" }}>
            {label}
        </div>
        <CircularProgress color={color || "primary"} thickness={4} size={20} />
    </div>




// <Settings> component
class Settings extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    state = {
        imploding: false,
        keepEmail: false,
        completion: 0,
        progressMessage: "Waiting for device …",
        errorMessage: string.empty(),
        password: string.empty(),
        authError: false,
        authErrorMessage: string.empty(),
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
    implodeAccount = () => {
        this.setState({ keepEmail: false })
        this.props.showChoiceAlert(string.empty(),"Warning")
    }


    // ...
    emailOptOut = (event) => this.setState({ keepEmail: event.target.checked })


    // ...
    nukeAccount = async () => {
        await this.setState({
            authError: false,
            authErrorMessage: string.empty(),
            imploding: true,
        })

        if (!this.state.password) {
            await this.setState({
                authError: true,
                authErrorMessage: "Please enter account password.",
                imploding: false,
            })
            return
        }

        try {
            /**
             * Re-authenticate user with Firebase to confirm password and
             * update user as recently re-authenticated.
             */
            var user = firebaseApp.auth("session").currentUser
            await firebaseApp.auth("session").signInWithEmailAndPassword(
                user.email,
                this.state.password
            )
        } catch (error) {
            await this.setState({
                authError: true,
                authErrorMessage: error.message,
                imploding: false,
            })
            return
        }


        this.props.hideChoiceAlert()
        this.props.showModal("implode")

        try {
            await getSoftwareVersion()
            await this.setState({
                progressMessage: "Preparing transaction ...",
                completion: 5,
            })

            /**
             * Remove idSig data entry from the account.
             */
            if (this.props.idSig) {
                const removeIdSigTx = await this.buildTransaction("idSig", string.empty())
                await this.setState({
                    progressMessage: "Awaiting signature to remove profile data ...",
                    completion: 10,
                })
                const signedRemoveIdSigTx = await signTransaction(
                    insertPathIndex(this.props.bip32Path),
                    this.props.publicKey,
                    removeIdSigTx
                )
                await this.setState({
                    progressMessage: "Removing profile signature data ...",
                    completion: 20,
                })
                await submitTransaction(signedRemoveIdSigTx)
            }

            /**
             * Remove paySig data entry from the account.
             */
            if (this.props.paySig) {
                const removePaySigTx = await this.buildTransaction("paySig", string.empty())
                await this.setState({
                    progressMessage: "Awaiting signature to remove payment address data ...",
                    completion: 35,
                })
                const signedRemovePaySigTx = await signTransaction(
                    insertPathIndex(this.props.bip32Path),
                    this.props.publicKey,
                    removePaySigTx
                )
                await this.setState({
                    progressMessage: "Removing payment address signature data ...",
                    completion: 45,
                })
                await submitTransaction(signedRemovePaySigTx)
            }


            /**
             * Wipe cloud data.
             */
            await this.setState({
                progressMessage: "Wiping cloud data ...",
                completion: 60,
            })
            // delete firebase user
            await user.delete()
            // clean backend data
            await implodeCloudData(this.props.userId, this.props.token)
            // unsubscribe from mailing list
            if (!this.state.keepEmail) {
                await unsubscribeEmail(
                    this.props.userId, this.props.token, user.email
                )
            }

            delay(() => this.setState({
                completion: 100,
            }), 500)

            delay(() => this.setState({
                imploding: false,
                progressMessage: "Implosion completed. Good bye.",
            }), 900)

        } catch (error) {
            this.setState({
                errorMessage: error.message,
            })
        }
    }


    // ...
    abortNuke = () => {
        this.setState({
            imploding: false, keepEmail: false, completion: 0,
            progressMessage: string.empty(), errorMessage: string.empty(),
        })
        this.props.hideChoiceAlert()
        this.props.hideModal()
        if (this.state.completion === 100) {
            firebaseApp.auth("session").signOut()
            this.props.resetAccountState()
            this.props.resetAssetsState()
            this.props.resetBalancesState()
            this.props.resetContactsState()
            this.props.resetLedgerHQState()
            this.props.resetLoginManagerState()
            this.props.resetPaymentsState()
            this.props.resetStellarAccountState()
        }
    }


    // ...
    showSignupModal = () => this.props.showModal("signup")


    // ...
    changeCurrency = (event) => {
        this.props.assetManager.updateExchangeRate(event.target.value)
        this.props.setState({ currency: event.target.value })
        this.saveCurrency(event.target.value)
    }


    // ...
    saveCurrency = (currency) => {
        if (this.props.authenticated) {
            Axios
                .post(
                    `${config.api}/account/update/`, {
                        user_id: this.props.userId,
                        token: this.props.token,
                        currency,
                    }
                )
                .then((_) => {
                    this.props.popupSnackbar(
                        <Typography variant="body1" color="primary">
                            Currency has been changed to <span className="em">
                                {currency.toUpperCase()}
                            </span>
                        </Typography>
                    )
                })
                .catch((error) => this.props.showAlert(error.message, "Error"))
        }

    }


    // ...
    changeAccountDiscoverability = (_event, isInputChecked) => {
        if (this.props.authenticated) {
            Axios
                .post(
                    `${config.api}/account/update/`, {
                        user_id: this.props.userId,
                        token: this.props.token,
                        visible: isInputChecked ? "true" : "false",
                    }
                )
                .then((_) => {
                    this.props.setState({ discoverable: isInputChecked })
                    this.props.popupSnackbar(
                        isInputChecked ?
                            <Typography variant="body1" color="primary">
                                Account is now <span className="em">
                                    discoverable
                                </span>.
                            </Typography> :
                            <Typography variant="body1" color="primary">
                                Account is now <span className="em">
                                    hidden
                                </span> from public search.
                            </Typography>
                    )
                })
                .catch((error) => this.props.showAlert(error.message, "Error"))
        }
    }


    // ...
    updatePassword = (event) => this.setState({ password: event.target.value })


    // ...
    render = () =>
        <div className="tab-content">
            <AlertChoiceModal
                disabled={this.state.imploding}
                onYes={this.nukeAccount}
                onNo={this.abortNuke}
                labelYes="OK, I understand"
            >
                <div className="flex-box-col">
                    <Typography color="primary" variant="subtitle1">
                        Delete all your data now?
                    </Typography>
                    <br />
                    <Typography color="primary" variant="body1">
                     Don't worry. All your finances are always safe and
                     freely inter-transferrable.
                     Should you decide to come back, simply
                     sign up for the service again.
                    </Typography>
                    <br />
                    <Typography color="primary" variant="body1">
                     If you choose to proceed with account deletion,
                     you will loose all your contacts and personal
                     settings that you have set up within our service.
                     Here is the summary of what will be deleted:
                    </Typography>
                    <br />
                    <div className="p-l">
                        <Typography color="primary" variant="body1">
                        • Your contact book.
                        </Typography>
                        <Typography color="primary" variant="body1">
                        • Preferred currency setting.
                        </Typography>
                        <Typography color="primary" variant="body1">
                        • Profile signature verification on this account.
                        </Typography>
                        <Typography color="primary" variant="body1">
                        • Payment address signature verification on this account.
                        </Typography>
                        <Typography color="primary" variant="body1">
                        • User configuration on our servers.
                        </Typography>
                        <Typography color="primary" variant="body1">
                        • Subscribtion to our emails.
                        </Typography>
                    </div>
                    <div className="flex-box-col items-flex-end content-flex-end">

                        <div style={{ width: "218px" }}>
                            <InputField
                                name="password"
                                type="password"
                                label="Password"
                                color="primary"
                                onChange={this.updatePassword}
                                error={this.state.authError}
                                errorMessage={this.state.authErrorMessage}
                            />
                        </div>

                        <FormControlLabel
                            control={
                                <Checkbox onChange={this.emailOptOut}
                                    value="keepEmail" color="primary"
                                />
                            }
                            label={
                                <Typography color="primary" variant="body1">
                                    Keep me on the mailing list.
                                </Typography>
                            }
                        />
                    </div>
                </div>
            </AlertChoiceModal>

            <Modal
                open={
                    this.props.Modal.modalId === "implode" &&
                    this.props.Modal.visible
                }
                title="Imploding Your User Account"
                actions={[
                    <Button
                        onClick={this.abortNuke}
                        color="primary"
                    >
                        Done
                    </Button>,
                ]}
            >
                <div className="p-t p-b flex-box-col items-centered">
                    {this.state.keepEmail &&
                        <Fragment>
                            <div className="border-primary glass">
                                <Typography variant="body1" align="center" color="primary">
                                    We're keeping you in the loop!
                                </Typography>
                                <Typography variant="caption" align="center" color="primary">
                                    You selected to keep your email on the
                                    subscribtion list. We will send you emails
                                    ocasionally about the ongoing improvements
                                    to our project.
                                </Typography>
                            </div>
                            <br /><br />
                        </Fragment>
                    }
                    <Typography variant="body1" color="primary">
                        Deleting profile signature data …
                    </Typography>
                    <Typography variant="caption" color="primary">
                        {this.state.errorMessage ?
                            <span className="red">
                                {this.state.errorMessage}
                            </span> :
                            this.state.progressMessage || <he.Nbsp />
                        }
                    </Typography>
                </div>

                <LinearProgress
                    color="primary"
                    variant="determinate"
                    value={this.state.completion}
                    classes={{
                        root: this.props.classes.barRoot,
                        colorPrimary: this.props.classes.colorPrimary,
                        barColorPrimary: this.props.classes.barColorPrimary,
                    }}
                />
            </Modal>

            <div className="flex-box-row">
                <div>
                    <Typography variant="body1" color="secondary">
                        Adjust settings for your account.
                    </Typography>
                    <Typography variant="caption" color="secondary">
                        General account settings. This
                        configuration specifies how the account related
                        views are displayed to the user.
                    </Typography>
                </div>
            </div>

            <div className="account-title p-t-large">
                Extended Account Identifier:
            </div>
            <div className="account-subtitle m-t-small">
                <span className="bg-green">
                    {this.props.publicKey}
                </span> {accountIsLocked(
                    this.props.signers,
                    this.props.accountId
                ) && <Icon
                    style={{
                        marginLeft: "-0.7rem",
                        marginBottom: "6px",
                        fontSize: "24px",
                    }}
                >lock</Icon>}
            </div>
            {accountIsLocked(
                this.props.signers,
                this.props.accountId
            ) && <Typography variant="caption" color="inherit">
                    Warning: This account is locked!
            </Typography>}
            <div className="account-title p-t-large">
                Preferred Currency:
            </div>
            <div className="account-subtitle">
                Choose the currency that you prefer to use for this
                account.
            </div>
            <RadioButtonGroup
                name="currencySelect"
                value={this.props.state.currency}
                onChange={this.changeCurrency}
                children={[
                    { value: "eur", label: "Euro [EUR]", color:"secondary" },
                    { value: "usd", label: "U.S. Dollar [USD]", color: "secondary" },
                    { value: "aud", label: "Australian Dollar [AUD]", color: "secondary" },
                ]}
            >
            </RadioButtonGroup>

            <RadioButtonGroup
                name="currencySelect"
                value={this.props.state.currency}
                onChange={this.changeCurrency}
                children={[
                    { value: "nzd", label: "New Zealand Dollar [NZD]", color: "secondary" },
                    { value: "pln", label: "Polish Złoty [PLN]", color: "secondary" },
                    { value: "thb", label: "Thai Baht [THB]", color: "secondary" },
                ]}
            >
            </RadioButtonGroup>
            {this.props.state.needsRegistration
                && this.props.loginManager.isPayEnabled() ?
                <div>
                    <div className="p-t p-b" />
                    <div className="account-title p-t">
                        Register this account with {appName}:
                    </div>
                    <div className="account-subtitle">
                        Get access to unique services and
                        remittance service.
                    </div>
                    <div className="p-b" />
                    <Button
                        color="secondary"
                        onClick={this.showSignupModal}
                    >Register</Button>
                </div> : null}

            {this.props.authenticated ? (

                <div className="m-t-large flex-box-row items-centered space-between outline">
                    <div>
                        <Typography variant="body1" color="secondary">
                            Publish account number and payment address.
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            Your account number will be
                            publicly discoverable and can be
                            found by others via your payment
                            address.
                        </Typography>
                    </div>
                    <div>
                        <Switch
                            checked={this.props.state.discoverable}
                            onChange={this.changeAccountDiscoverability}
                            color="secondary"
                        />
                    </div>
                </div>

            ) : null}

            {firebaseApp.auth("session").currentUser &&
                this.props.authenticated &&
            <Fragment>
                <div style={{marginTop: "1rem"}} className="flex-box-row">
                    <Typography style={{ padding: "0.5rem 0"}} variant="h5"
                        color="secondary"
                    >
                        <span className="red">Danger Zone</span>
                    </Typography>
                </div>
                <div className="flex-box-row items-centered space-between outline">
                    <div>
                        <Typography variant="body1" color="secondary">
                            Delete all your data and contact book stored on
                            our servers.
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            While your personal data is nuked, your funds are
                            always safe and freely transferable to other similar
                            services.
                        </Typography>
                    </div>
                    <div>
                        <Button
                            disabled={this.state.imploding}
                            color="awesome"
                            onClick={this.implodeAccount}
                        >
                            {this.state.imploding ?
                                <RequestProgress label="Implode"
                                    color="secondary"
                                /> : "Implode"
                            }
                        </Button>
                    </div>
                </div>
            </Fragment>

            
            }
        </div>
}


// ...
export default compose(
    withStyles(styles),
    withLoginManager,
    withAssetManager,
    connect(
        // bind state to props.
        (state) => ({
            authenticated: state.Auth.authenticated,
            state: state.Account,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            network: state.StellarAccount.network,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
            signers: state.StellarAccount.signers,
            accountId: state.StellarAccount.accountId,
            idSig: state.StellarAccount.data ?
                state.StellarAccount.data.idSig : string.empty(),
            paySig: state.StellarAccount.data ?
                state.StellarAccount.data.paySig : string.empty(),
            Modal: state.Modal,
        }),
        // bind dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            hideModal: ModalAction.hideModal,
            showModal: ModalAction.showModal,
            popupSnackbar: SnackbarAction.popupSnackbar,
            showAlert: AlertAction.showAlert,
            showChoiceAlert: AlertChoiceAction.showAlert,
            hideChoiceAlert: AlertChoiceAction.hideAlert,

            resetAccountState: AccountAction.resetState,
            resetAssetsState: AssetsAction.resetState,
            resetBalancesState: BalancesAction.resetState,
            resetContactsState: ContactsAction.resetState,
            resetLedgerHQState: LedgerHQAction.resetState,
            resetLoginManagerState: LoginManagerAction.resetState,
            resetPaymentsState: PaymentsAction.resetState,
            resetStellarAccountState: StellarAccountAction.resetState,
        }, dispatch)
    )
)(Settings)
