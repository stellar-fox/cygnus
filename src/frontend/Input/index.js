import React, { Component } from "react"
import "./index.css"

export default class Input extends Component {
    render () {
        return (
            <div className="lcars-input">
                <ul>
                    <li>
                        <label htmlFor="name">{this.props.label}</label>
                        <input
                            value={this.props.value}
                            type={this.props.inputType}
                            maxLength={this.props.maxLength}
                            autoComplete={this.props.autoComplete}
                            onKeyPress={this.props.keyPress}
                            onChange={this.props.handleChange}
                        />
                        <span>{this.props.subLabel}</span>
                    </li>
                </ul>
            </div>
        )
    }
}
