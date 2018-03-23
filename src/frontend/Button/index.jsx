import React, { Component } from "react"
import RaisedButton from "material-ui/RaisedButton"
import "./index.css"




// <Modal> component
export default class Button extends Component {

    // ...
    render = () => <RaisedButton
        label={this.props.label}
        labelColor="rgb(244,176,4)"
        style={{
            // this should match the background the button is on
            backgroundColor: this.props.background === "primary" ?
                "rgb(15,46,83)" : "rgb(244,176,4)",
        }}
        // default background color
        backgroundColor="green"
        // default text color
        labelColor="red"
        primary={this.props.primary}
        secondary={this.props.secondary}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
    />
}
