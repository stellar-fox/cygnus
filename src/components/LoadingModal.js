import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {connect} from 'react-redux'
import './LoadingModal.css'

class LoadingModal extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          {this.props.loadingModal.loading ? (
            <div>
              <div className="loading-modal-background"></div>
              <div className="loading-modal">
                <div className="loading-modal-header">
                  <div>...</div>
                  <div>...</div>
                </div>
                <div className="loading-modal-content">
                  <CircularProgress style={{
                    backgroundColor: "rgb(15,46,83)"
                  }} color="rgb(244,176,4)" />
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
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    loadingModal: state.loadingModal,
    ui: state.ui,
  }
}

export default connect(mapStateToProps)(LoadingModal)
