import React from "react"
import VerifiedUser from "@material-ui/icons/VerifiedUser"
import { Typography } from "@material-ui/core"



// ...
export default () =>
    <div className="flex-box-row items-centered p-b">
        <VerifiedUser className="svg-margin svg-success svg-tiny" />
        <Typography variant="body1" color="secondary">
            Data integrity signature verified.
        </Typography>
    </div>
