import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { action as ContactsAction } from "../../redux/Contacts"
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import { ellipsis, formatPaymentAddress } from "../../lib/utils"




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
            opacity: "0.7",
        }),

        avatar: {
            borderRadius: 3,
            width: 48,
            height: 48,
            marginRight: 5,
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
        render = () => (
            ({ classes, data, }) =>
                <Paper elevation={0}
                    className={classes.root}
                >
                    <div className="f-b space-between">
                        <Avatar className={classes.avatar}
                            src={`${gravatar}xxx?${
                                gravatarSize48}&d=mm`}
                        />
                        <div className="f-b">
                            <div className="f-e-col center">
                                <div className="f-e-col">
                                    <Typography
                                        align="right"
                                        variant="body1"
                                    >
                                        {data.request_str ?
                                            ellipsis(data.request_str, 16) :
                                            formatPaymentAddress(
                                                data.alias, data.domain
                                            )}
                                    </Typography>
                                </div>
                            </div>
                            <div className="f-e-col space-around p-l fade">
                                <Typography variant="body1" align="center"
                                    color="primary"
                                    noWrap
                                >
                                    <span className="badge-pending">
                                        Pending
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)
