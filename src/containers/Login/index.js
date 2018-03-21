import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Login from "../../components/Login"
import {
    changeLoginState,
} from "../../actions/index"




// ...
export default connect(
    // map state to props.
    (state) => ({
        auth: state.auth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
    }, dispatch)
)(Login)
