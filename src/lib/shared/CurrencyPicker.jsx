import React, { Component } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {action as BalancesAction } from "../../redux/Balances"
import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    FormLabel,
} from "@material-ui/core/Radio"




// ...
const styles = (theme) => ({
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
    root: {
        color: theme.palette.primary.main,
        "&$checked": {
            color: theme.palette.primary.light,
        },
        margin: 0,
        height: 25,
    },
    checked: {},

    formControlLabel: {
        color: theme.palette.primary.main,
        fontSize: "0.8rem",
        margin: 0,
    },

    formLabel: {
        color: theme.palette.primary.main,
        fontSize: "1rem",
    },

    formLabelFocused: {
        color: `${theme.palette.primary.main} !important`,
        fontSize: "1rem",
    },
})




// ...
class CurrencyPicker extends Component {

    state = {
        currency: null,
    }


    // ...
    componentDidMount = () => {
        this.setState({
            currency: this.props.defaultCurrency,
        })
    }


    // ...
    handleChange = (event) => {
        this.setState({ currency: event.target.value })
        this.props.onChange(event.target.value)
    }


    // ...
    render = () => (
        ({ classes }) =>
            <FormControl margin="normal" component="fieldset">
                <FormLabel
                    classes={{
                        root: classes.formLabel,
                        focused: classes.formLabelFocused,
                    }}
                    component="legend"
                >
                    Select Default Currency:
                </FormLabel>
                <RadioGroup
                    aria-label="currency-picker"
                    name="currency-picker"
                    className={classes.group}
                    value={this.state.currency}
                    onChange={this.handleChange}
                >
                    <FormControlLabel value="eur"
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Radio
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        } label="Euro [EUR]"
                    />
                    <FormControlLabel value="usd"
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Radio
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        } label="U.S. Dollar [USD]"
                    />
                    <FormControlLabel value="aud"
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Radio
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        } label="Australian Dollar [AUD]"
                    />
                    <FormControlLabel value="nzd"
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Radio
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        } label="New Zealand Dollar [NZD]"
                    />
                    <FormControlLabel value="pln"
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Radio
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        } label="Polish Złoty [PLN]"
                    />
                    <FormControlLabel value="thb"
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Radio
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        } label="Thai Baht [THB]"
                    />
                </RadioGroup>
            </FormControl>
    )(this.props)
}




// ...
CurrencyPicker.propTypes = {
    classes: PropTypes.object.isRequired,
    defaultCurrency: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}




// ...
export default compose(
    withStyles(styles),
    connect(
        (_state, theme) => ({
            theme,
        }),
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
        }, dispatch)
    )
)(CurrencyPicker)
