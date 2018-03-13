import React, { Component } from "react"
import TextField from "material-ui/TextField"

import "./index.css"




// ...
export default class TextInputField extends Component {

    // ...
    state = {
        error: null,
        value: "",
    }


    // ...
    handleChange = (event) => {
        event.persist()
        this.setState({ value: event.target.value, })
        if (this.props.validator) {
            this.props.validator.call(this, this.state.value) && (
                this.setState({ error: null, })
            )
        }
        if (this.props.onChange) {
            this.props.onChange.call(this, event.target.value)
        }
    }


    // ...
    handleOnKeyPress = (event) => {
        if (event.key === "Enter"  &&  this.props.validator) {
            let inputError = this.props.validator.call(this, this.state.value)

            if (inputError) {
                this.setState({ error: inputError, })
            } else {
                if (this.props.action) {
                    this.props.action.call(this)
                }
            }
        }
    }


    // ...
    render = () =>
        <TextField
            type={this.props.type || "text"}
            onChange={this.handleChange}
            floatingLabelText={this.props.floatingLabelText}
            errorText={this.state.error}
            errorStyle={this.props.styles.errorStyle}
            underlineStyle={this.props.styles.underlineStyle}
            underlineFocusStyle={this.props.styles.underlineStyle}
            floatingLabelStyle={this.props.styles.floatingLabelStyle}
            floatingLabelFocusStyle={this.props.styles.floatingLabelFocusStyle}
            inputStyle={this.props.styles.inputStyle}
            onKeyPress={this.handleOnKeyPress}
        />

}
