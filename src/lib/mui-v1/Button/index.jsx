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
