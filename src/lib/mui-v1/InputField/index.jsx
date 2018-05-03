import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "material-ui-next/styles"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import Input, { InputLabel } from "material-ui-next/Input"




// ...
const styles = (theme) => ({
    secondary: {
        color: theme.palette.secondaryColor,
        "&:hover:not($disabled):before": {
            backgroundColor: `${theme.palette.secondaryColor} !important`,
            height: "1px !important",
        },
        "&:before": { backgroundColor: theme.palette.secondaryColor, },
        "&:after": { backgroundColor: theme.palette.secondaryColor, },
    },
    root: { color: "rgba(212,228,188,0.4)", },
    focused: {
        "&$root": {
            color: "rgba(212,228,188,0.2)",
        },
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
            ({ classes, id, color, error, errorMessage, label, type, onChange, fullWidth, }) =>
                <FormControl
                    error={error}
                    fullWidth={fullWidth}
                    className={classes.formControl}
                >
                    <InputLabel
                        FormLabelClasses={{
                            root: classes.root,
                            focused: classes.focused,
                        }}
                    >
                        {label}
                    </InputLabel>
                    <Input
                        id={id}
                        classes={{
                            underline: classes[color],
                            input: classes[color],
                        }}
                        type={type}
                        onChange={onChange}
                        fullWidth={fullWidth}
                    />
                    <FormHelperText id="name-error-text">
                        {errorMessage}
                    </FormHelperText>
                </FormControl>
        )(this.props)

    }
)
