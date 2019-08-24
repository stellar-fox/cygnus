import React, { Component, Fragment } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import {
    gravatar,
    gravatarSize,
} from "../StellarFox/env"
import {
    listInternal,
    listPending,
    listRequested,
    removeFederated,
    removeInternal,
    updateFederated,
} from "../Contacts/api"
import {
    getUserExternalContacts,
    federationAddressValid,
    formatFullName,
    formatMemo,
    formatPaymentAddress,
    ntoes,
    paymentAddress,
    pubKeyAbbr,
    toAliasAndDomain,
    getFederationRecord,
    invalidFederationAddressMessage
} from "../../lib/utils"
import AlertChoiceModal from "../Layout/AlertChoiceModal"
import CurrencyPicker from "../../lib/shared/CurrencyPicker"
import { action as AlertAction } from "../../redux/Alert"
import { action as AlertChoiceAction } from "../../redux/AlertChoice"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import {
    Avatar,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@material-ui/core"
import md5 from "../../lib/md5"
import { surfaceSnacky } from "../../thunks/main"
import { assetDescription } from "../../lib/asset-utils"




// ...
const styles = (theme) => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: "3px",
    },

    buttonDone: {
        margin: 0,
        borderRadius: "3px",
    },

    primaryRaised: {
        color: theme.palette.secondary.main,
    },

    buttonDanger: {
        borderRadius: "3px",
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.error.dark,
        "&:hover": {
            backgroundColor: theme.palette.error.main,
        },
    },

    textFieldInput: {
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

    avatar: {
        borderRadius: 3,
        width: 96,
        height: 96,
        padding: "2px",
        border: `2px solid ${theme.palette.primary.fade}`,
    },

    padded: {
        padding: "0.5rem 0rem",
    },

    badge: {
        position: "relative",
        top: "18px",
        left: "3px",
        height: "26px",
        width: "26px",
        background: theme.palette.secondary.main,
        color: theme.palette.primary.light,
        fontWeight: 600,
        fontSize: "1.35rem",
    },

})




// ...
const EditContactInfoTextField = withStyles(styles)(
    ({ classes, label, id, onChange, value, error, helperText }) =>
        <TextField
            id={id}
            label={label}
            value={value}
            error={error}
            helperText={helperText}
            type="text"
            margin="dense"
            onChange={onChange}
            InputProps={{
                classes: {
                    input: classes.textFieldInput,
                    underline: classes.textFieldInput,
                },
            }}
            InputLabelProps={{
                classes: {
                    root: classes.textFieldInput,
                    marginDense: classes.inputMargin,
                },
            }}
        />
)




// ...
const RequestProgress = withStyles(styles)(
    ({ classes }) =>
        <CircularProgress color="primary" className={classes.progress}
            thickness={3} size={25}
        />
)




// ...
const ModalButton = withStyles(styles)(
    ({ classes, onClick, label, style }) =>
        <Button variant="contained" color="primary" onClick={onClick}
            style={style}
            className={classNames(classes.buttonDone, classes.primaryRaised)}
        >
            {label}
        </Button>
)




// ...
const DeleteContactButton = withStyles(styles)(
    ({ classes, onClick }) =>
        <div>
            <Button
                variant="contained"
                size="small"
                onClick={onClick}
                className={classNames(classes.buttonDanger)}
            >
                Delete Contact
            </Button>
        </div>
)




// ...
const ExtContactDetails = withStyles(styles)(
    ({ classes, details, deleteAction, setCurrency, updateMemo,
        memoFieldValue, updateFirstName, firstNameFieldValue, updateLastName,
        lastNameFieldValue, updatePaymentAddress,
        paymentAddressFieldValue, currentCurrency, error, errorMessage }) =>

        <div className="flex-box-row space-around p-t-large p-b-large">

            <div className="flex-box-col">
                <Avatar className={classes.avatar}
                    src={`${gravatar}${md5(details.contact.pubkey)}?${
                        gravatarSize}&d=robohash`}
                />

                <div className="m-t flex-box-col">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade">
                            Preferred Currency:
                        </span>
                    </Typography>
                    <Typography variant="body1" noWrap color="primary">
                        {assetDescription(currentCurrency)}
                    </Typography>


                    <CurrencyPicker
                        defaultCurrency={details.contact.currency}
                        onChange={setCurrency}
                    />
                </div>

                <div className="m-t flex-box-col">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade">Account Number:</span>
                    </Typography>
                    <Typography variant="body1" noWrap color="primary">
                        {pubKeyAbbr(details.contact.pubkey)}
                    </Typography>
                </div>

            </div>


            <div className="flex-box-col">

                <div className="m-t flex-box-col">
                    <EditContactInfoTextField
                        id="edit-first-name"
                        label="First Name"
                        onChange={updateFirstName}
                        value={firstNameFieldValue}
                    />
                </div>

                <div className="m-t flex-box-col">
                    <EditContactInfoTextField
                        id="edit-last-name"
                        label="Last Name"
                        onChange={updateLastName}
                        value={lastNameFieldValue}
                    />
                </div>

                <div className="m-t flex-box-col">
                    <EditContactInfoTextField
                        id="edit-payment-address"
                        label="Payment Address"
                        onChange={updatePaymentAddress}
                        value={paymentAddressFieldValue}
                        error={error}
                        helperText={errorMessage}
                    />
                </div>

                <div className="m-t flex-box-col">
                    <EditContactInfoTextField
                        id="edit-memo"
                        label="Contact Memo"
                        onChange={updateMemo}
                        value={memoFieldValue}
                    />
                </div>

                <div className="m-t-medium flex-box-col">
                    <DeleteContactButton onClick={deleteAction} />
                </div>

            </div>
        </div>
)




// ...
const ContactDetails = withStyles(styles)(
    ({ classes, details, deleteAction }) =>
        <div className="flex-box-row space-around p-t-large p-b-large">
            <div className="flex-box-col">
                <Avatar className={classes.avatar}
                    src={`${gravatar}${details.contact.email_md5}?${
                        gravatarSize}&d=robohash`}
                />
                <div className="m-t flex-box-col">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade">
                            Preferred Currency:
                        </span>
                    </Typography>
                    <Typography variant="body1" noWrap color="primary">
                        {assetDescription(details.contact.currency)}
                    </Typography>
                </div>

                <div className="m-t flex-box-col">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade">
                            Contact Memo:
                        </span>
                    </Typography>
                    <Typography variant="body1" noWrap color="primary">
                        {formatMemo(
                            details.contact.memo_type, details.contact.memo
                        )}
                    </Typography>
                </div>

            </div>


            <div className="flex-box-col">
                <Typography
                    style={{ lineHeight: "2.5rem" }}
                    variant="h2"
                    noWrap
                    color="primary"
                >
                    {string.shorten(formatFullName(
                        details.contact.first_name, details.contact.last_name
                    ), 30, string.shorten.END)}
                </Typography>

                <div className="m-t flex-box-col">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade">
                            Payment Address:
                        </span>
                    </Typography>
                    <Typography variant="body1" noWrap color="primary">
                        {string.shorten(formatPaymentAddress(
                            details.contact.alias, details.contact.domain
                        ), 30, string.shorten.END)}
                    </Typography>
                </div>

                <div className="m-t flex-box-col">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade">
                            Account Number:
                        </span>
                    </Typography>
                    <Typography variant="body1" noWrap color="primary">
                        {pubKeyAbbr(details.contact.pubkey)}
                    </Typography>
                </div>

                <div className="m-t flex-box-col">
                    <DeleteContactButton onClick={deleteAction} />
                </div>
            </div>
        </div>
)




// ...
class EditContactForm extends Component {

    state = {
        memo: string.empty(),
        firstName: string.empty(),
        lastName: string.empty(),
        alias: string.empty(),
        domain: string.empty(),
        paymentAddress: string.empty(),
        defaultCurrency: "eur",
        inProgress: false,
        error: false,
        errorMessage: string.empty(),
    }


    // ...
    componentDidMount = () =>
        this.setState({
            memo: ntoes(this.props.details.contact.memo),
            firstName: ntoes(this.props.details.contact.first_name),
            lastName: ntoes(this.props.details.contact.last_name),
            alias: ntoes(this.props.details.contact.alias),
            domain: ntoes(this.props.details.contact.domain),
            paymentAddress: paymentAddress(
                this.props.details.contact.alias,
                this.props.details.contact.domain
            ),
            defaultCurrency: this.props.details.contact.currency,
        })


    // ...
    setExtContactDefaultCurrency = (currency) => {
        this.setState({ defaultCurrency: currency })
    }


    // ...
    deleteContactConfirm = () => {
        this.props.showChoiceAlert(
            "Delete contact from your contact book?",
            "Warning"
        )
    }


    // ...
    deleteContact = async () => {

        this.props.hideModal()

        if (this.props.details.external) {
            await removeFederated(
                this.props.userId,
                this.props.token,
                this.props.details.contact.id,
                this.props.userId,
            )

        } else {
            await removeInternal(
                this.props.userId, this.props.token,
                this.props.details.contact.contact_id
            )
        }

        this.props.setState({
            details: {
                external: false,
                contact: null,
            },
        })

        this.props.hideChoiceAlert()

        surfaceSnacky("success", "Contact has been deleted.")

        this.updateContacts()
    }


    // ...
    hideDetails = () => {
        this.props.hideModal()
        this.props.setState({
            details: {
                external: false,
                contact: null,
            },
        })
    }

    // ...
    updateContactInfo = async () => {

        await this.setState({
            error: false,
            errorMessage: string.empty(),
            inProgress: true,
        })

        /**
         * When saving payment address, we need to make sure the address is
         * indeed valid and maps to THE SAME account number!
         */

        if (this.state.paymentAddress) {
            const federationAddress = paymentAddress(
                this.state.alias, this.state.domain
            )

            const errorMessage = invalidFederationAddressMessage(
                federationAddress
            )

            if (errorMessage) {
                await this.setState({
                    error: true,
                    errorMessage,
                    inProgress: false,
                })
                return false
            }
            try {
                const fedRecord = await getFederationRecord(federationAddress)
                if (fedRecord.account_id !== this.props.details.contact.pubkey) {
                    await this.setState({
                        error: true,
                        errorMessage: "No address match.",
                        inProgress: false,
                    })
                    return false
                }
            } catch (error) {
                await this.setState({
                    error: true,
                    errorMessage: error.response &&
                        error.response.status === 404 ?
                        "Address not found." : error.message,
                    inProgress: false,
                })
                return false
            }

            await this.setState({
                error: false,
                errorMessage: string.empty(),
                inProgress: true,
            })
        }

        try {

            await updateFederated(this.props.userId, this.props.token, {
                id: this.props.details.contact.id,
                currency: this.state.defaultCurrency,
                memo: this.state.memo,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                alias: this.state.alias,
                domain: this.state.domain,
            })

            const results = await getUserExternalContacts(
                this.props.userId, this.props.token
            )

            results ? this.props.setState({
                details: Object.assign(this.props.details, {
                    contact: Object.assign(this.props.details.contact,
                        {currency: this.state.defaultCurrency}
                    ),
                }),
            }) : this.props.setState({
                details: [],
            })

            results ? this.props.setState({
                external: results,
            }) : this.props.setState({
                external: [],
            })

            this.updateContacts()
            await this.setState({ inProgress: false })
            this.hideDetails()

        } catch (error) {
            await this.setState({ inProgress: false })
            this.props.showAlert("Unable to update contact info.", "Error")
        }
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
            }) &&

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
    updateFirstName = (event) =>
        this.setState({ firstName: event.target.value })


    // ...
    updateLastName = (event) =>
        this.setState({ lastName: event.target.value })


    // ...
    updateMemo = (event) =>
        this.setState({ memo: event.target.value })


    // ...
    updatePaymentAddress = (event) => {
        if (federationAddressValid(event.target.value)) {
            let [alias, domain] = toAliasAndDomain(event.target.value)
            this.setState({
                alias,
                domain,
                paymentAddress: event.target.value,
            })
        } else {
            this.setState({
                alias: string.empty(),
                domain: string.empty(),
                paymentAddress: event.target.value,
            })
        }
    }


    // ...
    render = () => (
        ({ details }) =>
            <Fragment>
                <AlertChoiceModal onYes={this.deleteContact} />

                {details.external ?
                    <ExtContactDetails
                        details={details}
                        deleteAction={this.deleteContactConfirm}
                        setCurrency={this.setExtContactDefaultCurrency}
                        updateMemo={this.updateMemo}
                        memoFieldValue={this.state.memo}
                        updateFirstName={this.updateFirstName}
                        firstNameFieldValue={this.state.firstName}
                        updateLastName={this.updateLastName}
                        lastNameFieldValue={this.state.lastName}
                        updatePaymentAddress={this.updatePaymentAddress}
                        paymentAddressFieldValue={this.state.paymentAddress}
                        currentCurrency={this.state.defaultCurrency}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                    /> :
                    <ContactDetails
                        details={details}
                        deleteAction={this.deleteContactConfirm}
                    />
                }
                <div className="f-e">
                    { this.state.inProgress ? <RequestProgress /> : null }
                    { details.external &&
                        <ModalButton style={{ marginRight: "0.5rem" }}
                            onClick={this.updateContactInfo} label="Update"
                        />
                    }
                    <ModalButton
                        onClick={this.hideDetails}
                        label={details.external ? "Cancel" : "Close"}
                    />
                </div>
            </Fragment>
    )(this.props)
}




// ...
export default compose(
    connect(
        (state, theme) => ({
            theme,
            details: state.Contacts.details,
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
        }),
        (dispatch) => bindActionCreators({
            setState: ContactsAction.setState,
            hideModal: ModalAction.hideModal,
            showAlert: AlertAction.showAlert,
            showChoiceAlert: AlertChoiceAction.showAlert,
            hideChoiceAlert: AlertChoiceAction.hideAlert,
            surfaceSnacky,
        }, dispatch)
    )
)(EditContactForm)
