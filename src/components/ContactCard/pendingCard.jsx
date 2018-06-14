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
import {
    pubKeyAbbr,
} from "../../lib/utils"




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
            backgroundColor: theme.palette.secondary.dark,
        }),

        avatar: {
            borderRadius: 3,
            width: 48,
            height: 48,
            border: `1px solid ${theme.palette.primary.dark}`,
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
                            <div className="f-e space-between p-l fade-strong">
                                <Typography variant="body1" align="right"
                                    noWrap
                                >
                                    Pending Approval
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)
