import Login from "../../components/Login"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    changeLoginState,
} from "../../actions/index"


const mapStateToProps = state => ({
    auth: state.auth,
})


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ changeLoginState, }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)