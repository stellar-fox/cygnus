import React, { Component } from "react"
import "./style.css"
import TextField from "material-ui/TextField"


export default class TextInputField extends Component {
    // ...
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            value: "",
        }
    }

    // ...
    handleChange(event) {
        event.persist()
        this.setState({
            value: event.target.value
        })
        if (this.props.validator !== undefined) {
            this.props.validator.call(this, this.state.value) && (
                this.setState({
                    error: null,
                })
            )
        }
        if (this.props.onChange !== undefined) {
            this.props.onChange.call(this, event.target.value)
        }
    }

    // ...
    handleOnKeyPress(event) {
        if (event.key === "Enter" && this.props.validator !== undefined) {
            let inputError = this.props.validator.call(this, this.state.value)
            
            if (inputError) {
                this.setState({
                    error: inputError
                })
            } else {
                if (this.props.action !== undefined) {
                    this.props.action.call(this)
                }
            }            
        }
    }

    // ...
    render() {
        return (
            <div>
                <TextField
                    type={this.props.type}
                    onChange={this.handleChange.bind(this)}
                    floatingLabelText={this.props.floatingLabelText}
                    errorText={this.state.error}
                    errorStyle={this.props.styles.errorStyle}
                    underlineStyle={this.props.styles.underlineStyle}
                    underlineFocusStyle={this.props.styles.underlineStyle}
                    floatingLabelStyle={this.props.styles.floatingLabelStyle}
                    floatingLabelFocusStyle={this.props.styles.floatingLabelFocusStyle}
                    inputStyle={this.props.styles.inputStyle}
                    onKeyPress={this.handleOnKeyPress.bind(this)}
                />
            </div>
        )
    }
}