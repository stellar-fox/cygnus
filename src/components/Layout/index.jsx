import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"

import {
    ConnectedSwitch as Switch,
    resolvePath,
    withStellarRouter,
} from "../StellarRouter"

import { ActionConstants } from "../../redux/actions"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "../Bank"




// <Layout> component
export default withStellarRouter(connect(
    (state) => ({
        loggedIn: state.appAuth.loginState === ActionConstants.LOGGED_IN,
    })
)(
    class Layout extends Component {

        // ...
        static propTypes = {
            loggedIn: PropTypes.bool.isRequired,
            match: PropTypes.object.isRequired,
            stellarRouter: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.stellarRouter.addStaticPaths({
                "Welcome": this.rr("."),
                "Bank": this.rr("bank/"),
            })
        }


        // ...
        render = () => (
            ({ loggedIn, }, getStaticPath) =>
                <Fragment>
                    <LoadingModal />
                    <Switch>
                        <Route exact path={getStaticPath("Welcome")}>
                            {
                                !loggedIn ?
                                    <Welcome /> :
                                    <Redirect to={getStaticPath("Bank")} />
                            }
                        </Route>
                        <Route path={getStaticPath("Bank")}>
                            {
                                loggedIn ?
                                    <Bank /> :
                                    <Redirect to={getStaticPath("Welcome")} />
                            }
                        </Route>
                        <Redirect to={getStaticPath("Welcome")} />
                    </Switch>
                </Fragment>
        )(this.props, this.props.stellarRouter.getStaticPath)

    }
))
