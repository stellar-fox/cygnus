import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"

import { ConnectedSwitch as Switch } from "../StellarRouter"

import { ActionConstants } from "../../redux/actions"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "../Bank"




// <Layout> component
export default connect(
    (state) => ({
        loggedIn: state.appAuth.loginState === ActionConstants.LOGGED_IN,
        paths: state.Router.paths,
    })
)(
    class Layout extends Component {

        // ...
        static propTypes = {
            loggedIn: PropTypes.bool.isRequired,
            paths: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ loggedIn, paths, }) =>
                <Fragment>
                    <LoadingModal />
                    <Switch>
                        <Route exact path={paths.Welcome}>
                            {
                                !loggedIn ?
                                    <Welcome /> :
                                    <Redirect to={paths.Bank} />
                            }
                        </Route>
                        <Route path={paths.Bank}>
                            {
                                loggedIn ?
                                    <Bank /> :
                                    <Redirect to={paths.Welcome} />
                            }
                        </Route>
                        <Redirect to={paths.Welcome} />
                    </Switch>
                </Fragment>
        )(this.props)

    }
)
