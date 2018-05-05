import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "material-ui-next/styles"
import Radio, { RadioGroup } from "material-ui-next/Radio"
import { FormControl, FormControlLabel, } from "material-ui-next/Form"




// ...
const styles = (theme) => ({

    group: {
        margin: `0 ${theme.spacing.unit}px 0 0`,
    },

    primary: {
        color: theme.palette.primaryColor,
        "&$checked": {
            color: theme.palette.primaryColor,
        },
    },

    secondary: {
        color: theme.palette.secondaryColor,
        "&$checked": {
            color: theme.palette.secondaryColor,
        },
    },

    checked: {},

})




// <RadioButtonGroup> component
export default withStyles(styles)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        button = (value, label, color, classes) =>
            <FormControlLabel
                value={value}
                control={
                    <Radio classes={{
                        root: classes[color],
                        checked: classes.checked,
                    }}
                    />}
                label={label}
                classes={{ label: classes[color], }}
                key={value}
            />


        // ...
        render = () => (
            ({name, onChange, value, children, classes,}) =>
                <FormControl component="fieldset" required>
                    <RadioGroup
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={classes.group}
                    >
                        {
                            children.map((c) =>
                                this.button(c.value, c.label, c.color, classes)
                            )
                        }
                    </RadioGroup>
                </FormControl>
        )(this.props)

    }
)