import React, { Component } from "react"
import TextField from "material-ui/TextField"

import "./index.css"




// ...
const styles = {
    errorStyle: {
        color: "#E64A19",
    },
    underlineStyle: {
        borderColor: "#FFC107",
    },
    floatingLabelStyle: {
        color: "rgba(212,228,188,0.4)",
    },
    floatingLabelFocusStyle: {
        color: "rgba(212,228,188,0.2)",
    },
    inputStyle: {
        color: "rgb(244,176,4)",
    },
}




// ...
export default class TextInputField extends Component {

    // ...
    state = {
        error: null,
        value: "",
    }


    // ...
    handleChange = (event) => {
        this.setState({ value: event.target.value, })
        if (this.props.validator) {
            this.props.validator.call(this)
        }
    }


    // ...
    handleOnKeyPress = (event) => {
        if (event.key === "Enter"  &&  this.props.onEnterPress) {
            this.props.onEnterPress.call(this)
        }
    }


    // ...
    render = () =>
        <TextField
            type={this.props.type || "text"}
            onChange={this.handleChange}
            onKeyPress={this.handleOnKeyPress}
            floatingLabelText={this.props.floatingLabelText}
            errorText={this.state.error}
            errorStyle={this.props.errorStyle || styles.errorStyle}
            underlineStyle={this.props.underlineStyle || styles.underlineStyle}
            underlineFocusStyle={this.props.underlineFocusStyle || styles.underlineStyle}
            floatingLabelStyle={this.props.floatingLabelStyle || styles.floatingLabelStyle}
            floatingLabelFocusStyle={this.props.floatingLabelFocusStyle || styles.floatingLabelFocusStyle}
            inputStyle={this.props.inputStyle || styles.inputStyle}
        />

}
