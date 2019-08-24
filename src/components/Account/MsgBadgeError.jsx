import React from "react"
import Cancel from "@material-ui/icons/Cancel"
import { Typography } from "@material-ui/core"



// ...
export default () =>
    <div className="flex-box-row items-centered p-b">
        <Cancel className="svg-margin svg-error svg-tiny" />
        <Typography variant="body1" color="secondary">
            Data integrity signature changed. Please update your data.
        </Typography>
    </div>
