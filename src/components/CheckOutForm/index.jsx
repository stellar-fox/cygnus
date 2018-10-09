import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import BigNumber from "bignumber.js"
import { connect } from "react-redux"
import { CardElement, injectStripe } from "react-stripe-elements"
import { string } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import Button from "../../lib/mui-v1/Button"
import { action as SnackbarAction } from "../../redux/Snackbar"
import InputField from "../../lib/mui-v1/InputField"
import {
    CircularProgress, FormControl, InputLabel, MenuItem, Select,
} from "@material-ui/core"
import { htmlEntities as he, pubKeyAbbr } from "../../lib/utils"
import { fundAccount } from "./api"
import "./index.css"




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

    icon: {
        color: theme.palette.primary.fade,
    },
})




// ...
const SelectView = withStyles(styles)(
    ({ classes, value, onChange, }) =>
        <FormControl className={classes.formControl}>
            <InputLabel classes={{
                root: classes.inputLabel, shrink: classes.inputLabel,
            }} htmlFor="select-view"
            >Select Currency</InputLabel>
            <Select
                classes={{
                    select: classes.select,
                    icon: classes.icon,
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
                <MenuItem value="nzd">NZD</MenuItem>
                <MenuItem value="pln">PLN</MenuItem>
                <MenuItem value="thb">THB</MenuItem>
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
            errorMessage: string.empty(),
            selectedCurrency: "eur",
            inProgress: false,
        }
    }


    // ...
    async submit (_ev) {
        this.setState({
            error: false,
            errorMessage: string.empty(),
            inProgress: true,
        })
        try {
            let { token, } = await this.props.stripe.createToken({ name: "Name", })

            const charge = {
                token: token.id,
                amount: (new BigNumber(this.state.amount).times(100).toString()),
                currency: this.state.selectedCurrency,
                publicKeyAbbr: pubKeyAbbr(this.props.publicKey),
                publicKey: this.props.publicKey,
            }

            fundAccount(this.props.userId, this.props.token, charge)
                .then((response) => {
                    if (response.data && response.data.status === "succeeded") {
                        this._element.clear()
                        this.setState({
                            selectedCurrency: "eur",
                        })
                        this.props.popupSnackbar(
                            "Account fund payment successful."
                        )
                    } else {
                        this.props.popupSnackbar(response.data.status)
                    }
                })
                .catch((error) => {
                    this.setState({
                        error: true,
                        errorMessage: error.response.data.error,
                    })
                })
                .finally(() => {
                    this.setState({
                        inProgress: false,
                    })
                })
        } catch (error) {
            this.setState({
                inProgress: false,
            })
        }

    }


    // ...
    changeCurrency = (event) => this.setState({
        selectedCurrency: event.target.value,
    })


    // ...
    updateInputValue = (event) => {
        if (!/^(\d+)([.](\d{1,2}))?$/.test(event.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Invalid amount entered.",
            })
        } else {
            this.setState({
                error: false,
                errorMessage: string.empty(),
                amount: event.target.value,
            })
        }
    }


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
                <he.Nbsp /><he.Nbsp /><he.Nbsp /><he.Nbsp />
                <SelectView value={this.state.selectedCurrency}
                    onChange={this.changeCurrency}
                />
            </div>
            <div className="f-b-c">
                <div className="stripe-checkout">
                    <CardElement onReady={(c) => this._element = c} />
                </div>
                <div>
                    <Button
                        color="primary"
                        onClick={this.submit}
                        disabled={this.state.inProgress}
                    >
                        {this.state.inProgress ? <CircularProgress
                            color="primary" thickness={4} size={20}
                        /> : "Charge"}
                    </Button>
                </div>
            </div>
        </Fragment>

}




// ...
export default injectStripe(connect(
    (state) => ({
        userId: state.LoginManager.userId,
        token: state.LoginManager.token,
        publicKey: state.LedgerHQ.publicKey,
    }),
    (dispatch) => bindActionCreators({
        popupSnackbar: SnackbarAction.popupSnackbar,
    }, dispatch)
)(CheckoutForm))
