import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Axios from "axios"
import { config } from "../../config"
import {
    listInternal, listPending, listRequested, requestByAccountNumber,
    requestByEmail, requestByPaymentAddress,
} from "../Contacts/api"
import {
    getUserExternalContacts,
    emailValid,
    federationAddressValid,
    getFederationRecord,
    toAliasAndDomain,
    publicKeyValid,
} from "../../lib/utils"
import { stellarFoxDomain } from "../StellarFox/env"
import { action as AlertAction } from "../../redux/Alert"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import SwipeableViews from "react-swipeable-views"

import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"




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

    input: {
        color: theme.palette.primary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main, },
        "&:after": { borderBottomColor: theme.palette.primary.main, },
    },

    inputMargin: {
        margin: "0px",
    },

    progress: {
        marginBottom: "0px",
        marginRight: "10px",
    },

})


// ...
const RequestProgress = withStyles(styles)(
    ({ classes, }) =>
        <CircularProgress color="primary" className={classes.progress}
            thickness={3} size={25}
        />
)


// ...
const SearchButton = withStyles(styles)(
    ({ classes, buttonText, color, disabled, onClick, }) =>
        <Button variant="raised" disabled={disabled}
            color={color} onClick={onClick}
            className={classNames(classes.button, classes.primaryRaised)}
        >
            {buttonText}
        </Button>
)


// ...
const DoneButton = withStyles(styles)(
    ({ classes, onClick, }) =>
        <Button variant="raised" color="primary" onClick={onClick}
            className={classNames(classes.buttonDone, classes.primaryRaised)}
        >
            Done
        </Button>
)


// ...
const SearchInput = withStyles(styles)(
    ({ classes, label, onChange, value, error, errorMessage, }) => <TextField
        id="seach-by"
        label={errorMessage || label}
        value={value}
        error={error}
        type="search"
        className={classes.textField}
        margin="normal"
        onChange={onChange}
        autoFocus
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
    ({ onChange, value, }) => <Tabs
        value={ value }
        onChange={ onChange }
        textColor="primary"
        indicatorColor="primary"
        fullWidth
    >
        <Tab disableRipple label="Email Address" />
        <Tab disableRipple label="Payment Address" />
        <Tab disableRipple label="Account Number" />
    </Tabs>
)


// ...
const TabContainer = withStyles(styles)(
    ({ children, dir, }) =>
        <Typography component="div" dir={dir} style={{ paddingTop: "2rem", }}>
            {children}
        </Typography>
)


// ...
class AddContactForm extends Component {

    state = {
        showProgress: false,
        showRequestSent: false,
        tabSelected: 0,
        buttonDisabled: false,
        input: "",
        lastInput: "",
        error: false,
        errorMessage: "",
    }


    // ...
    onTabChange = (_event, value) =>
        this.setState({
            tabSelected: value,
            input: "",
            lastInput: "",
            showRequestSent: false,
            error: false,
            errorMessage: "",
        })


    // ...
    requestContact = () => {

        // check email address validity
        if (!emailValid(this.state.input) && this.state.tabSelected === 0) {
            this.setState({
                error: true,
                errorMessage: "Invalid email address.",
            })
            return
        }

        // check payment address validity
        if (!federationAddressValid(this.state.input) &&
            this.state.tabSelected === 1) {
            this.setState({
                error: true,
                errorMessage: "Invalid payment address.",
            })
            return
        }

        // check account number validity
        if (!publicKeyValid(this.state.input) &&
            this.state.tabSelected === 2) {
            this.setState({
                error: true,
                errorMessage: "Invalid account number.",
            })
            return
        }


        // input is valid at this point

        this.setState({
            error: false,
            errorMessage: "",
            showProgress: true,
            showRequestSent: false,
            buttonDisabled: true,
            lastInput: this.state.input,
        })

        // try adding a contact based on email address
        if (this.state.tabSelected === 0) {
            this.setState({
                showProgress: false,
                showRequestSent: false,
                buttonDisabled: false,
                input: "",
            })

            requestByEmail(
                this.props.userId, this.props.token, this.state.input
            ).then((_result) => {
                this.requestComplete()
            }).catch((error) => {
                this.requestFailed(error)
            })
        }

        // try adding a contact based on payment address
        else if (this.state.tabSelected === 1) {

            let [alias, domain,] = toAliasAndDomain(this.state.input)

            domain === stellarFoxDomain ?
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
                getFederationRecord(this.state.input).then((result) => {
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
        else if (this.state.tabSelected === 2) {
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
            input: "",
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
                "You have already sent a contact request to this person.",
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
            errorMessage: "",
            showProgress: false,
            showRequestSent: false,
            buttonDisabled: false,
            input: "",
            lastInput: "",
        })
        this.props.hideModal()
    }


    // ...
    handleInputChange = (event) =>
        this.setState({
            input: event.target.value,
            error: false,
            errorMessage: "",
        })


    // ...
    render = () =>
        <Fragment>
            <div className="f-b center p-t-medium">
                <Typography noWrap variant="body2" color="primary">
                    Request contact using the following categories:
                </Typography>
            </div>
            <div className="f-b center p-t">
                <ChoiceTabs onChange={this.onTabChange}
                    value={this.state.tabSelected}
                />
            </div>
            <SwipeableViews
                axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                index={this.state.tabSelected}
                onChangeIndex={this.handleChangeIndex}
            >
                <TabContainer dir={this.props.theme.direction}>
                    <Typography align="center" noWrap variant="body1"
                        color="primary"
                    >
                        Enter the email address of the person you want to add
                        to your contact book.
                    </Typography>
                    <div className="m-b" style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                    >
                        <SearchInput label="Email Address"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                            error={this.state.error}
                            errorMessage={this.state.errorMessage}
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </TabContainer>
                <TabContainer dir={this.props.theme.direction}>
                    <Typography align="center" noWrap variant="body1"
                        color="primary"
                    >
                        Enter the payment address of the person you want to add
                        to your contact book.
                    </Typography>
                    <div className="m-b" style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                    >
                        <SearchInput label="Payment Address"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                            error={this.state.error}
                            errorMessage={this.state.errorMessage}
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </TabContainer>
                <TabContainer dir={this.props.theme.direction}>
                    <Fragment>
                        <Typography align="center" noWrap variant="body1"
                            color="primary"
                        >
                            If you know the extended account number for
                            your contact, enter it below.
                        </Typography>
                        <div className="m-b" style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "center",
                        }}
                        >
                            <SearchInput label="Extended Account Number"
                                onChange={this.handleInputChange}
                                value={this.state.input}
                                error={this.state.error}
                                errorMessage={this.state.errorMessage}
                            />
                            <SearchButton buttonText="Request" color="primary"
                                onClick={this.requestContact}
                                disabled={this.state.buttonDisabled}
                            />
                        </div>
                    </Fragment>
                </TabContainer>
            </SwipeableViews>


            {!this.state.showProgress && !this.state.showRequestSent &&
                <div className="p-t"
                    style={{ height: "150px", paddingLeft: "20px", }}
                ></div>
            }


            {this.state.showProgress &&
                <div className="f-b center p-t" style={{ height: "150px", }}>
                    <RequestProgress />
                    <Typography noWrap variant="body2" color="primary">
                        Sending request ...
                    </Typography>
                </div>
            }


            {this.state.showRequestSent &&
                <div className="p-t" style={{ height: "150px", }}>
                    <div className="f-b center">
                        <Typography noWrap variant="body1" color="primary">
                            Request sent to:
                        </Typography>
                    </div>
                    <div className="f-b center">
                        <div className="tag-success">
                            <Typography noWrap variant="body2"
                                color="secondary"
                            >
                                {this.state.lastInput}
                            </Typography>
                        </div>
                    </div>
                    <div className="f-b center p-t">
                        <Typography noWrap variant="body1" color="primary">
                            Go ahead, send another!
                        </Typography>
                    </div>
                </div>
            }

            <div className="f-e">
                <DoneButton onClick={this.hideModal} />
            </div>

        </Fragment>
}


// ...
export default connect(
    // map state to props
    (state, theme) => ({
        Modal: state.Modal,
        theme,
        userId: state.LoginManager.userId,
        token: state.LoginManager.token,

    }),
    (dispatch) => bindActionCreators({
        setState: ContactsAction.setState,
        hideModal: ModalAction.hideModal,
        showAlert: AlertAction.showAlert,
    }, dispatch)
)(AddContactForm)