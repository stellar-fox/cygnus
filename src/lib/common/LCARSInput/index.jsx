import React from "react"

import "./index.css"




// <LCARSInput> component
export default (props) =>
    <div style={props.style} className={props.className}>
        <ul>
            <li>
                <label htmlFor="name">{props.label}</label>
                <input
                    autoFocus={props.autoFocus || false}
                    value={props.value}
                    type={props.inputType}
                    maxLength={props.maxLength}
                    autoComplete={props.autoComplete}
                    onKeyPress={props.keyPress}
                    onChange={props.handleChange}
                    disabled={props.disabled}
                />
                <span>{props.subLabel}</span>
            </li>
        </ul>
    </div>
