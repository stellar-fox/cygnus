import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "@material-ui/core/styles"
import { Switch } from "@material-ui/core"




// <CustomSwitch> component
export default withStyles((theme) => ({

    checked: {},

    primary: {
        color: theme.palette.primary.main,
        "&$checked": {
            color: theme.palette.primary.main,
        },
    },

    secondary: {
        color: theme.palette.secondary.main,
        "&$checked": {
            color: theme.palette.secondary.main,
        },
    },

    disabled: {
        color: `${theme.palette.disabledSwitchColor} !important`,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, checked, onChange, value, color, disabled }) =>
                <Switch
                    checked={checked}
                    onChange={onChange}
                    value={value}
                    classes={{
                        colorPrimary: classes.primary,
                        colorSecondary: classes.secondary,
                        checked: classes.checked,
                        disabled: classes.disabled,
                    }}
                    color={color}
                    disabled={disabled}
                />
        )(this.props)

    }
)
