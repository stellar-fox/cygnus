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
import { action as AccountAction } from "../../redux/Account"
import { action as ModalAction } from "../../redux/Modal"
import { accountIsLocked } from "../../lib/utils"
import {
    Icon,
    Typography,
} from "@material-ui/core"
import { action as AlertAction } from "../../redux/Alert"
import { withStyles } from "@material-ui/core/styles"
import { surfaceSnacky } from "../../thunks/main"
import {
    getCoinHistory,
    getExchangeRate,
} from "../../thunks/assets"
import ImplodeAccountModal from "./ImplodeAccountModal"




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





// <Settings> component
class Settings extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }




    // ...
    implodeAccount = () => this.props.showModal("implodeAccount")




    // ...
    changeCurrency = (event) => {
        this.props.getExchangeRate(event.target.value)
        this.props.getCoinHistory(event.target.value)
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
                    this.props.surfaceSnacky(
                        "success",
                        <Fragment>Currency has been changed to <span className="em">
                            {currency.toUpperCase()}
                        </span></Fragment>

                    )
                })
                .catch((error) => {
                    this.props.showAlert(error.message, "Error")
                })

        } else {
            this.props.surfaceSnacky(
                "success",
                <Fragment>Currency has been changed to <span className="em">
                    {currency.toUpperCase()}
                </span></Fragment>
            )
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

                    isInputChecked ?
                        this.props.surfaceSnacky(
                            "success",
                            <Fragment>
                                Account is now <span className="em">
                                    discoverable
                                </span>.
                            </Fragment>
                        ) :
                        this.props.surfaceSnacky(
                            "warning",
                            <Fragment>
                                Account is now <span className="em">
                                    hidden
                                </span> from public search.
                            </Fragment>
                        )

                })
                .catch((error) => this.props.showAlert(error.message, "Error"))
        }
    }



    // ...
    render = () =>
        <div className="tab-content">

            <ImplodeAccountModal
                modalId={this.props.Modal.modalId}
                visible={this.props.Modal.visible}
            />

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
                Your Account ID:
            </div>
            <div className="account-subtitle m-t-small">
                <span className="badge badge-secondary">
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
                value={this.props.currency}
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
                value={this.props.currency}
                onChange={this.changeCurrency}
                children={[
                    { value: "nzd", label: "New Zealand Dollar [NZD]", color: "secondary" },
                    { value: "pln", label: "Polish Złoty [PLN]", color: "secondary" },
                    { value: "thb", label: "Thai Baht [THB]", color: "secondary" },
                ]}
            >
            </RadioButtonGroup>

            {this.props.authenticated &&
                <div className="m-t-large">

                    <Typography>
                        <span className="red-badge">
                            Danger Zone
                        </span>
                    </Typography>

                    <div className="m-t flex-box-row items-centered space-between outline">
                        <div>
                            <Typography variant="body1" color="secondary">
                                Change visibility of your payment address.
                            </Typography>
                            <Typography variant="caption" color="secondary">
                                Your payment address will be
                                publicly discoverable by default.
                                Unpublish it to drop off the radar.
                            </Typography>
                        </div>
                        <div>
                            <Switch
                                checked={this.props.discoverable}
                                onChange={this.changeAccountDiscoverability}
                                color="secondary"
                            />
                        </div>
                    </div>

                    <div className="m-t flex-box-row items-centered space-between outline">
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
                                color="secondary"
                                onClick={this.implodeAccount}
                            >Implode</Button>
                        </div>
                    </div>
                </div>
            }

        </div>
}


// ...
export default compose(
    withStyles(styles),
    connect(
        // bind state to props.
        (state) => ({
            authenticated: state.Auth.authenticated,
            currency: state.Account.currency,
            discoverable: state.Account.discoverable,
            publicKey: state.LedgerHQ.publicKey,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
            signers: state.StellarAccount.signers,
            accountId: state.StellarAccount.accountId,
            Modal: state.Modal,
        }),
        // bind dispatch to props.
        (dispatch) => bindActionCreators({
            getCoinHistory,
            getExchangeRate,
            setState: AccountAction.setState,
            showModal: ModalAction.showModal,
            showAlert: AlertAction.showAlert,
            surfaceSnacky,
        }, dispatch)
    )
)(Settings)
