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
                style={{ marginTop: "1rem" }}
                align="center"
                variant="caption"
                color="secondary"
            >
                Don't have an account yet? <span>
                    <b><Link to="/signup">Sign up!</Link></b>
                </span>
            </Typography>
        </div>
    </Panel>
})

