import Login from "../../components/Login"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    logIn,
    setAccountRegistered,
    setPublicKey
} from "../../actions/index"


const mapStateToProps = state => ({
    auth: state.auth,
})


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ logIn, setAccountRegistered, setPublicKey, }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)