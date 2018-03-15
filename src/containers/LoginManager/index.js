import LoginManager from "../../components/LoginManager"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    selectView,
    changeLoginState,
    setPublicKey,
} from "../../actions/index"

export default connect(
    // map state to props.
    (state) => ({
        appAuth: state.appAuth,
        broadcasts: state.broadcasts,
    }),
    // map dispatch to props.
    (dispatch) => {
        return bindActionCreators({
            selectView,
            changeLoginState,
            setPublicKey,
        }, dispatch)
    }
)(LoginManager)