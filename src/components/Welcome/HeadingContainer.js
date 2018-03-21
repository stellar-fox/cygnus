import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Heading from "./heading"
import {
    changeLoginState,
    changeModalState,
} from "../../actions/index"




// ...
export default connect(
    // map state to props.
    (state) => ({
        appUi: state.appUi,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
        changeModalState,
    }, dispatch)
)(Heading)
