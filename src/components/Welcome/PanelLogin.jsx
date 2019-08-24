import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Panel from "../../lib/mui-v1/Panel"
import { Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import CredentialsForm from "../CredentialsForm"
import { clearInputErrorMessages } from "../../thunks/users"



export default connect(
    (_state) => ({
    }),
    (dispatch) => bindActionCreators({
        clearInputErrorMessages,
    }, dispatch),
)((props) => {

    props.clearInputErrorMessages()

    return <Panel title="Sign in with your email.">
        <div style={{ minHeight: "310px" }}>
            <div className="m-t-small panel-title">
                Provide your credentials below.
            </div>
            <CredentialsForm account="" accountId="" />
            <Typography
                align="center"
                variant="caption"
                color="secondary"
                display="block"
            >
                <Link to="/reset">Forgot password?</Link>
            </Typography>
            <Typography
                align="center"
                variant="caption"
                color="secondary"
                display="block"
            >
                Don't have an account yet? <span>
                    <Link to="/signup">Sign up.</Link>
                </span>
            </Typography>

        </div>
    </Panel>
})

