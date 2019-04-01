import React, { Component, Fragment } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { string } from "@xcmats/js-toolbox"
import { config } from "../../config"
import {
    listInternal,
    listPending,
    listRequested,
    requestByAccountNumber,
    requestByEmail,
    requestByPaymentAddress,
} from "../Contacts/api"
import {
    getUserExternalContacts,
    emailValid,
    federationAddressValid,
    getFederationRecord,
    toAliasAndDomain,
    publicKeyValid,
} from "../../lib/utils"
import { appTLD } from "../StellarFox/env"
import { action as AlertAction } from "../../redux/Alert"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import SwipeableViews from "react-swipeable-views"
import {
    Button,
    CircularProgress,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@material-ui/core"
import {
    AlternateEmailRounded,
    AccountBalanceRounded,
    StarBorderRounded,
} from "@material-ui/icons"



// ...
const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        borderRadius: "3px",
    },

    buttonDone: {
        margin: 0,
        borderRadius: "3px",
    },

    primaryRaised: {
        color: theme.palette.secondary.main,
    },

    textField: {
        width: 300,
    },

    icon: {
        color: theme.palette.secondary.light,
        fontSize: "10rem",
    },

    indicator: {
        backgroundColor: theme.palette.primary.other,
    },

    input: {
        color: theme.palette.primary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main },
        "&:after": { borderBottomColor: theme.palette.primary.main },
    },

    inputMargin: {
        margin: "0px",
    },

    progress: {
        marginBottom: "0px",
        marginRight: "10px",
    },

    tabs: {
        backgroundColor: theme.palette.secondary.light,
        borderTopLeftRadius: "3px",
        borderTopRightRadius: "3px",
    },

    tab: {
        color: theme.palette.secondary.dark,
    },

})




// ...
const RequestProgress = withStyles(styles)(
    ({ classes }) =>
        <CircularProgress color="primary" className={classes.progress}
            thickness={3} size={25}
        />
)




// ...
const SearchButton = withStyles(styles)(
    ({ classes, buttonText, color, disabled, onClick }) =>
        <Button variant="contained" disabled={disabled}
            color={color} onClick={onClick}
            className={classNames(classes.button, classes.primaryRaised)}
        >
            {buttonText}
        </Button>
)




// ...
const DoneButton = withStyles(styles)(
    ({ classes, onClick }) =>
        <Button variant="contained" color="primary" onClick={onClick}
            className={classNames(classes.buttonDone, classes.primaryRaised)}
        >
            Done
        </Button>
)




// ...
const SearchInput = withStyles(styles)(
    ({ classes, label, onChange, value, error, errorMessage, id }) => <TextField
        id={`seach-by-${id}`}
        label={errorMessage || label}
        value={value}
        error={error}
        type="text"
        className={classes.textField}
        margin="normal"
        onChange={onChange}
        autoFocus={id === "payment-address" ? true : false }
        autoComplete="off"
        InputProps={{
            classes: {
                input: classes.input,
                underline: classes.input,
            },
        }}
        InputLabelProps={{
            classes: {
                root: classes.input,
                marginDense: classes.inputMargin,
            },
        }}
    />
)




// ...
const ChoiceTabs = withStyles(styles)(
    ({ classes, onChange, value }) => <Tabs
        value={ value }
        onChange={ onChange }
        textColor="primary"

        classes={{
            root: classes.tabs,
            indicator: classes.indicator,
        }}
    >
        <Tab classes={{ root: classes.tab }} label="Payment Address" />
        <Tab classes={{ root: classes.tab }} label="Account Number" />
        <Tab classes={{ root: classes.tab }} label="Email Address" />
    </Tabs>
)




// ...
class AddContactForm extends Component {

    state = {
        showProgress: false,
        showRequestSent: false,
        tabSelected: 0,
        buttonDisabled: false,
        input: string.empty(),
        lastInput: string.empty(),
        error: false,
        errorMessage: string.empty(),
    }


    // ...
    onTabChange = (_event, value) =>
        this.setState({
            tabSelected: value,
            input: string.empty(),
            lastInput: string.empty(),
            showRequestSent: false,
            error: false,
            errorMessage: string.empty(),
        })


    // ...
    requestContact = () => {

        // check email address validity
        if (!emailValid(this.state.input) && this.state.tabSelected === 2) {
            this.setState({
                error: true,
                errorMessage: "Invalid email address.",
            })
            return
        }

        // check payment address validity
        if (!federationAddressValid(this.state.input) &&
            this.state.tabSelected === 0) {
            this.setState({
                error: true,
                errorMessage: "Invalid payment address.",
            })
            return
        }

        // check account number validity
        if (!publicKeyValid(this.state.input) &&
            this.state.tabSelected === 1) {
            this.setState({
                error: true,
                errorMessage: "Invalid account number.",
            })
            return
        }


        // input is valid at this point

        this.setState({
            error: false,
            errorMessage: string.empty(),
            showProgress: true,
            showRequestSent: false,
            buttonDisabled: true,
            lastInput: this.state.input,
        })

        // try adding a contact based on email address
        if (this.state.tabSelected === 2) {
            requestByEmail(
                this.props.userId, this.props.token, this.state.input,
                {
                    email: this.props.accountEmail,
                    first_name: this.props.accountFirstName,
                    last_name: this.props.accountLastName,
                },
            ).then((_result) => {
                this.requestComplete()
            }).catch((error) => {
                this.requestFailed(error)
            })
        }

        // try adding a contact based on payment address
        else if (this.state.tabSelected === 0) {

            let [alias, domain] = toAliasAndDomain(this.state.input)

            domain === appTLD ?
                requestByPaymentAddress(
                    this.props.userId, this.props.token, alias, domain
                )
                    .then(() => {
                        this.requestComplete()
                    }).catch((error) => {
                        this.requestFailed(error)
                    }) :
                /**
                 * Search for contact with other federation providers.
                 */
                getFederationRecord(this.state.input)
                    .then((result) => {

                        Axios.post(`${config.api}/contact/addext`, {
                            user_id: this.props.userId,
                            token: this.props.token,
                            pubkey: result.account_id,
                            alias: alias,
                            domain: domain,
                        }).then((_result) => {
                            this.requestComplete()
                        }).catch((error) => {
                            this.requestFailed(error)
                        })

                    }).catch((error) => {
                        this.requestFailed(error)
                    })
        }

        // try adding a contact based on account number
        else if (this.state.tabSelected === 1) {
            requestByAccountNumber(
                this.props.userId, this.props.token, this.state.input
            ).then((_result) => {
                this.requestComplete()
            }).catch((error) => {
                this.requestFailed(error)
            })
        }


    }


    // ...
    requestComplete = () => {
        this.setState({
            showProgress: false,
            showRequestSent: true,
            buttonDisabled: false,
            input: string.empty(),
        })
        this.updateContacts()
    }


    // ...
    requestFailed = (error) => {

        this.setState({
            showProgress: false,
            buttonDisabled: false,
        })

        if (error.response && error.response.status === 409) {
            this.props.showAlert(
                "An invite was already sent to this address.",
                "Notice"
            )
            return false
        }


        if (error.response && error.response.status === 404) {
            this.props.showAlert(
                "The address you entered does not exist.",
                "Notice"
            )
            return false
        }

        if (error.response && error.response.status >= 500) {
            this.props.showAlert(
                "The contact you requested could not be processed.",
                "Error"
            )
            return false
        }

        /**
         * Did not match any error code above so show actual error message.
         */
        this.props.showAlert(
            error.message,
            "Error"
        )
    }


    // ...
    updateContacts = () => {

        listInternal(this.props.userId, this.props.token)
            .then((results) => {
                results ? this.props.setState({
                    internal: results,
                }) : this.props.setContactsState({
                    internal: [],
                })
            })

        getUserExternalContacts(this.props.userId, this.props.token)
            .then((results) => {
                results ? this.props.setState({
                    external: results,
                }) : this.props.setState({
                    external: [],
                })
            })

        listRequested(this.props.userId, this.props.token)
            .then((results) => {
                results ? this.props.setState({
                    requests: results,
                }) : this.props.setState({
                    requests: [],
                })
            })

        listPending(this.props.userId, this.props.token)
            .then((results) => {
                results ? this.props.setState({
                    pending: results,
                }) : this.props.setState({
                    pending: [],
                })
            })
    }


    // ...
    hideModal = () => {
        this.setState({
            error: false,
            errorMessage: string.empty(),
            showProgress: false,
            showRequestSent: false,
            buttonDisabled: false,
            input: string.empty(),
            lastInput: string.empty(),
        })
        this.props.hideModal()
    }


    // ...
    handleInputChange = (event) =>
        this.setState({
            input: event.target.value,
            error: false,
            errorMessage: string.empty(),
        })


    // ...
    render = () =>
        <Fragment>
            <div className="flex-box-col items-centered p-t-medium">
                <Typography noWrap variant="h2" color="primary">
                    Find your new contact.
                </Typography>
                <Typography style={{ marginTop: "0.5rem" }} noWrap variant="h5" color="primary">
                    Contacts can be added by payment address, account
                    number or invited by email.
                </Typography>
                <Typography noWrap variant="h5" color="primary">
                    Please choose from the options below.
                </Typography>
            </div>

            <div className="flex-box-col items-centered m-t-large">
                <ChoiceTabs onChange={this.onTabChange}
                    value={this.state.tabSelected}
                />
            </div>

            <SwipeableViews
                axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                index={this.state.tabSelected}
                onChangeIndex={this.handleChangeIndex}
            >

                <div className="swipeable-tab-container">
                    <div className="flex-box-row space-between items-centered">
                        <StarBorderRounded
                            classes={{ root: this.props.classes.icon }}
                        />
                        <div>
                            <Typography
                                align="center"
                                variant="body1"
                                color="primary"
                            >
                                Enter the payment address of the person or an
                                institution that you would like to add to your
                                contact book.
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                color="primary"
                                style={{ marginTop: "1rem" }}
                            >
                                We will send an invite if the user already has
                                an account. Otherwise we will try
                                to add them as a federated contact.
                            </Typography>
                        </div>
                    </div>

                    <div className="flex-box-row content-centered items-flex-end">
                        <SearchInput label="Payment Address"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                            error={this.state.error}
                            errorMessage={this.state.errorMessage}
                            id="payment-address"
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </div>


                <div className="swipeable-tab-container">
                    <div className="flex-box-row space-between items-centered">
                        <AccountBalanceRounded
                            classes={{ root: this.props.classes.icon }}
                        />
                        <div>
                            <Typography
                                align="center"
                                variant="body1"
                                color="primary"
                            >
                                If you know the account number of the person or
                                institution that you would like to have as a
                                contact, then enter it below.
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                color="primary"
                                style={{ marginTop: "1rem" }}
                            >
                                We will send an invite if the user already has
                                an account. Otherwise we will try
                                to add them as a federated contact.
                            </Typography>
                        </div>
                    </div>

                    <div className="flex-box-row content-centered items-flex-end">
                        <SearchInput label="Account Number"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                            error={this.state.error}
                            errorMessage={this.state.errorMessage}
                            id="account-number"
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </div>


                <div className="swipeable-tab-container">
                    <div className="flex-box-row space-between items-centered">
                        <AlternateEmailRounded
                            classes={{ root: this.props.classes.icon }}
                        />
                        <div>
                            <Typography
                                align="center"
                                variant="body1"
                                color="primary"
                            >
                                Share the good news with your friends and family!
                                Enter email address of the person you would like
                                to invite to use this platform.
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                color="primary"
                                style={{ marginTop: "1rem" }}
                            >
                                We will send an invite if the user is not yet
                                in our system.
                            </Typography>
                        </div>
                    </div>

                    <div className="flex-box-row content-centered items-flex-end">
                        <SearchInput label="Email Address"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                            error={this.state.error}
                            errorMessage={this.state.errorMessage}
                            id="email"
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </div>

            </SwipeableViews>


            <div className="status-message-area flex-box-row content-centered items-centered">

                {this.state.showProgress &&
                <Fragment>
                    <RequestProgress />
                    <Typography noWrap variant="h5" color="primary">
                        Sending request ...
                    </Typography>
                </Fragment>
                }

                {this.state.showRequestSent &&
                <div className="flex-box-col content-centered items-centered">
                    <Typography noWrap variant="h5" color="primary">
                        Request sent to:
                    </Typography>
                    <Typography noWrap variant="h5" color="primary">
                        <b>{this.state.lastInput}</b>
                    </Typography>

                    <Typography noWrap variant="body1" color="primary">
                        Go ahead, send another!
                    </Typography>
                </div>
                }

            </div>

            <div className="flex-box-row content-flex-end">
                <DoneButton onClick={this.hideModal} />
            </div>

        </Fragment>
}




// ...
export default compose(
    withStyles(styles),
    connect(
        // map state to props
        (state, theme) => ({
            Modal: state.Modal,
            theme,
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
            accountEmail: state.Account.email,
            accountFirstName: state.Account.firstName,
            accountLastName: state.Account.lastName,
        }),
        (dispatch) => bindActionCreators({
            setState: ContactsAction.setState,
            hideModal: ModalAction.hideModal,
            showAlert: AlertAction.showAlert,
        }, dispatch)
    )
)(AddContactForm)
