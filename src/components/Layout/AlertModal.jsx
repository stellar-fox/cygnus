import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { changeModalState } from "../../redux/actions"

import Button from "../../lib/common/Button"
import Modal from "../../lib/common/Modal"




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
            ]}>
            { content }
        </Modal>




// <AlertModal> component
export default connect(
    // map state to props.
    (state) => ({ appUi: state.appUi, }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeModalState,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            appUi: PropTypes.object.isRequired,
            changeModalState: PropTypes.func.isRequired,
        }


        // ...
        onDismiss = () => this.props.changeModalState({
            alertWithDismiss: { showing: false, content: "", },
        })


        // ...
        render = () => (
            ({ modals, }) =>
                <AlertWithDismiss
                    open={modals.alertWithDismiss ?
                        modals.alertWithDismiss.showing : false}
                    onDismiss={this.onDismiss}
                    title={modals.alertWithDismiss ?
                        modals.alertWithDismiss.title : false}
                    content={modals.alertWithDismiss ?
                        modals.alertWithDismiss.content : false}
                />
        )(this.props.appUi)
    }
)
