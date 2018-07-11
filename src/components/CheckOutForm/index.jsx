import React, { Component, Fragment } from "react"
import { withStyles } from "@material-ui/core/styles"
import Button from "../../lib/mui-v1/Button"
import "./index.css"

import { CardElement, injectStripe } from "react-stripe-elements"
import InputField from "../../lib/mui-v1/InputField"
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core"




// ...
const styles = (theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: "150px",
        maxWidth: "150px",
        paddingBottom: theme.spacing.unit * 2,
    },

    input: {
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        "&:focus": {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.secondary.main,
        },
    },

    inputLabel: {
        color: theme.palette.primary.main,
        "&:focus": {
            color: theme.palette.primary.main,
        },
    },

    select: {
        "&:focus": {
            textShadow: "none",
        },
    },

    selectMenu: {
        zIndex: 1001,
        backgroundColor: theme.palette.secondary.light,
    },
})




// ...
const SelectView = withStyles(styles)(
    ({ classes, value, onChange, }) =>
        <FormControl className={classes.formControl}>
            <InputLabel classes={{ root: classes.inputLabel, shrink: classes.inputLabel, }}
                htmlFor="select-view"
            >Select Currency</InputLabel>
            <Select
                classes={{
                    select: classes.select,
                }}
                MenuProps={{
                    PopoverClasses: {
                        paper: classes.selectMenu,
                    },
                }}
                value={value}
                onChange={onChange}
                inputProps={{
                    name: "view",
                    id: "select-view",
                    className: classes.input,
                }}
            >
                <MenuItem value="eur">EUR</MenuItem>
                <MenuItem value="usd">USD</MenuItem>
                <MenuItem value="aud">AUD</MenuItem>
            </Select>
        </FormControl>
)



// ...
class CheckoutForm extends Component {

    // ...
    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
        this.state = {
            amount: "0",
            error: false,
            errorMessage: "",
            selectedCurrency: "eur",
        }
    }


    // ...
    async submit (_ev) {
        let { token, } = await this.props.stripe.createToken({ name: "Name", })
        // eslint-disable-next-line no-console
        console.log(`Charging: ${this.state.amount} of ${this.state.selectedCurrency} with token ${token}`)
    }


    // ...
    changeCurrency = (event) => this.setState({
        selectedCurrency: event.target.value,
    })


    // ...
    updateInputValue = (event) => this.setState({
        amount: event.target.value,
    })


    // ...
    render = () =>
        <Fragment>
            <div className="f-b-c">
                <InputField
                    id="payment-amount"
                    type="text"
                    label="Amount"
                    color="primary"
                    error={this.state.error}
                    errorMessage={this.state.errorMessage}
                    onChange={this.updateInputValue}
                />
                <SelectView value={this.state.selectedCurrency}
                    onChange={this.changeCurrency}
                />
            </div>
            <div className="f-b-c">
                <div className="stripe-checkout">
                    <CardElement />
                </div>
                <div>
                    <Button color="primary" onClick={this.submit}>
                        Charge
                    </Button>
                </div>
            </div>
        </Fragment>

}




// ...
export default injectStripe(CheckoutForm)
