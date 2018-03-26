import React, { Component } from "react"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"

import "./index.css"




// <Button> component
export default class Button extends Component {

    // ...
    getBackgroundColor = () => {
        if (this.props.disabled && this.props.primary) {
            return "rgb(244,176,4)"
        }
        if (this.props.disabled && this.props.secondary) {
            return "rgb(15,46,83)"
        }
        if (this.props.primary) {
            return "rgb(244,176,4)"
        }
        if (this.props.secondary) {
            return "rgb(15,46,83)"
        }

        // default background color
        return "rgb(251,192,45)"
    }


    // ...
    renderRaisedButton = () =>
        <RaisedButton
            label={this.props.label}
            labelColor={this.props.labelColor}
            style={{
                backgroundColor: this.getBackgroundColor(),
                borderRadius: "3px",

            }}
            buttonStyle={{
                borderRadius: "3px",
            }}
            backgroundColor={this.props.backgroundColor}
            primary={this.props.primary}
            secondary={this.props.secondary}
            onClick={this.props.onClick}
            disabled={this.props.disabled}
            fullWidth={this.props.fullWidth}
            className="button-raised"
        />


    // ...
    renderFlatButton = () =>
        <FlatButton
            label={this.props.label}
            backgroundColor={this.getBackgroundColor()}
            primary={this.props.primary}
            secondary={this.props.secondary}
            onClick={this.props.onClick}
            disabled={this.props.disabled}
            style={{
                borderRadius: "3px",
            }}
            fullWidth={this.props.fullWidth}
            className="button-raised"
        />


    // ...
    render = () =>
        this.props.flat ?
            this.renderFlatButton() :
            this.renderRaisedButton()

}
