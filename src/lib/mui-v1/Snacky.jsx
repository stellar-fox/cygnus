import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { action as SnackyActions } from "../../redux/Snacky"
import {
    Snackbar,
    Typography,
} from "@material-ui/core"
import { string } from "@xcmats/js-toolbox"




// <Snacky> component
export default compose(
    withStyles((theme) => ({
        success: {
            backgroundColor: theme.palette.success,
            color: theme.palette.antiFlashWhite,
            padding: "0px 15px",
        },
        warning: {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.primary.light,
            padding: "0px 15px",
        },
        error: {
            backgroundColor: theme.palette.danger,
            color: "#D8DCDE",
            padding: "0px 15px",
        },
    })),
    connect(
        (state) => ({
            open: state.Snacky.open,
            color: state.Snacky.color,
            message: state.Snacky.message,
        }),
        (dispatch) => bindActionCreators({
            hideSnacky: SnackyActions.hideSnacky,
            setMessage: SnackyActions.setMessage,
            setColor: SnackyActions.setColor,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        hideSnacky = () => this.props.hideSnacky()


        // ...
        reset = () => {
            this.props.setMessage(string.empty())
            this.props.setColor("default")
        }


        // ...
        render = () => (
            ({ classes, open, message, color }) =>
                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    autoHideDuration={2000}
                    classes={{
                        root: classes.root,
                    }}
                    onClose={this.hideSnacky}
                    onExited={this.reset}
                    open={open}
                    ContentProps={{
                        "aria-describedby": "message-id",
                        classes: { root: classes[color] },
                    }}
                    message={<Typography variant="body1" color="inherit">
                        {message}
                    </Typography>}
                />
        )(this.props)

    }
)
