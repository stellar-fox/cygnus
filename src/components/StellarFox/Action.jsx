import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import ActionResetPassword from "./ActionResetPassword"
import ActionVerifyEmail from "./ActionVerifyEmail"
import queryString from "query-string"
import { action as AuthActions } from "../../redux/Auth"




// <Actions> component
export default compose(
    withStyles((_theme) => ({

    })),
    connect(
        (_state) => ({
        }),
        (dispatch) => bindActionCreators({
            processPasswordResetLink: AuthActions.processPasswordResetLink,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // Parsed query-string from URI.
        qs = queryString.parse(
            this.props.location.search,
            { ignoreQueryPrefix: true }
        )


        // ...
        render = () =>
            <Fragment>
                {this.qs.mode === "resetPassword" &&
                    <ActionResetPassword oobCode={this.qs.oobCode} />
                }
                {this.qs.mode === "verifyEmail" &&
                    <ActionVerifyEmail oobCode={this.qs.oobCode} />
                }
            </Fragment>
    }
)
