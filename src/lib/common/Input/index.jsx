import React from "react"

import "./index.css"




// <Input> component
export default (props) =>
    <div style={{ width: props.width, }} className="lcars-input">
        <ul>
            <li>
                <label htmlFor="name">{props.label}</label>
                <input
                    value={props.value}
                    type={props.inputType}
                    maxLength={props.maxLength}
                    autoComplete={props.autoComplete}
                    onKeyPress={props.keyPress}
                    onChange={props.handleChange}
                />
                <span>{props.subLabel}</span>
            </li>
        </ul>
    </div>
