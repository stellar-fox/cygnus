import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"

import MD5 from "../../lib/md5"
import {
    emailValid,
    federationIsAliasOnly,
} from "../../lib/utils"
import {
    appName,
    NotImplementedBadge,
} from "../../env.js"
import { config } from "../../config"
import { withLoginManager } from "../LoginManager"

import {
    showAlert,
    hideAlert,
    setCurrency,
    setExchangeRate,
    setCurrencyPrecision,
    setTab,
} from "../../actions/index"

import { Tabs, Tab } from "material-ui/Tabs"
import RaisedButton from "material-ui/RaisedButton"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Dialog from "material-ui/Dialog"
import Toggle from "material-ui/Toggle"
import Input from "../../frontend/Input"
import SnackBar from "../../frontend/SnackBar"
import RegisterAccount from "./Register"

import "./index.css"




// ...
const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    tab: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
        color: "rgba(244,176,4,0.9)",
    },
    inkBar: {
        backgroundColor: "rgba(244,176,4,0.8)",
    },
    container: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
    },
    radioButton: {
        label: {
            color: "rgba(244,176,4,0.9)",
        },
        icon: {
            fill: "rgba(244,176,4,1)",
        },
    },
    toggleSwitch: {
        thumbOff: {
            backgroundColor: "#2e5077",
        },
        trackOff: {
            backgroundColor: "#2e5077",
        },
        thumbSwitched: {
            backgroundColor: "rgb(244,176,4)",
        },
        trackSwitched: {
            backgroundColor: "rgb(244,176,4)",
        },
        labelStyle: {
            color: "rgb(244,176,4)",
        },
    },
}




// <Account> component
class Account extends Component {

    // ...
    state = {
        firstNameDisplay: "",
        lastNameDisplay: "",
        emailDisplay: "",
        paymentAddressDisplay: "",
        gravatarPath: "/img/gravatar.jpg",
        sbAccountProfileSaved: false,
        accountDiscoverable: true,
        accountDiscoverableMessage: "",
        sbAccountDiscoverable: false,
        sbCurrency: false,
        sbCurrencyPrecision: false,
        sbMultisig: false,
        sb2FA: false,
        currency: "",
        currencyPrecision: "",
        modalShown: false,
        modalButtonText: "CANCEL",
        loginButtonDisabled: true,
    }


    // ...
    componentDidMount = () => {
        if (this.props.loginManager.isAuthenticated()) {
            axios
                .get(`${config.api}/user/${this.props.appAuth.userId}`)
                .then((response) => {
                    this.setState({
                        firstNameDisplay: response.data.data.first_name || "",
                        lastNameDisplay: response.data.data.last_name || "",
                        emailDisplay: response.data.data.email,
                        gravatarPath:
                            "https://www.gravatar.com/avatar/" +
                            MD5(response.data.data.email) +
                            "?s=96",
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
            axios
                .get(`${config.api}/account/${this.props.appAuth.userId}`)
                .then((response) => {
                    this.setState({
                        paymentAddressDisplay: (
                            response.data.data.alias  &&
                                response.data.data.domain
                        ) ?
                            `${response.data.data.alias}*${response.data.data.domain}` :
                            "",
                        accountDiscoverable: response.data.data.visible,
                        currency: response.data.data.currency,
                        currencyPrecision: response.data.data.precision,
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }
    }


    // ...
    handleCurrencyChange = (event) => {
        if (this.props.loginManager.isAuthenticated()) {
            event.persist()
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.appAuth.userId
                    }?token=${this.props.appAuth.token}&currency=${
                        event.target.value
                    }`
                )
                .then((_response) => {
                    this.props.setCurrency(event.target.value)
                    this.getExchangeRate(event.target.value)

                    this.setState({
                        currency: event.target.parentElement.innerText,
                    })
                    this.setState((_prevState) => {
                        return { sbCurrency: true, }
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        } else {
            this.props.setCurrency(event.target.value)
            this.setState({
                currency: event.target.parentElement.innerText,
            })
            this.setState((_prevState) => {
                return { sbCurrency: true, }
            })
        }
    }


    // ...
    exchangeRateStale = () => (
        !this.props.accountInfo.rates  ||
            !this.props.accountInfo.rates[this.props.accountInfo.currency]  ||
            this.props.accountInfo.rates[
                this.props.accountInfo.currency
            ].lastFetch + 300000 < Date.now()
    )


    // ...
    getExchangeRate = (currency) => {
        if (this.exchangeRateStale()) {
            axios.get(`${config.api}/ticker/latest/${currency}`)
                .then((response) => {
                    this.props.setExchangeRate({
                        [currency]: {
                            rate: response.data.data[`price_${currency}`],
                            lastFetch: Date.now(),
                        },
                    })
                })
                .catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }
    }


    // ...
    handleCurrencyChangeSnackBarClose = () =>
        this.setState({ sbCurrency: false, })


    // ...
    handleCurrencyPrecisionChange = (event) => {
        if (this.props.loginManager.isAuthenticated()) {
            event.persist()
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.appAuth.userId
                    }?token=${this.props.appAuth.token}&precision=${
                        event.target.value
                    }`
                )
                .then((_response) => {
                    this.props.setCurrencyPrecision(
                        parseInt(event.target.value, 10)
                    )
                    this.setState({
                        currencyPrecision:
                            event.target.parentElement.innerText,
                    })
                    this.setState((_prevState) => {
                        return { sbCurrencyPrecision: true, }
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        } else {
            this.props.setCurrencyPrecision(parseInt(event.target.value, 10))
            this.setState({
                currencyPrecision: event.target.parentElement.innerText,
            })
            this.setState((_prevState) => {
                return { sbCurrencyPrecision: true, }
            })
        }
    }


    // ...
    handleCurrencyPrecisionChangeSnackBarClose = () =>
        this.setState({ sbCurrencyPrecision: false, })


    // ...
    handleAccountDiscoverableSnackBarClose = () =>
        this.setState({ sbAccountDiscoverable: false, })


    // ...
    handleAccountProfileSnackBarClose = () =>
        this.setState({ sbAccountProfileSaved: false, })


    // ...
    handleMultisigSnackBarClose = () =>
        this.setState({ sbMultisig: false, })


    // ...
    handle2FASnackBarClose = () =>
        this.setState({ sb2FA: false, })


    // ...
    handleAccountDiscoverableToggle = (_event, isInputChecked) => {
        if (isInputChecked === true) {
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.appAuth.userId
                    }?token=${this.props.appAuth.token}&visible=true`
                )
                .then((_response) => {
                    this.setState({
                        sbAccountDiscoverable: true,
                        accountDiscoverable: true,
                        accountDiscoverableMessage:
                            "Account is now discoverable by your payment address.",
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        } else {
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.appAuth.userId
                    }?token=${this.props.appAuth.token}&visible=false`
                )
                .then((_response) => {
                    this.setState({
                        accountDiscoverable: false,
                        sbAccountDiscoverable: true,
                        accountDiscoverableMessage:
                            "Account is now set to non-discoverable mode.",
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }
    }


    // ...
    handleMultisigToggle = (_event, isInputChecked) => {
        if (isInputChecked === true) {
            this.setState({ sbMultisig: true, })
        }
    }


    // ...
    handle2FAToggle = (_event, isInputChecked) => {
        if (isInputChecked === true) {
            this.setState({ sb2FA: true, })
        }
    }

    // ...
    handleFirstNameChange = (event) =>
        this.setState({ firstNameDisplay: event.target.value, })


    // ...
    handleLastNameChange = (event) =>
        this.setState({ lastNameDisplay: event.target.value, })


    // ...
    handleEmailChange = (event) => {
        if (emailValid(event.target.value)) {
            this.setState({
                gravatarPath:
                    "https://www.gravatar.com/avatar/" +
                    MD5(event.target.value) +
                    "?s=96",
            })
        }
        this.setState({ emailDisplay: event.target.value, })
    }


    // ...
    handlePaymentAddressChange = (event) =>
        this.setState({
            paymentAddressDisplay: event.target.value,
        })


    // ...
    handleProfileUpdate = (_event) => {
        const alias = this.state.paymentAddressDisplay.match(/\*/) ?
            (this.state.paymentAddressDisplay) :
            (`${this.state.paymentAddressDisplay}*stellarfox.net`)

        axios
            .post(
                `${config.api}/user/update/${this.props.appAuth.userId}?token=${
                    this.props.appAuth.token
                }&first_name=${this.state.firstNameDisplay}&last_name=${
                    this.state.lastNameDisplay
                }`
            )
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)
            })
        axios
            .post(
                `${config.api}/account/update/${this.props.appAuth.userId}?token=${
                    this.props.appAuth.token
                }&alias=${alias}`
            )
            .then((_response) => {
                this.setState({
                    sbAccountProfileSaved: true,
                })
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)

                if (error.response.status === 409) {
                    this.setState({
                        sbAccountDiscoverable: true,
                        accountDiscoverableMessage: error.response.data.error,
                    })
                }

            })
    }

    // ...
    handleTabChange = (_, value) =>
        this.props.setTab({ accounts: value, })


    // ...
    handleOpen = () =>
        this.props.showAlert()


    // ...
    handleClose = () =>
        this.props.hideAlert()


    // ...
    handleModalClose = () =>
        this.setState({ modalShown: false, })


    // ...
    handleSignup = () =>
        this.setState({
            modalButtonText: "CANCEL",
            modalShown: true,
        })


    // ...
    setModalButtonText = (text) =>
        this.setState({ modalButtonText: text, })


    // ... :D
    doWhateverYourFunctionCurrentlyIs = () =>
        this.setState({
            modalShown: false,
        })


    // ...
    changeButtonText = () =>
        this.setState({
            modalButtonText: "DONE",
        })


    // ...
    render = () => {
        const actions = [
            <RaisedButton
                backgroundColor="rgb(15,46,83)"
                labelColor="rgb(244,176,4)"
                label="OK"
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
        ]

        return (
            <div>
                <div>
                    <Dialog
                        title="Not Yet Implemented"
                        actions={actions}
                        modal={false}
                        open={this.props.modal.isShowing}
                        onRequestClose={this.handleClose}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                    >
                        Pardon the mess. We are working hard to bring you this
                        feature very soon. Please check back in a while as the
                        feature implementation is being continuously deployed.
                    </Dialog>
                    <Dialog
                        title="Registering Your Account"
                        actions={[
                            <RaisedButton
                                backgroundColor="rgb(15,46,83)"
                                labelStyle={{ color: "rgb(244,176,4)", }}
                                label={this.state.modalButtonText}
                                keyboardFocused={false}
                                onClick={this.doWhateverYourFunctionCurrentlyIs}
                            />,
                        ]}
                        modal={true}
                        open={this.state.modalShown}
                        onRequestClose={this.handleModalClose}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                        repositionOnUpdate={false}
                    >
                        <RegisterAccount onComplete={this.changeButtonText} />
                    </Dialog>
                </div>

                <Tabs
                    tabItemContainerStyle={styles.container}
                    inkBarStyle={styles.inkBar}
                    value={this.props.ui.tabs.accounts}
                    onChange={this.handleTabChange.bind(this, this.value)}
                    className="tabs-container"
                >
                    {this.props.loginManager.isAuthenticated() ? (
                        <Tab style={styles.tab} label="Profile" value="1">
                            <div className="tab-content">
                                <SnackBar
                                    open={this.state.sbAccountProfileSaved}
                                    message="Account profile saved."
                                    onRequestClose={
                                        this.handleAccountProfileSnackBarClose
                                    }
                                />
                                <div className="flex-row">
                                    <div>
                                        <h2 style={styles.headline}>
                                            Account Profile
                                        </h2>
                                        <div className="account-title">
                                            Fill out your profile details.
                                        </div>
                                        <div className="account-subtitle">
                                            Only your payment address is visible
                                            to public. The details of your
                                            account profile contribute to
                                            KYC/AML compliance.
                                        </div>
                                    </div>
                                    <div className="gravatar">
                                        <figure>
                                            <img
                                                className="image"
                                                src={this.state.gravatarPath}
                                                alt="Gravatar"
                                            />
                                        </figure>
                                    </div>
                                </div>
                                <div className="flex-centered">
                                    <div className="p-b">
                                        <Input
                                            value={this.state.firstNameDisplay}
                                            label="First Name"
                                            inputType="text"
                                            maxLength="100"
                                            autoComplete="off"
                                            handleChange={
                                                this.handleFirstNameChange
                                            }
                                            subLabel={
                                                "First Name: " +
                                                this.state.firstNameDisplay
                                            }
                                        />
                                    </div>
                                    <div className="p-t p-b">
                                        <Input
                                            value={this.state.lastNameDisplay}
                                            label="Last Name"
                                            inputType="text"
                                            maxLength="100"
                                            autoComplete="off"
                                            handleChange={
                                                this.handleLastNameChange
                                            }
                                            subLabel={
                                                "Last Name: " +
                                                this.state.lastNameDisplay
                                            }
                                        />
                                    </div>
                                    <div className="p-t p-b">
                                        <Input
                                            value={this.state.emailDisplay}
                                            label="Email"
                                            inputType="text"
                                            maxLength="100"
                                            autoComplete="off"
                                            handleChange={
                                                this.handleEmailChange
                                            }
                                            subLabel={
                                                "Email: " +
                                                this.state.emailDisplay
                                            }
                                        />
                                    </div>
                                    <div className="p-t p-b">
                                        <Input
                                            value={
                                                this.state.paymentAddressDisplay
                                            }
                                            label="Payment Address Alias"
                                            inputType="text"
                                            maxLength="100"
                                            autoComplete="off"
                                            handleChange={
                                                this.handlePaymentAddressChange
                                            }
                                            subLabel={
                                                federationIsAliasOnly(
                                                    this.state
                                                        .paymentAddressDisplay
                                                )
                                                    ? `Payment Address: ${
                                                        this.state
                                                            .paymentAddressDisplay
                                                    }*stellarfox.net`
                                                    : `Payment Address: ${
                                                        this.state
                                                            .paymentAddressDisplay
                                                    }`
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="p-t">
                                    <RaisedButton
                                        backgroundColor="rgb(244,176,4)"
                                        labelColor="rgb(15,46,83)"
                                        label="Update"
                                        onClick={
                                            this.handleProfileUpdate
                                        }
                                    />
                                </div>
                            </div>
                        </Tab>
                    ) : null}
                    <Tab style={styles.tab} label="Settings" value="2">
                        <div>
                            <h2 style={styles.headline}>Account Settings</h2>
                            <div className="account-title">
                                Adjust settings for your account.
                            </div>
                            <div className="account-subtitle">
                                General account related settings. This
                                configuration specifies how the account related
                                views are displayed to the user.
                            </div>
                            <div className="p-t p-b" />
                            <div className="account-title p-t">
                                Extended Account Number:
                            </div>
                            <div className="account-subtitle m-t-small">
                                <span className="bg-green">
                                    {this.props.appAuth.publicKey}
                                </span>
                            </div>
                            <div className="p-t p-b" />
                            <div className="account-title p-t">
                                Display Currency:
                            </div>
                            <div className="account-subtitle">
                                Choose the currency you want to use in your
                                account.
                            </div>
                            <div className="flex-start">
                                <SnackBar
                                    open={this.state.sbCurrency}
                                    message={
                                        "Currency set to " + this.state.currency
                                    }
                                    onRequestClose={
                                        this.handleCurrencyChangeSnackBarClose
                                    }
                                />
                                <RadioButtonGroup
                                    onChange={
                                        this.handleCurrencyChange
                                    }
                                    className="account-radio-group"
                                    name="currencySelect"
                                    defaultSelected={
                                        this.props.accountInfo.currency
                                    }
                                >
                                    <RadioButton
                                        className="p-b-small"
                                        value="eur"
                                        label="Euro [EUR]"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                    <RadioButton
                                        className="p-b-small"
                                        value="usd"
                                        label="U.S. Dollar [USD]"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                    <RadioButton
                                        className="p-b-small"
                                        value="aud"
                                        label="Australian Dollar [AUD]"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                    <RadioButton
                                        className="p-b-small"
                                        value="nzd"
                                        label="New Zealand Dollar [NZD]"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                    <RadioButton
                                        className="p-b-small"
                                        value="pln"
                                        label="Polish Złoty [PLN]"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                    <RadioButton
                                        value="thb"
                                        label="Thai Baht [THB]"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                </RadioButtonGroup>
                            </div>

                            {(
                                !this.props.accountInfo.registered &&
                                !this.props.loginManager.isExploreOnly()
                            ) ?
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
                                    <RaisedButton
                                        label="Register"
                                        disableTouchRipple={true}
                                        disableFocusRipple={true}
                                        backgroundColor="rgb(244,176,4)"
                                        labelColor="rgb(15,46,83)"
                                        onClick={this.handleSignup}
                                    />
                                </div> :
                                null}
                            {this.props.loginManager.isAuthenticated() ? (
                                <div>
                                    <div className="p-t p-b" />
                                    <div className="flex-row outline">
                                        <div>
                                            <div className="account-title">
                                                Make Account Discoverable
                                            </div>
                                            <div className="account-subtitle">
                                                Your account number will be
                                                publicly discoverable and can be
                                                found by others via your payment
                                                address.
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <SnackBar
                                                    open={
                                                        this.state
                                                            .sbAccountDiscoverable
                                                    }
                                                    message={
                                                        this.state
                                                            .accountDiscoverableMessage
                                                    }
                                                    onRequestClose={
                                                        this.handleAccountDiscoverableSnackBarClose
                                                    }
                                                />
                                                <Toggle
                                                    toggled={
                                                        this.state
                                                            .accountDiscoverable
                                                    }
                                                    onToggle={
                                                        this.handleAccountDiscoverableToggle
                                                    }
                                                    labelPosition="right"
                                                    thumbStyle={
                                                        styles.toggleSwitch
                                                            .thumbOff
                                                    }
                                                    trackStyle={
                                                        styles.toggleSwitch
                                                            .trackOff
                                                    }
                                                    thumbSwitchedStyle={
                                                        styles.toggleSwitch
                                                            .thumbSwitched
                                                    }
                                                    trackSwitchedStyle={
                                                        styles.toggleSwitch
                                                            .trackSwitched
                                                    }
                                                    labelStyle={
                                                        styles.toggleSwitch
                                                            .labelStyle
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </Tab>
                    {this.props.loginManager.isAuthenticated() ? (
                        <Tab style={styles.tab} label="Security" value="3">
                            <div>
                                <h2 style={styles.headline}>
                                    Account Security
                                </h2>
                                <div className="account-title">
                                    Adjust security settings for your account.
                                </div>
                                <div className="account-subtitle">
                                    Protect your account with additional
                                    security options.
                                </div>
                                <div className="p-t p-b" />
                                <div className="flex-row outline">
                                    <div>
                                        <div className="account-title">
                                            Enable two-factor authentication.
                                            (2FA)
                                        </div>
                                        <div className="account-subtitle">
                                            Confirm your account transations
                                            with second authentication factor.
                                        </div>
                                        <NotImplementedBadge />
                                    </div>
                                    <div>
                                        <div>
                                            <SnackBar
                                                open={this.state.sb2FA}
                                                message={
                                                    "Two factor authentication is now enabled."
                                                }
                                                onRequestClose={
                                                    this.handle2FASnackBarClose
                                                }
                                            />
                                            <Toggle
                                                onToggle={
                                                    this.handle2FAToggle
                                                }
                                                labelPosition="right"
                                                thumbStyle={
                                                    styles.toggleSwitch.thumbOff
                                                }
                                                trackStyle={
                                                    styles.toggleSwitch.trackOff
                                                }
                                                thumbSwitchedStyle={
                                                    styles.toggleSwitch
                                                        .thumbSwitched
                                                }
                                                trackSwitchedStyle={
                                                    styles.toggleSwitch
                                                        .trackSwitched
                                                }
                                                labelStyle={
                                                    styles.toggleSwitch
                                                        .labelStyle
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-t p-b" />
                                <div className="flex-row outline">
                                    <div>
                                        <div className="account-title">
                                            Add co-signers to your account.
                                            (Multisignature Verification)
                                        </div>
                                        <div className="account-subtitle">
                                            Multisignature account requires two
                                            or more signatures on every
                                            transaction.
                                        </div>
                                        <NotImplementedBadge />
                                    </div>
                                    <div>
                                        <div>
                                            <SnackBar
                                                open={this.state.sbMultisig}
                                                message={
                                                    "Account set to multisig."
                                                }
                                                onRequestClose={
                                                    this.handleMultisigSnackBarClose
                                                }
                                            />
                                            <Toggle
                                                onToggle={
                                                    this.handleMultisigToggle
                                                }
                                                labelPosition="right"
                                                thumbStyle={
                                                    styles.toggleSwitch
                                                        .thumbOff
                                                }
                                                trackStyle={
                                                    styles.toggleSwitch.trackOff
                                                }
                                                thumbSwitchedStyle={
                                                    styles.toggleSwitch
                                                        .thumbSwitched
                                                }
                                                trackSwitchedStyle={
                                                    styles.toggleSwitch
                                                        .trackSwitched
                                                }
                                                labelStyle={
                                                    styles.toggleSwitch
                                                        .labelStyle
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    ) : null}
                </Tabs>
            </div>
        )
    }
}


// ...
export default withLoginManager(connect(
    // map state to props.
    (state) => ({
        modal: state.modal,
        ui: state.ui,
        accountInfo: state.accountInfo,
        auth: state.auth,
        appAuth: state.appAuth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        showAlert,
        hideAlert,
        setCurrency,
        setExchangeRate,
        setCurrencyPrecision,
        setTab,
    }, dispatch)
)(Account))
