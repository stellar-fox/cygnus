import React from "react"
import { connect } from "react-redux"
import { CircularProgress } from "@material-ui/core"
import "./index.css"




// ...
export default connect(
    // map state to props.
    (state) => ({
        visible: state.StellarAccount.loading,
        text: state.LoadingModal.text,
    })
)(
    // <LoadingModal> component
    ({ visible }) => visible && <div>
        <div className="loading-modal-background" />
        <div className="loading-modal">
            <div className="loading-modal-header">
                <div>&nbsp;</div>
                <div>&nbsp;</div>
            </div>
            <div className="loading-modal-content">
                <CircularProgress color="secondary" />
            </div>
            <div className="loading-modal-content">
                Loading Account Data
            </div>
            <div className="loading-modal-content">
                <i className="material-icons">search</i>
                <i className="material-icons">language</i>
                <i className="material-icons">fingerprint</i>
            </div>
        </div>
    </div>
)
