import React, { Fragment } from "react"
import LinearProgress from "material-ui/LinearProgress"




// ...
export default () =>
    <Fragment>
        <div className="bigger-emphasize text-primary">
            Your data is being updated.
        </div>
        <div className="faded p-b">
            Estimated time: 5 seconds. Thank you for your patience.
        </div>
        <LinearProgress
            style={{ background: "rgb(244,176,4)", }}
            color="rgba(15,46,83,0.85)"
            mode="indeterminate"
        />
    </Fragment>
