import React from "react"
import Login from "../Login"
import Panel from "../../lib/mui-v1/Panel"
import { Typography } from "@material-ui/core"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { action as ModalAction } from "../../redux/Modal"




const LoginComponent = ({ showModal }) => {
    
    const signUp = () => showModal("signup")

    return <Panel title="Login with email/password">
        <div className="panel-title">
            Sign-in by authenticating with your credentials.
        </div>
        <Typography align="center" variant="caption" color="secondary">
            Don't have an account yet? <span style={{ cursor: "pointer" }} onClick={signUp}><b>Sign up!</b></span>
        </Typography>
        <Login />
    </Panel>
}




export default connect (
    // map state to props.
    (state) => ({
        Modal: state.Modal,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        showModal: ModalAction.showModal,
    }, dispatch)
)(LoginComponent)
