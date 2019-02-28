import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "@material-ui/core/styles"
import { Button } from "@material-ui/core"




// <CustomButton> component
export default withStyles((theme) => ({

    awesome: {
        color: "white",
        background: "linear-gradient(30deg, rgb(178, 34, 34) 10%, rgb(244, 176, 4) 100%)",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },

    primary: {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },

    secondary: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.secondary.main,
        "&:hover": {
            backgroundColor: theme.palette.secondary.light,
        },
    },

    success: {
        color: theme.palette.success,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.successHighlight,
            textShadow: `0px 0px 20px ${theme.palette.success}`,
        },
    },

    warning: {
        color: theme.palette.warning,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.warningHighlight,
            textShadow: `0px 0px 40px ${theme.palette.warning}`,
        },
    },

    danger: {
        color: theme.palette.danger,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.dangerHighlight,
            textShadow: `0px 0px 20px ${theme.palette.danger}`,
        },
    },

    common: {
        borderRadius: "2px",
        transition: "text-shadow 350ms ease-out, background-color 350ms ease",
        boxShadow: "0 3px 7px rgba(0, 0, 0, 0.3)",
        marginRight: "0.5rem",
        "&:last-child": {
            marginLeft: "0rem",
            marginRight: "0rem",
        },
    },

    disabled: {
        color: `${theme.palette.disabledColor} !important`,
        backgroundColor: `${theme.palette.disabledBackgroundColor} !important`,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ children, classes, color, disabled, fullWidth, onClick, style }) =>
                <Button
                    variant="contained"
                    className={
                        classNames(
                            disabled ? classes.disabled : classes[color],
                            classes.common,
                        )
                    }
                    onClick={onClick}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    style={style}

                >
                    { children ? children : "Button" }
                </Button>
        )(this.props)

    }
)
