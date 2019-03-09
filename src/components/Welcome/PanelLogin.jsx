import React from "react"
import Login from "../Login"
import Panel from "../../lib/mui-v1/Panel"
import { Typography } from "@material-ui/core"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link } from "react-router-dom"




const LoginComponent = () => {

    return <Panel title="Sign in with your email.">
        <div style={{ minHeight: "310px" }}>
            <div className="m-t-small panel-title">
                Provide your credentials below.
            </div>
            <Login />
            <Typography style={{ marginTop: "1rem" }} align="center" variant="caption" color="secondary">
                Don't have an account yet? <span>
                    <b><Link to="/signup">Sign up!</Link></b>
                </span>
            </Typography>
        </div>
    </Panel>
}




export default connect (
    // map state to props.
    (_state) => ({}),
    // map dispatch to props.
    (dispatch) => bindActionCreators({}, dispatch)
)(LoginComponent)
