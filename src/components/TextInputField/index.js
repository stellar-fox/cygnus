import React, { Component } from "react"
import TextField from "material-ui/TextField"

import "./index.css"


export default class TextInputField extends Component {

    // ...
    constructor (props) {
        super(props)
        this.state = {
            error: null,
            value: "",
        }
    }


    // ...
    handleChange (event) {
        this.setState({ value: event.target.value, })
    }


    // ...
    handleOnKeyPress (event) {
        if (event.key === "Enter" && this.props.onEnterPress !== undefined) {
            this.props.onEnterPress.call(this)
        }
    }


    // ...
    render () {
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
        return (
            <TextField
                type={this.props.type || "text"}
                onChange={this.handleChange.bind(this)}
                onKeyPress={this.handleOnKeyPress.bind(this)}
                floatingLabelText={this.props.floatingLabelText}
                errorText={this.state.error}
                errorStyle={styles.errorStyle}
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineStyle}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                inputStyle={styles.inputStyle}
            />
        )
    }
}
