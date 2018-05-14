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

    secondary: {
        color: theme.palette.secondaryColor,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.secondaryColor} !important`,
            height: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.secondaryColor, },
        "&:after": { borderBottomColor: theme.palette.secondaryColor, },
    },

    root: { color: "rgba(212,228,188,0.6)", },

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
                classes, id, color, error, errorMessage,
                label, type, onChange, fullWidth, autoComplete,
            }) =>
                <FormControl
                    error={error}
                    fullWidth={fullWidth || true}
                    className={classes.formControl}
                    margin="dense"
                >
                    <InputLabel
                        FormLabelClasses={{
                            root: classes.root,
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
                    />
                    <FormHelperText id="name-error-text">
                        { errorMessage }
                    </FormHelperText>
                </FormControl>
        )(this.props)

    }
)
