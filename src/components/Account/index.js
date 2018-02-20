import React, { Component } from "react"
import { Tabs, Tab } from "material-ui/Tabs"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Dialog from "material-ui/Dialog"
import Toggle from "material-ui/Toggle"
import Input from "../../frontend/input/Input"
import SnackBar from "../../frontend/snackbar/SnackBar"
import MD5 from "../../lib/md5"
import { federationIsAliasOnly } from "../../lib/utils"
import { emailValid } from "../../lib/utils"
import { config } from "../../config"
import axios from "axios"
import RegisterAccount from "../RegisterAccount"
import {
    showAlert,
    hideAlert,
    setCurrency,
    setCurrencyPrecision,
    setTab,
} from "../../actions/index"

import "./style.css"

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

class Account extends Component {
    constructor (props) {
        super(props)
        this.state = {
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
        }
    }

    componentDidMount () {
        if (this.props.auth.isAuthenticated) {
            axios
                .get(`${config.api}/user/${this.props.auth.userId}`)
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
                .get(`${config.api}/account/${this.props.auth.userId}`)
                .then((response) => {
                    this.setState({
                        paymentAddressDisplay: response.data.data.alias || "",
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

    handleCurrencyChange (event) {
        if (this.props.auth.isAuthenticated) {
            event.persist()
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.auth.userId
                    }?token=${this.props.auth.token}&currency=${
                        event.target.value
                    }`
                )
                .then((_response) => {
                    this.props.setCurrency(event.target.value)
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

    handleCurrencyChangeSnackBarClose () {
        this.setState({ sbCurrency: false, })
    }

    handleCurrencyPrecisionChange (event) {
        if (this.props.auth.isAuthenticated) {
            event.persist()
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.auth.userId
                    }?token=${this.props.auth.token}&precision=${
                        event.target.value
                    }`
                )
                .then((_response) => {
                    this.props.setCurrencyPrecision(
                        parseInt(event.target.value, 10)
                    )
                    this.setState({
                        currencyPrecision: event.target.parentElement.innerText,
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

    handleCurrencyPrecisionChangeSnackBarClose () {
        this.setState({ sbCurrencyPrecision: false, })
    }

    handleAccountDiscoverableSnackBarClose () {
        this.setState({ sbAccountDiscoverable: false, })
    }

    handleAccountProfileSnackBarClose () {
        this.setState({ sbAccountProfileSaved: false, })
    }

    handleMultisigSnackBarClose () {
        this.setState({ sbMultisig: false, })
    }

    handle2FASnackBarClose () {
        this.setState({ sb2FA: false, })
    }

    handleAccountDiscoverableToggle (_event, isInputChecked) {
        if (isInputChecked === true) {
            axios
                .post(
                    `${config.api}/account/update/${
                        this.props.auth.userId
                    }?token=${this.props.auth.token}&visible=true`
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
                        this.props.auth.userId
                    }?token=${this.props.auth.token}&visible=false`
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

    handleMultisigToggle (_event, isInputChecked) {
        if (isInputChecked === true) {
            this.setState({ sbMultisig: true, })
        }
    }

    handle2FAToggle (_event, isInputChecked) {
        if (isInputChecked === true) {
            this.setState({ sb2FA: true, })
        }
    }

    handleFirstNameChange (event) {
        this.setState({ firstNameDisplay: event.target.value, })
    }

    handleLastNameChange (event) {
        this.setState({ lastNameDisplay: event.target.value, })
    }

    handleEmailChange (event) {
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

    handlePaymentAddressChange (event) {
        this.setState({ paymentAddressDisplay: event.target.value, })
    }

    handleProfileUpdate (_event) {
        // eslint-disable-next-line no-console
        console.log("Update Pressed")
        axios
            .post(
                `${config.api}/user/update/${this.props.auth.userId}?token=${
                    this.props.auth.token
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
                `${config.api}/account/update/${this.props.auth.userId}?token=${
                    this.props.auth.token
                }&alias=${this.state.paymentAddressDisplay}`
            )
            .then((_response) => {
                this.setState({
                    sbAccountProfileSaved: true,
                })
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)
            })
    }

    handleChange (value) {
        this.props.setTab({ accounts: value, })
    }

    handleOpen () {
        this.props.showAlert()
    }

    handleClose () {
        this.props.hideAlert()
    }

    // ...
    handleModalClose () {
        this.setState({ modalShown: false, })
    }

    // ...
    handleSignup () {
        this.setState({
            modalButtonText: "CANCEL",
            modalShown: true,
        })
    }

    // ...
    setModalButtonText (text) {
        this.setState({ modalButtonText: text, })
    }

    render () {
        const actions = [
            <RaisedButton
                backgroundColor="rgb(15,46,83)"
                labelColor="rgb(244,176,4)"
                label="OK"
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
        ]

        const registerAccountActions = [
            <FlatButton
                backgroundColor="rgb(244,176,4)"
                labelStyle={{ color: "rgb(15,46,83)", }}
                label={this.state.modalButtonText}
                keyboardFocused={false}
                onClick={this.handleModalClose.bind(this)}
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
                        actions={registerAccountActions}
                        modal={true}
                        open={this.state.modalShown}
                        onRequestClose={this.handleModalClose.bind(this)}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                        repositionOnUpdate={false}
                    >
                        <RegisterAccount
                            onComplete={this.setModalButtonText.bind(this)}
                        />
                    </Dialog>
                </div>

                <Tabs
                    tabItemContainerStyle={styles.container}
                    inkBarStyle={styles.inkBar}
                    value={this.props.ui.tabs.accounts}
                    onChange={this.handleChange}
                    className="tabs-container"
                >
                    {this.props.auth.isAuthenticated ? (
                        <Tab style={styles.tab} label="Profile" value="1">
                            <div className="tab-content">
                                <SnackBar
                                    open={this.state.sbAccountProfileSaved}
                                    message="Account profile saved."
                                    onRequestClose={
                                        this.handleAccountProfileSnackBarClose.bind(this)
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
                                                this.handleFirstNameChange.bind(this)
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
                                                this.handleLastNameChange.bind(this)
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
                                                this.handleEmailChange.bind(this)
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
                                                this.handlePaymentAddressChange.bind(this)
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
                                            this.handleProfileUpdate.bind(this)
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
                                        this.handleCurrencyChangeSnackBarClose.bind(this)
                                    }
                                />
                                <RadioButtonGroup
                                    onChange={
                                        this.handleCurrencyChange.bind(this)
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
                            <div className="p-t p-b" />
                            <div className="account-title p-t">
                                Set Currency Precision:
                            </div>
                            <div className="account-subtitle">
                                Set decimal precision point for fractional
                                currency representation.
                            </div>
                            <div className="flex-start">
                                <SnackBar
                                    open={this.state.sbCurrencyPrecision}
                                    message={
                                        "Currency set to " +
                                        this.state.currencyPrecision
                                    }
                                    onRequestClose={
                                        this.handleCurrencyPrecisionChangeSnackBarClose.bind(this)
                                    }
                                />
                                <RadioButtonGroup
                                    onChange={
                                        this.handleCurrencyPrecisionChange.bind(this)
                                    }
                                    className="account-radio-group"
                                    name="currencyPrecision"
                                    defaultSelected={
                                        this.props.accountInfo.precision
                                    }
                                >
                                    <RadioButton
                                        className="p-b-small"
                                        value={2}
                                        label="Fiat Style"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                    <RadioButton
                                        className="p-b-small"
                                        value={7}
                                        label="Crypto Style"
                                        labelStyle={styles.radioButton.label}
                                        iconStyle={styles.radioButton.icon}
                                    />
                                </RadioButtonGroup>
                            </div>
                            {!this.props.accountInfo.registered &&
                            !this.props.auth.isReadOnly ? (
                                    <div>
                                        <div className="p-t p-b" />
                                        <div className="account-title p-t">
                                        Register this account with Stellar Fox:
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
                                            onClick={this.handleSignup.bind(this)}
                                        />
                                    </div>
                                ) : null}
                            {this.props.auth.isAuthenticated ? (
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
                                                        this.handleAccountDiscoverableSnackBarClose.bind(this)
                                                    }
                                                />
                                                <Toggle
                                                    toggled={
                                                        this.state
                                                            .accountDiscoverable
                                                    }
                                                    onToggle={
                                                        this.handleAccountDiscoverableToggle.bind(this)
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
                    {this.props.auth.isAuthenticated ? (
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
                                    </div>
                                    <div>
                                        <div>
                                            <SnackBar
                                                open={this.state.sb2FA}
                                                message={
                                                    "Two factor authentication is now enabled."
                                                }
                                                onRequestClose={
                                                    this.handle2FASnackBarClose.bind(this)
                                                }
                                            />
                                            <Toggle
                                                onToggle={
                                                    this.handle2FAToggle.bind(this)
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
                                    </div>
                                    <div>
                                        <div>
                                            <SnackBar
                                                open={this.state.sbMultisig}
                                                message={
                                                    "Account set to multisig."
                                                }
                                                onRequestClose={
                                                    this.handleMultisigSnackBarClose.bind(this)
                                                }
                                            />
                                            <Toggle
                                                onToggle={
                                                    this.handleMultisigToggle.bind(this)
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
                            </div>
                        </Tab>
                    ) : null}
                </Tabs>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        modal: state.modal,
        ui: state.ui,
        accountInfo: state.accountInfo,
        auth: state.auth,
    }
}

function matchDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            showAlert,
            hideAlert,
            setCurrency,
            setCurrencyPrecision,
            setTab,
        },
        dispatch
    )
}

export default connect(mapStateToProps, matchDispatchToProps)(Account)
