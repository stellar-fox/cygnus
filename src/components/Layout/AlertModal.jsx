import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Button from "../../lib/common/Button"
import Modal from "../../lib/common/Modal"
import { action as AlertAction } from "../../redux/Alert"



// <AlertWithDismiss> component
const AlertWithDismiss =
    ({ open, onDismiss, title, content, }) =>
        <Modal
            open={open}
            title={title}
            actions={[
                <Button
                    primary={true}
                    label="Dismiss"
                    keyboardFocused={true}
                    onClick={onDismiss}
                />,
            ]}
        >
            <div className="p-t">{ content }</div>
        </Modal>




// <AlertModal> component
export default connect(
    // map state to props.
    (state) => ({ Alert: state.Alert, }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        showAlert: AlertAction.showAlert,
        hideAlert: AlertAction.hideAlert,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            Alert: PropTypes.object.isRequired,
            showAlert: PropTypes.func.isRequired,
            hideAlert: PropTypes.func.isRequired,
        }


        // ...
        onDismiss = () => this.props.hideAlert()


        // ...
        render = () =>
            <AlertWithDismiss
                open={this.props.Alert.visible}
                onDismiss={this.onDismiss}
                title={this.props.Alert.title}
                content={this.props.Alert.text}
            />
    }
)
