import React, { Component } from "react"

import "pretty-checkbox/dist/pretty-checkbox.min.css"
import "./Checkbox.css"


export default class Checkbox extends Component {
    constructor (props) {
        super(props)
        this.state = { checked: false, }
    }

    render () {
        return (
            <div className="pretty p-default p-curve">
                <input
                    checked={this.props.isChecked}
                    type="checkbox"
                    onChange={this.props.handleChange}
                />
                <div className="state">
                    <label>{this.props.label}</label>
                </div>
            </div>
        )
    }
}
