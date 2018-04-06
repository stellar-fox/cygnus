import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import Button from "../../lib/common/Button"
import Modal from "../../lib/common/Modal"

import {
    changeModalState,
} from "../../redux/actions"




// ...
const NotImplementedModal = ({open, onDismiss,}) =>
    <Modal
        open={open}
        title="Not Yet Implemented" actions={[
            <Button
                primary={true}
                label="Dismiss"
                keyboardFocused={true}
                onClick={onDismiss}
            />,
        ]}>
            We are hard at work to bring you this feature very
            soon. Please check back in a while as our code
            is being frequently deployed.
    </Modal>





// <AlertModal> component
export default connect(
    // map state to props.
    (state) => ({
        appUi: state.appUi,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeModalState,
    }, dispatch)
)(
    class extends Component {
        // ...
        static propTypes = {
            open: PropTypes.bool.isRequired,
            modalName: PropTypes.string.isRequired,
        }

        // ...
        onDismiss = ({ modalName, }) => this.props.changeModalState({
            [modalName]: { showing: false, },
        })

        // ...
        render = () => (
            ({ open, }) =>
                <Fragment>
                    {this.props.modalName === "notImplemented" ?
                        <NotImplementedModal
                            open={open}
                            onDismiss={
                                this.onDismiss.bind(this, "notImplemented")
                            }
                        /> : null}
                </Fragment>
        )(this.props)
    }
)
