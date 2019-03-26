import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { action as ContactsAction } from "../../redux/Contacts"
import {
    Paper,
    Typography,
} from "@material-ui/core"
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
            borderRadius: "2px",
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
            minWidth: 250,
            maxHeight: 96,
            backgroundColor: theme.palette.secondary.main,
            opacity: "0.95",
        }),

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

                    <div className="flex-box-row">
                        <Typography>
                            <span className="red-badge">
                                Pending Approval
                            </span>
                        </Typography>
                    </div>

                    <div className="m-t-small flex-box-row">
                        <Typography variant="body1" color="primary">
                            {data.request_str ? string.shorten(
                                data.request_str, 25, string.shorten.END
                            ) : formatPaymentAddress(
                                data.alias, data.domain
                            )}
                        </Typography>
                    </div>

                </Paper>
        )(this.props)
    }
)
