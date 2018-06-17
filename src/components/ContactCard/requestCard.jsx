import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { action as ContactsAction } from "../../redux/Contacts"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import {
    approveInternal, rejectInternal, listInternal, listPending, listRequested,
} from "../Contacts/api"
import {
    pubKeyAbbr,
    getUserExternalContacts,
} from "../../lib/utils"




// ...
const styles = (theme) => ({

    success: {
        color: theme.palette.success,
        backgroundColor: theme.palette.primaryColor,
        "&:hover": {
            backgroundColor: theme.palette.successHighlight,
            textShadow: `0px 0px 20px ${theme.palette.success}`,
        },
        marginLeft: "1.2rem",
        marginRight: "0.5rem",
    },

    danger: {
        color: theme.palette.danger,
        backgroundColor: theme.palette.primaryColor,
        "&:hover": {
            backgroundColor: theme.palette.dangerHighlight,
            textShadow: `0px 0px 20px ${theme.palette.danger}`,
        },
    },
})

// ...
const ActionButton = withStyles(styles)(
    ({ classes, onClick, color, label,}) =>
        <Button onClick={onClick} variant="raised"
            size="small" className={classes[color]}
        >
            <Typography noWrap variant="button" color="inherit">
                {label}
            </Typography>
        </Button>
)


// ...
export default compose(
    connect(
        // map state to props.
        (state) => ({
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            setState: ContactsAction.setState,
        }, dispatch)
    ),
    withStyles((theme) => ({
        root: theme.mixins.gutters({
            paddingTop: 16,
            paddingBottom: 16,
            minWidth: 250,
            backgroundColor: theme.palette.secondary.main,
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
        acceptContact = (requested_by) => {
            approveInternal(
                this.props.userId, this.props.token, requested_by
            ).then((_response) => {
                listInternal(this.props.userId, this.props.token)
                    .then((results) => {
                        results ? this.props.setState({
                            internal: results,
                        }) : this.props.setState({
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
            })
        }


        // ...
        rejectContact = (requested_by) => {
            rejectInternal(
                this.props.userId, this.props.token, requested_by
            ).then((_response) => {
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
            })

        }


        // ...
        render = () => (
            ({ classes, data, }) =>
                <Paper elevation={3}
                    className={classes.root}
                >
                    <div className="f-b space-between">
                        <Avatar className={classes.avatar}
                            src={`${gravatar}${data.email_md5}?${
                                gravatarSize48}&d=robohash`}
                        />
                        <div className="f-b">
                            <div className="f-e-col space-between">
                                <div className="f-e-col">
                                    <Typography align="right" noWrap>
                                        {data.first_name} {data.last_name}
                                    </Typography>
                                    <Typography variant="caption" align="right"
                                        noWrap
                                    >
                                        {data.alias}*{data.domain}
                                    </Typography>
                                </div>
                                <Typography variant="caption" align="right"
                                    noWrap
                                >
                                    {pubKeyAbbr(data.pubkey)}
                                </Typography>
                            </div>
                            <div className="f-e space-between">
                                <ActionButton
                                    onClick={this.acceptContact.bind(
                                        this,
                                        data.requested_by
                                    )}
                                    variant="raised"
                                    color="success" size="small"
                                    label="Accept"
                                />

                                <ActionButton
                                    onClick={this.rejectContact.bind(
                                        this,
                                        data.requested_by
                                    )}
                                    variant="raised"
                                    color="danger" size="small"
                                    label="Block"
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)
