import React, { Component } from "react"
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
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import { accountIsLocked } from "../../lib/utils"
import { Icon, Typography } from "@material-ui/core"




// <Settings> component
class Settings extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    showSignupModal = () => this.props.showModal("signup")


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
                        user_id: this.props.userId,
                        token: this.props.token,
                        currency,
                    }
                )
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }

        this.props.popupSnackbar(
            `Currency has been changed to ${currency.toUpperCase()}`
        )

    }


    // ...
    changeAccountDiscoverability = (_event, isInputChecked) => {
        if (this.props.loginManager.isAuthenticated()) {
            Axios
                .post(
                    `${config.api}/account/update/`, {
                        user_id: this.props.userId,
                        token: this.props.token,
                        visible: isInputChecked ? "true" : "false",
                    }
                )
                .then((_) => {
                    this.props.setState({ discoverable: isInputChecked, })
                    this.props.popupSnackbar(
                        isInputChecked ?
                            "Account is now discoverable." :
                            "Account is now hidden from public search."
                    )
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

            <div className="flex-box-row">
                <div>
                    <Typography variant="title" color="secondary">
                        Account Settings
                    </Typography>
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
                    { value: "eur", label: "Euro [EUR]", color:"secondary", },
                    { value: "usd", label: "U.S. Dollar [USD]", color: "secondary", },
                    { value: "aud", label: "Australian Dollar [AUD]", color: "secondary", },
                ]}
            >
            </RadioButtonGroup>

            <RadioButtonGroup
                name="currencySelect"
                value={this.props.state.currency}
                onChange={this.changeCurrency}
                children={[
                    { value: "nzd", label: "New Zealand Dollar [NZD]", color: "secondary", },
                    { value: "pln", label: "Polish Złoty [PLN]", color: "secondary", },
                    { value: "thb", label: "Thai Baht [THB]", color: "secondary", },
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

            {this.props.loginManager.isAuthenticated() ? (

                <div className="m-t-large flex-box-row items-centered space-between outline">
                    <div>
                        <Typography variant="body1" color="secondary">
                            Make Account Discoverable
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
            publicKey: state.LedgerHQ.publicKey,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
            signers: state.StellarAccount.signers,
            accountId: state.StellarAccount.accountId,
        }),
        // bind dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            showModal: ModalAction.showModal,
            popupSnackbar: SnackbarAction.popupSnackbar,
        }, dispatch)
    )
)(Settings)
