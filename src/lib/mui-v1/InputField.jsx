import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "@material-ui/core/styles"
import {
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
} from "@material-ui/core"




// <InputField> component
export default withStyles((theme) => ({

    primary: {
        color: theme.palette.primary.main,
        width: "220px !important",
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main },
        "&:after": { borderBottomColor: theme.palette.primary.main },
    },

    secondary: {
        color: theme.palette.secondary.main,
        width: "220px !important",
        "&:hover:before": {
            borderBottomColor: `${theme.palette.secondary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.secondary.main },
        "&:after": { borderBottomColor: theme.palette.secondary.main },
    },

    root: {
        color: "rgba(212,228,188,0.6) !important",
    },
    shrink: { color: "rgba(212,228,188,0.4) !important" },
    rootPrimary: { color: "rgba(15, 46, 83, 0.8)" },
    shrinkPrimary: { color: "rgba(15, 46, 83, 0.4) !important" },

    focused: {
        "&$root": {
            color: "rgba(212,228,188,0.4)",
        },
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({
                classes, id, color, error, errorMessage, margin,
                label, type, onChange, fullWidth, autoComplete, placeholder,
                maxLength,
            }) =>
                <FormControl
                    error={error}
                    fullWidth={fullWidth}
                    className={classes.formControl}
                    margin={margin || "dense"}
                >
                    <InputLabel
                        classes={{
                            shrink: color === "secondary" ? classes.shrink : classes.shrinkPrimary,
                            formControl: classes.root,
                            focused: classes.focused,
                        }}
                    >
                        { label }
                    </InputLabel>
                    <Input
                        id={id}
                        autoComplete={autoComplete}
                        classes={{
                            underline: classes[color],
                            input: classes[color],
                        }}
                        type={type}
                        onChange={onChange}
                        fullWidth={fullWidth}
                        placeholder={placeholder}
                        inputProps={{
                            maxLength,
                        }}
                    />
                    <FormHelperText id="name-error-text">
                        { errorMessage }
                    </FormHelperText>
                </FormControl>
        )(this.props)

    }
)
