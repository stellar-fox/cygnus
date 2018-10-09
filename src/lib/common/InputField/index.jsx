import React, { Component } from "react"
import PropTypes from "prop-types"
import { string } from "@xcmats/js-toolbox"
import {
    rgb,
    rgba,
} from "../../utils"

import TextField from "material-ui/TextField"

import "./index.css"




// ...
const InputFieldStyles = {
    errorStyle: {
        color: "#E64A19",
    },
    underlineStyle: {
        borderColor: "#FFC107",
    },
    floatingLabelStyle: {
        color: rgba(212,228,188,0.4),
    },
    floatingLabelFocusStyle: {
        color: rgba(212,228,188,0.2),
    },
    inputStyle: {
        color: rgb(244,176,4),
    },
}




// <InputField> component
export default class InputField extends Component {

    // ...
    static propTypes = {
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        placeholder: PropTypes.string,
    }


    // ...
    state = {
        error: null,
        value: string.empty(),
    }


    // ...
    handleChange = (event) => {
        this.setState({ value: event.target.value, }, () => {
            if (this.props.validator) {
                this.props.validator.call(this)
            }
        })
    }


    // ...
    handleOnKeyPress = (event) => {
        if (event.key === "Enter" && this.props.onEnterPress) {
            this.props.onEnterPress.call(this)
        }
    }


    // ...
    render = () =>
        <TextField
            style={this.props.style}

            name={this.props.name}

            type={this.props.type || "text"}

            onChange={this.handleChange}

            onKeyPress={this.handleOnKeyPress}

            floatingLabelText={this.props.placeholder}

            errorText={this.state.error}

            errorStyle={
                this.props.errorStyle ||
                InputFieldStyles.errorStyle
            }

            underlineStyle={
                this.props.underlineStyle ||
                InputFieldStyles.underlineStyle
            }

            underlineFocusStyle={
                this.props.underlineFocusStyle ||
                InputFieldStyles.underlineStyle
            }

            floatingLabelStyle={
                this.props.floatingLabelStyle ||
                InputFieldStyles.floatingLabelStyle
            }

            floatingLabelFocusStyle={
                this.props.floatingLabelFocusStyle ||
                InputFieldStyles.floatingLabelFocusStyle
            }

            inputStyle={
                this.props.inputStyle ||
                InputFieldStyles.inputStyle
            }

            maxLength={
                this.props.maxLength
            }
        />

}
