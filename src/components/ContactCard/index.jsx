import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import PropTypes from "prop-types"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import {
    formatFullName, formatPaymentAddress, pubKeyAbbr
} from "../../lib/utils"




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
            cursor: "pointer",
            paddingTop: 16,
            paddingBottom: 16,
            minWidth: 250,
        }),

        rootAlt: theme.mixins.gutters({
            cursor: "pointer",
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: theme.palette.secondary.light,
            minWidth: 250,
        }),

        avatar: {
            borderRadius: 3,
            width: 48,
            height: 48,
            border: `1px solid ${theme.palette.primary.light}`,
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
            ({ classes, data, external, }) =>
                <Paper
                    onClick={this.showContactDetails.bind(
                        this, {contact: data, external,})
                    }
                    elevation={3}
                    className={external ? classes.rootAlt : classes.root}
                >
                    <div className="f-b space-between">
                        <Avatar className={classes.avatar}
                            src={`${gravatar}${data.email_md5}?${
                                gravatarSize48}&d=robohash`}
                        />
                        <div className="f-e-col space-between">
                            <div className="f-e-col">
                                <Typography align="right" noWrap>
                                    {formatFullName(
                                        data.first_name, data.last_name
                                    )}
                                </Typography>
                                <Typography variant="caption" align="right"
                                    noWrap
                                >
                                    {formatPaymentAddress(
                                        data.alias, data.domain
                                    )}
                                </Typography>
                            </div>
                            <Typography variant="caption" align="right"
                                noWrap
                            >
                                {pubKeyAbbr(data.pubkey)}
                            </Typography>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)
