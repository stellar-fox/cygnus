import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Button from "../../lib/mui-v1/Button"
import Modal from "../../lib/common/Modal"

import { action as AlertChoiceAction } from "../../redux/AlertChoice"




// <AlertWithChoice> component
const AlertWithChoice =
    ({ open, onYes, onNo, title, content, children, labelYes, labelNo, }) =>
        <Modal
            open={open}
            title={title}
            actions={[
                <Button
                    color="primary"
                    onClick={onYes}
                >{labelYes || "Yes"}</Button>,
                <Button
                    color="primary"
                    onClick={onNo}
                >{labelNo || "Cancel"}</Button>,
            ]}
        >
            <div className="p-t">
                {children || content}
            </div>
        </Modal>




// <AlertChoiceModal> component
export default connect(
    // map state to props.
    (state) => ({ AlertChoice: state.AlertChoice, }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        showAlert: AlertChoiceAction.showAlert,
        hideAlert: AlertChoiceAction.hideAlert,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            showAlert: PropTypes.func.isRequired,
            hideAlert: PropTypes.func.isRequired,
        }


        // ...
        render = () =>
            <AlertWithChoice
                open={this.props.AlertChoice.visible}
                onYes={this.props.onYes}
                onNo={this.props.onNo || this.props.hideAlert}
                title={this.props.AlertChoice.title}
                content={this.props.AlertChoice.text}
                labelYes={this.props.labelYes}
                labelNo={this.props.labelNo}
                children={this.props.children}
            />
    }
)
