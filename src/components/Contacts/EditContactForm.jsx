import React, { Component, Fragment } from "react"
import { bindActionCreators, compose, } from "redux"
import { connect } from "react-redux"
import { withAssetManager } from "../AssetManager"
import { gravatar, gravatarSize } from "../StellarFox/env"
import { config } from "../../config"
import {
    getUserContacts,
    getUserExternalContacts,
    getContactRequests,
    formatFullName,
    formatPaymentAddress,
    pubKeyAbbr
} from "../../lib/utils"
import AlertChoiceModal from "../Layout/AlertChoiceModal"
import { action as AlertAction } from "../../redux/Alert"
import { action as AlertChoiceAction } from "../../redux/AlertChoice"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"

import Avatar from "@material-ui/core/Avatar"
import Badge from "@material-ui/core/Badge"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Axios from "axios"




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

    buttonDanger: {
        margin: "0.5rem 0rem",
        borderRadius: "3px",
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.error.dark,
        "&:hover": {
            backgroundColor: theme.palette.error.main,
        },
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
        top: "5px",
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
const DoneButton = withStyles(styles)(
    ({ classes, onClick, }) =>
        <Button variant="raised" color="primary" onClick={onClick}
            className={classNames(classes.buttonDone, classes.primaryRaised)}
        >
            Done
        </Button>
)


// ...
const DeleteContactButton = withStyles(styles)(
    ({ classes, onClick, }) =>
        <Button variant="raised" size="small" onClick={onClick}
            className={classNames(classes.buttonDanger)}
        >
            Delete Contact
        </Button>
)


// ...
const ContactDetails = withStyles(styles)(
    ({ classes, details, assetManager, deleteAction, }) =>
        <div className="f-b space-around p-t-large p-b-large">
            <div className="f-b-col">
                <Avatar className={classes.avatar}
                    src={`${gravatar}${details.contact.email_md5}?${
                        gravatarSize}&d=robohash`}
                />
                <Badge
                    badgeContent={
                        assetManager.getAssetGlyph(details.contact.currency)
                    } classes={{ badge: classes.badge, }}
                >
                    <Typography classes={{ root: classes.padded, }}
                        variant="body2" noWrap color="primary"
                    >
                        {assetManager.getAssetDescription(
                            details.contact.currency
                        )}
                    </Typography>
                </Badge>
            </div>
            <div className="f-b-col">
                <Typography variant="title" noWrap color="primary">
                    {formatFullName(
                        details.contact.first_name, details.contact.last_name
                    )}
                </Typography>
                <Typography classes={{ root: classNames(classes.padded), }}
                    variant="subheading" noWrap color="primary"
                >
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade-strong">Payment Address:</span>
                    </Typography>
                    {formatPaymentAddress(
                        details.contact.alias, details.contact.domain
                    )}
                </Typography>
                <Typography variant="body1" noWrap color="primary">
                    <Typography variant="caption" noWrap color="primary">
                        <span className="fade-strong">Account Number:</span>
                    </Typography>
                    {pubKeyAbbr(details.contact.pubkey)}
                </Typography>
                <DeleteContactButton onClick={deleteAction} />
            </div>
        </div>
)


// ...
class EditContactForm extends Component {


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
            // do nothing yet
        } else {
            await Axios.post(`${config.api}/contact/delete`, {
                user_id: this.props.userId,
                token: this.props.token,
                contact_id: this.props.details.contact.contact_id,
                requested_by: this.props.details.contact.requested_by,
            })
            this.props.setState({
                details: {
                    external: false,
                    contact: null,
                },
            })
        }

        this.props.hideChoiceAlert()

        this.props.showAlert("Contact has been deleted.", "Notice")

        this.updateContacts()
    }


    // ...
    updateContacts = () => {

        getUserContacts(this.props.userId, this.props.token)
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

        getContactRequests(this.props.userId, this.props.token)
            .then((results) => {
                results ? this.props.setState({
                    requests: results,
                }) : this.props.setState({
                    requests: [],
                })
            })
    }


    // ...
    render = () => (
        ({ details, assetManager, }) =>
            <Fragment>
                <AlertChoiceModal onYes={this.deleteContact} />
                {details.external ? null :
                    <ContactDetails details={details}
                        assetManager={assetManager}
                        deleteAction={this.deleteContactConfirm}
                    />
                }
                <div className="f-e">
                    <DoneButton onClick={this.props.hideModal} />
                </div>
            </Fragment>
    )(this.props)
}


// ...
export default compose(
    withAssetManager,
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
        }, dispatch)
    )
)(EditContactForm)