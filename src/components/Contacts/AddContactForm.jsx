import React, { Component, Fragment } from "react"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"




const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
    },
})




const ChoiceButton = withStyles(styles)(
    ({ classes, buttonText, color, disabled, }) =>
        <Button variant="outlined" disabled={disabled}
            color={color || "default"} className={classes.button}
        >
            {buttonText}
        </Button>
)




class AddContactForm extends Component {


    render = () =>
        <Fragment>
            <div className="f-b center p-t">
                <Typography nowrap="true" variant="body1" color="primary">
                    Contacts enable easy and secure way to transfer funds.
                </Typography>
            </div>
            <div className="f-b center">
                <Typography nowrap="true" variant="caption" color="primary">
                    Send funds just like email. Every contact needs to be
                    requested and approved.
                </Typography>
            </div>
            <div className="f-b center p-t">
                <ChoiceButton disabled buttonText="Email Address" />
                <ChoiceButton buttonText="Payment Address" color="primary" />
                <ChoiceButton buttonText="Account Number" color="primary" />
            </div>
        </Fragment>
}

export default AddContactForm