import Heading from "./heading"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    changeLoginState,
    changeModalState,
} from "../../actions/index"


const mapStateToProps = state => ({
    appUi: state.appUi,
})


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        changeLoginState,
        changeModalState,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Heading)