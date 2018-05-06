import React from "react"
import Cancel from "@material-ui/icons/Cancel"




// ...
export default () =>
    <div className="f-b p-b">
        <Cancel
            className="svg-icon svg-margin svg-error svg-tiny"
        />
        <span className="small">
            User data integrity signature not valid. Do not use this address!
        </span>
    </div>
