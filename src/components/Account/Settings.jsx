import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { config } from "../../config"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Button from "../../lib/common/Button"
import Toggle from "../../lib/common/Toggle"
import { appName } from "../StellarFox/env"
import { action as AccountAction } from "../../redux/Account"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import {
    changeSnackbarState,
    changeModalState,
} from "../../redux/actions"




// <Settings> component
class Settings extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    showSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: true,
            },
        })


    // ...
    changeCurrency = (event) => {
        this.props.assetManager.updateExchangeRate(event.target.value)
        this.props.setState({ currency: event.target.value, })
        this.saveCurrency(event.target.value)
    }


    // ...
    saveCurrency = (currency) => {
        if (this.props.loginManager.isAuthenticated()) {
            Axios
                .post(
                    `${config.api}/account/update/`, {
                        id: this.props.userId,
                        token: this.props.token,
                        currency,
                    }
                )
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }

        this.props.changeSnackbarState({
            open: true,
            message: `Currency has been changed to ${currency.toUpperCase()}.`,
        })
    }


    // ...
    changeAccountDiscoverability = (_event, isInputChecked) => {
        if (this.props.loginManager.isAuthenticated()) {
            Axios
                .post(
                    `${config.api}/account/update/`, {
                        id: this.props.userId,
                        token: this.props.token,
                        visible: isInputChecked ? "true" : "false",
                    }
                )
                .then((_) => {
                    this.props.setState({ discoverable: isInputChecked, })
                    this.props.changeSnackbarState({
                        open: true,
                        message: isInputChecked ?
                            "Account is now discoverable." :
                            "Account is now hidden from public search.",
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }
    }


    // ...
    render = () =>
        <div className="tab-content">
            <div className="f-b space-between">
                <div>
                    <h2 className="tab-content-headline">Account Settings</h2>
                    <div className="account-title">
                        Adjust settings for your account.
                    </div>
                    <div className="account-subtitle">
                        General account settings. This
                        configuration specifies how the account related
                        views are displayed to the user.
                    </div>
                </div>
            </div>

            <div className="account-title p-t-large">
                Extended Account Number:
            </div>
            <div className="account-subtitle m-t-small">
                <span className="bg-green">
                    {this.props.publicKey}
                </span>
            </div>
            <div className="account-title p-t-large">
                Display Currency:
            </div>
            <div className="account-subtitle">
                Choose the currency you want to use in your
                account.
            </div>
            <RadioButtonGroup
                onChange={this.changeCurrency}
                className="account-radio-group m-t"
                name="currencySelect"
                defaultSelected={this.props.state.currency}
            >
                <RadioButton
                    className="p-b-small"
                    value="eur"
                    label="Euro [EUR]"
                    labelStyle={{ color: "rgba(244,176,4,0.9)", }}
                    iconStyle={{ fill: "rgba(244,176,4,1)", }}
                />
                <RadioButton
                    className="p-b-small"
                    value="usd"
                    label="U.S. Dollar [USD]"
                    labelStyle={{ color: "rgba(244,176,4,0.9)", }}
                    iconStyle={{ fill: "rgba(244,176,4,1)", }}
                />
                <RadioButton
                    className="p-b-small"
                    value="aud"
                    label="Australian Dollar [AUD]"
                    labelStyle={{ color: "rgba(244,176,4,0.9)", }}
                    iconStyle={{ fill: "rgba(244,176,4,1)", }}
                />
                <RadioButton
                    className="p-b-small"
                    value="nzd"
                    label="New Zealand Dollar [NZD]"
                    labelStyle={{ color: "rgba(244,176,4,0.9)", }}
                    iconStyle={{ fill: "rgba(244,176,4,1)", }}
                />
                <RadioButton
                    className="p-b-small"
                    value="pln"
                    label="Polish Złoty [PLN]"
                    labelStyle={{ color: "rgba(244,176,4,0.9)", }}
                    iconStyle={{ fill: "rgba(244,176,4,1)", }}
                />
                <RadioButton
                    value="thb"
                    label="Thai Baht [THB]"
                    labelStyle={{ color: "rgba(244,176,4,0.9)", }}
                    iconStyle={{ fill: "rgba(244,176,4,1)", }}
                />
            </RadioButtonGroup>

            {this.props.state.needsRegistration ?
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
                        label="Register"
                        secondary={true}
                        onClick={this.showSignupModal}
                    />
                </div> : null}

            {this.props.loginManager.isAuthenticated() ? (

                <div className="m-t-large f-b space-between outline">
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
                        <Toggle
                            toggled={this.props.state.discoverable}
                            onToggle={this.changeAccountDiscoverability}
                        />
                    </div>
                </div>

            ) : null}
        </div>
}


// ...
export default compose(
    withLoginManager,
    withAssetManager,
    connect(
        // bind state to props.
        (state) => ({
            state: state.Account,
            appUi: state.appUi,
            publicKey: state.LedgerHQ.publicKey,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
        }),
        // bind dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            changeSnackbarState,
            changeModalState,
        }, dispatch)
    )
)(Settings)
