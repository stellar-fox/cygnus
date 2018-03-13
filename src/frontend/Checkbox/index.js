import React from "react"

import "pretty-checkbox/dist/pretty-checkbox.min.css"
import "./index.css"




// <Checkbox> component
export default ({
    isChecked,
    handleChange,
    label,
}) =>
    <div className="pretty p-default p-curve">
        <input
            checked={isChecked}
            type="checkbox"
            onChange={handleChange}
        />
        <div className="state">
            <label>{label}</label>
        </div>
    </div>
