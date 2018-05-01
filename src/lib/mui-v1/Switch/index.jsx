import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "material-ui-next/styles"
import Switch from "material-ui-next/Switch"




// ...
const styles = (theme) => ({
    bar: {},
    checked: {},
    primary: {
        color: theme.palette.primaryColor,
        "&$checked": {
            color: theme.palette.primaryColor,
            "& + $bar": {
                backgroundColor: theme.palette.primaryHighlight,
            },
        },
    },
    secondary: {
        color: theme.palette.secondaryColor,
        "&$checked": {
            color: theme.palette.secondaryColor,
            "& + $bar": {
                backgroundColor: theme.palette.secondaryHighlight,
            },
        },
    },
    disabled: {
        color: `${theme.palette.disabledSwitchColor} !important`,
    },
})


// ...
export default withStyles(styles)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, checked, onChange, value, color, disabled,}) =>
                <Switch
                    checked={checked}
                    onChange={onChange}
                    value={value}
                    classes={{
                        colorPrimary: classes.primary,
                        colorSecondary: classes.secondary,
                        checked: classes.checked,
                        bar: classes.bar,
                        disabled: classes.disabled,
                    }}
                    color={color}
                    disabled={disabled}
                />
        )(this.props)

    }
)
