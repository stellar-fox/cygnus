import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Modal from "./Modal"
import {
    changeModalState,
} from "../../actions"




// ...
export default connect(
    // map state to props.
    (state) => ({
        appUi: state.appUi,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeModalState,
    }, dispatch)
)(Modal)
