import React from "react"
import { connect } from "react-redux"
import {
    CircularProgress,
    Typography,
} from "@material-ui/core"
import "./index.css"




// ...
export default connect(
    // map state to props.
    (_state) => ({
        visible: true,
    })
)(
    // <LoadingModal> component
    ({ visible }) => visible && <div>
        <div className="loading-modal-background" />
        <div className="loading-modal">
            <div className="m-t-large flex-box-col items-centered content-centered">
                <CircularProgress color="secondary" />
                <Typography
                    style={{ marginTop: "15px" }}
                    variant="body2"
                    color="secondary"
                >
                    Loading
                </Typography>
            </div>
        </div>
    </div>
)
