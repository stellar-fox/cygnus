import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "material-ui-next/styles"
import Button from "material-ui-next/Button"

// ...
const styles = theme => ({
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
    common: {
        boxShadow: "0 3px 7px rgba(0, 0, 0, 0.3)",
        marginRight: "0.5rem",
        "&:last-child": {
            marginLeft: "0rem",
            marginRight: "0rem",
        },
    },
    disabled: {
        color: "rgb(244,176,4) !important",
        backgroundColor: "rgb(209,151,4) !important",
    },
})

const CustomButton = (props) => {
    const { classes, } = props
    return (
        <Button
            variant="raised"
            className={classNames(
                props.disabled ? classes.disabled : classes[props.color],
                classes.common,
            )}
            onClick={props.onClick}
            disabled={props.disabled}
            fullWidth={props.fullWidth}
        >
            {props.children ? props.children : "Button"}
        </Button>
    )
}

CustomButton.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CustomButton)