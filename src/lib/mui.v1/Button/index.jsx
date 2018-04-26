import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "material-ui-next/styles"
import Button from "material-ui-next/Button"

// ...
const styles = theme => ({
    cssRoot: {
        color: theme.palette.getContrastText(theme.palette.secondaryColor),
        backgroundColor: theme.palette.secondaryColor,
        "&:hover": {
            backgroundColor: theme.palette.secondaryHighlight,
        },
        boxShadow: "0 3px 7px rgba(0, 0, 0, 0.5)",
    },
})

const CustomButton = (props) => {
    const { classes, } = props
    return (
        <Button
            variant="raised"
            color="primary"
            className={classNames(classes.cssRoot)}
            onClick={props.onClick}
        >
            {props.children ? props.children : "Button"}
        </Button>
    )
}

CustomButton.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CustomButton)