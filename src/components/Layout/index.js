import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    Route,
    Redirect,
    Switch,
} from "react-router-dom"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "./Bank"




// ...
export default connect(
    // map state to props.
    (state) => ({
        loggedIn: state.auth.isHorizonLoggedIn,
    })
)(
    // Layout component
    (props) =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path="/">
                    {
                        !props.loggedIn ?
                            <Route component={Welcome} /> :
                            <Redirect to="/bank/" />
                    }
                </Route>
                <Route path="/bank/">
                    {
                        props.loggedIn ?
                            <Route component={Bank} /> :
                            <Redirect to="/" />
                    }
                </Route>
                <Redirect to="/" />
            </Switch>
        </Fragment>
)
