import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { action as ContactsAction } from "../../redux/Contacts"
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import { formatPaymentAddress } from "../../lib/utils"




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
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
            minWidth: 250,
            maxHeight: 96,
            backgroundColor: theme.palette.secondary.main,
            opacity: "0.5",
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
            ({ classes, data }) =>
                <Paper elevation={0} className={classes.root}>
                    <div className="f-b space-between">
                        <Avatar className={classes.avatar}
                            src={`${gravatar}xxx?${gravatarSize48}&d=mm`}
                        />
                        <div className="f-e-col space-between">
                            <Typography align="right" color="primary">
                                <span className="badge-pending">
                                    Pending Approval
                                </span>
                            </Typography>
                            <Typography variant="body1" align="right"
                                color="primary"
                            >
                                {data.request_str ? string.shorten(
                                    data.request_str, 16, string.shorten.END
                                ) : formatPaymentAddress(
                                    data.alias, data.domain
                                )}
                            </Typography>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)
