import React from "react"
import CircularProgress from "material-ui/CircularProgress"
import { connect } from "react-redux"

import "./index.css"




// ...
export default connect(
    // map state to props.
    (state) => ({
        loading: state.loadingModal.loading,
        message: state.loadingModal.message,
    })
)(
    // <LoadingModal> component
    ({
        loading,
        message,
    }) =>
        loading ?
            <div>
                <div className="loading-modal-background" />
                <div className="loading-modal">
                    <div className="loading-modal-header">
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                    </div>
                    <div className="loading-modal-content">
                        <CircularProgress
                            style={{ backgroundColor: "rgb(15,46,83)", }}
                            color="rgb(244,176,4)"
                        />
                    </div>
                    <div className="loading-modal-content">
                        {message}
                    </div>
                    <div className="loading-modal-content">
                        <i className="material-icons">search</i>
                        <i className="material-icons">language</i>
                        <i className="material-icons">fingerprint</i>
                    </div>
                </div>
            </div> :
            null
)
