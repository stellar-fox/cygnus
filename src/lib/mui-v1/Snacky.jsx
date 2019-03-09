import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { action as SnackyActions } from "../../redux/Snacky"
import { IconButton, Snackbar, Typography } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { string } from "@xcmats/js-toolbox"




// <Snacky> component
export default compose(
    withStyles((theme) => ({
        success: {
            backgroundColor: theme.palette.secondary.light,
        },
        warning: {
            backgroundColor: theme.palette.warning,
        },
        error: {
            backgroundColor: theme.palette.danger,
            // color: theme.palette.error.contrastText,
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
                    open={open}
                    autoHideDuration={6000}
                    onClose={this.hideSnacky}
                    onExited={this.reset}

                    ContentProps={{
                        "aria-describedby": "message-id",
                        classes: { root: classes[color] },
                    }}
                    message={
                        <span id="message-id">
                            <Typography variant="body2" color="inherit">
                                {message}
                            </Typography>
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.hideSnacky}
                        >
                            <Close />
                        </IconButton>,
                    ]}
                />
        )(this.props)

    }
)
