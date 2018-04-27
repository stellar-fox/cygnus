import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "material-ui-next/styles"
import Button from "material-ui-next/Button"




// ...
const styles = (theme) => ({

    primary: {
        color: theme.palette.secondaryColor,
        backgroundColor: theme.palette.primaryColor,
        "&:hover": {
            backgroundColor: theme.palette.primaryHighlight,
        },
    },

    secondary: {
        color: theme.palette.primaryColor,
        backgroundColor: theme.palette.secondaryColor,
        "&:hover": {
            backgroundColor: theme.palette.secondaryHighlight,
        },
    },

    success: {
        color: theme.palette.success,
        backgroundColor: theme.palette.primaryColor,
        "&:hover": {
            backgroundColor: theme.palette.successHighlight,
            textShadow: `0px 0px 20px ${theme.palette.success}`,
        },
    },

    warning: {
        color: theme.palette.warning,
        backgroundColor: theme.palette.primaryColor,
        "&:hover": {
            backgroundColor: theme.palette.warningHighlight,
            textShadow: `0px 0px 40px ${theme.palette.warning}`,
        },
    },

    danger: {
        color: theme.palette.danger,
        backgroundColor: theme.palette.primaryColor,
        "&:hover": {
            backgroundColor: theme.palette.dangerHighlight,
            textShadow: `0px 0px 20px ${theme.palette.danger}`,
        },
    },

    common: {
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

})




// <CustomButton> component...
export default withStyles(styles)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ children, classes, color, disabled, fullWidth, onClick, }) =>
                <Button
                    variant="raised"
                    className={
                        classNames(
                            disabled ? classes.disabled : classes[color],
                            classes.common,
                        )
                    }
                    onClick={onClick}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    
                >
                    { children ? children : "Button" }
                </Button>
        )(this.props)

    }
)
