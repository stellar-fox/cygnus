import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { action as SnackbarAction } from "../../redux/Snackbar"
import Snackbar from "../../lib/common/Snackbar"




// <ConnectedSnackbar> component
export default connect(
    // map state to props.
    (state) => ({
        visible: state.Snackbar.visible,
        message: state.Snackbar.message,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        resetSnackbar: SnackbarAction.reset,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            resetSnackbar: PropTypes.func.isRequired,
        }


        // ...
        onDismiss = () => this.props.resetSnackbar()


        // ...
        render = () => 
            <Snackbar
                open={this.props.visible}
                onRequestClose={this.onDismiss}
                message={this.props.message}
            />
    }
)
