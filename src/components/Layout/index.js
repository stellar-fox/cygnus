import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
    withRouter,
} from "react-router-dom"

import {
    ConnectedSwitch as Switch,
    resolvePath,
} from "../StellarRouter"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "./Bank"
import { ActionConstants } from "../../actions"




// <Layout> component
export default withRouter(connect(
    (state) => ({
        loggedIn: state.appAuth.loginState === ActionConstants.LOGGED_IN,
    })
)(
    class Layout extends Component {

        // ...
        static propTypes = {
            loggedIn: PropTypes.bool.isRequired,
            match: PropTypes.object.isRequired,
        }


        // relative resolve
        rr = resolvePath(this.props.match.path)


        // local paths
        paths = {
            Welcome: this.rr("."),
            Bank: this.rr("bank/"),
        }


        // ...
        render = () =>
            <Fragment>
                <LoadingModal />
                <Switch>
                    <Route exact path={this.paths.Welcome}>
                        {
                            !this.props.loggedIn ?
                                <Welcome /> :
                                <Redirect to={this.paths.Bank} />
                        }
                    </Route>
                    <Route path={this.paths.Bank}>
                        {
                            this.props.loggedIn ?
                                <Bank /> :
                                <Redirect to={this.paths.Welcome} />
                        }
                    </Route>
                    <Redirect to={this.paths.Welcome} />
                </Switch>
            </Fragment>

    }
))
