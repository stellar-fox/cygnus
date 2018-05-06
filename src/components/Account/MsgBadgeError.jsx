import React from "react"
import Cancel from "@material-ui/icons/Cancel"




// ...
export default () =>
    <div className="f-b p-b">
        <Cancel
            className="svg-margin svg-error svg-tiny"
        />
        <span className="small">
            Data integrity signature not valid. Do not trust!
        </span>
    </div>
