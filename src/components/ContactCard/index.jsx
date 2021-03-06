import React, { Component } from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import PropTypes from "prop-types"
import { string } from "@xcmats/js-toolbox"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import {
    Avatar,
    Paper,
    Typography,
} from "@material-ui/core"
import {
    gravatar,
    gravatarSize48,
} from "../StellarFox/env"
import {
    formatFullName,
    formatPaymentAddress,
    htmlEntities as he,
    pubKeyAbbr,
} from "../../lib/utils"
import md5 from "../../lib/md5"




// ...
export default compose(
    connect (
        (_state) => ({

        }),
        (dispatch) => bindActionCreators({
            setState: ContactsAction.setState,
            showModal: ModalAction.showModal,
        }, dispatch),
    ),
    withStyles((theme) => ({
        root: theme.mixins.gutters({
            borderRadius: "2px",
            cursor: "pointer",
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
            minWidth: 250,
            maxHeight: 96,
        }),

        rootAlt: theme.mixins.gutters({
            borderRadius: "2px",
            cursor: "pointer",
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
            backgroundColor: theme.palette.secondary.light,
            minWidth: 250,
            maxHeight: 96,
        }),

        avatar: {
            borderRadius: 3,
            width: 48,
            height: 48,
            border: `1px solid ${theme.palette.secondary.dark}`,
        },

    }))
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        showContactDetails = (data, _event) => {
            this.props.setState({
                details: data,
            })
            this.showModal()
        }


        // ...
        showModal = () => this.props.showModal("editContact")


        // ...
        render = () => (
            ({ classes, data, external }) =>
                <Paper
                    onClick={this.showContactDetails.bind(
                        this, {contact: data, external})
                    }
                    elevation={3}
                    className={`${external ? classes.rootAlt : classes.root} ${
                        external ? "bg-ext-contact" : "bg-contact"}`}
                >
                    <div className="flex-box-row space-between">
                        <Avatar className={classes.avatar}
                            src={`${gravatar}${external ? md5(data.pubkey) :
                                data.email_md5}?${gravatarSize48}&d=robohash`}
                        />

                        <div className="flex-box-col">
                            <Typography
                                align="right"
                                color="primary"
                            >
                                {string.shorten(formatFullName(
                                    data.first_name, data.last_name
                                ), 24, string.shorten.END)}
                            </Typography>
                            <Typography
                                variant="h5"
                                align="right"
                                color="primary"
                            >
                                {string.shorten(formatPaymentAddress(
                                    data.alias, data.domain
                                ), 30, string.shorten.END)}
                            </Typography>
                            <Typography
                                variant="h6"
                                align="right"
                                color="primary"
                            >
                                {pubKeyAbbr(data.pubkey)}
                                {external && <strong>
                                    <he.Nbsp /><he.Nbsp /><he.Nbsp />
                                    FEDERATED</strong>}
                            </Typography>
                        </div>


                    </div>
                </Paper>
        )(this.props)
    }
)
