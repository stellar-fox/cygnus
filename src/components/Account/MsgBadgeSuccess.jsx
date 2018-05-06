import React from "react"
import VerifiedUser from "@material-ui/icons/VerifiedUser"




// ...
export default () =>
    <div className="f-b p-b">
        <VerifiedUser
            className="svg-icon svg-margin svg-success svg-tiny"
        />
        <span className="small">
            User data integrity signature verified.
        </span>
    </div>
