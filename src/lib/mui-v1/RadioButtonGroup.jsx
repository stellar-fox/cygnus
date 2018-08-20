import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "@material-ui/core/styles"
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@material-ui/core"




// <RadioButtonGroup> component
export default withStyles((theme) => ({

    group: {
        margin: `0 ${theme.spacing.unit}px 0 0`,
    },

    primary: {
        fontSize: "0.8rem",
        fontWeight: 400,
        color: theme.palette.primary.main,
        "&$checked": {
            color: theme.palette.primary.main,
        },
    },

    secondary: {
        fontSize: "0.8rem",
        fontWeight: 400,
        color: theme.palette.secondary.main,
        "&$checked": {
            color: theme.palette.secondary.main,
        },
    },

    checked: {},

}))(
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
            ({ name, onChange, value, children, classes, }) =>
                <FormControl component="fieldset" required>
                    <RadioGroup
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={classes.group}
                    >
                        {
                            children.map((c) =>
                                this.button(
                                    c.value, c.label, c.color, classes
                                )
                            )
                        }
                    </RadioGroup>
                </FormControl>
        )(this.props)

    }
)
