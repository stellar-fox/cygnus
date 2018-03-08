import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    Route,
    Redirect,
    Switch
} from "react-router-dom"
import { ConditionalRender } from "../../lib/utils"

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
                    <ConditionalRender>
                        <Route
                            display={!props.loggedIn}
                            component={Welcome}
                        />
                        <Redirect
                            display={props.loggedIn}
                            to="/bank/"
                        />
                    </ConditionalRender>
                </Route>
                <Route path="/bank/">
                    <ConditionalRender>
                        <Route
                            display={props.loggedIn}
                            component={Bank}
                        />
                        <Redirect
                            display={!props.loggedIn}
                            to="/"
                        />
                    </ConditionalRender>
                </Route>
            </Switch>
        </Fragment>
)
