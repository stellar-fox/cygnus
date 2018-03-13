import React, { Component } from "react"

import "pretty-checkbox/dist/pretty-checkbox.min.css"
import "./index.css"




// ...
export default class Checkbox extends Component {

    // ...
    state = { checked: false, }


    // ...
    render = () =>
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

}
