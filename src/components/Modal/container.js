import Modal from "./Modal"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    changeModalState,
} from "../../actions/index"


const mapStateToProps = state => ({
    appUi: state.appUi,
})


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ changeModalState, }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Modal)