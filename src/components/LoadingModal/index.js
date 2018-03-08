import React, { Component } from "react"
import CircularProgress from "material-ui/CircularProgress"
import { connect } from "react-redux"

import "./index.css"




// ...
class LoadingModal extends Component {
    render () {
        return (
            <div>
                {this.props.loadingModal.loading ? (
                    <div>
                        <div className="loading-modal-background" />
                        <div className="loading-modal">
                            <div className="loading-modal-header">
                                <div>&nbsp;</div>
                                <div>&nbsp;</div>
                            </div>
                            <div className="loading-modal-content">
                                <CircularProgress
                                    style={{
                                        backgroundColor: "rgb(15,46,83)",
                                    }}
                                    color="rgb(244,176,4)"
                                />
                            </div>
                            <div className="loading-modal-content">
                                {this.props.loadingModal.message}
                            </div>
                            <div className="loading-modal-content">
                                <i className="material-icons">search</i>
                                <i className="material-icons">language</i>
                                <i className="material-icons">fingerprint</i>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}

export default connect(
    // map state to props.
    (state) => ({
        loadingModal: state.loadingModal,
    })
)(LoadingModal)
