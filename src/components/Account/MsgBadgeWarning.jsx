import React from "react"
import NotificationsActive from "@material-ui/icons/NotificationsActive"
import { Typography } from "@material-ui/core"



// ...
export default () =>
    <div className="flex-box-row items-centered p-b">
        <NotificationsActive className="svg-margin svg-warning svg-tiny" />
        <Typography variant="body1" color="secondary">
            Data integrity signature missing.
        </Typography>
    </div>
