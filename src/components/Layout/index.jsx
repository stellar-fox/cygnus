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

import { ActionConstants } from "../../redux/actions"
import { action as RouterAction } from "../../redux/StellarRouter"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "../Bank"




// <Layout> component
export default withRouter(connect(
    (state) => ({
        loggedIn: state.appAuth.loginState === ActionConstants.LOGGED_IN,
        paths: state.Router.paths,
    }),
    (dispatch) => ({ addPaths: (ps) => dispatch(RouterAction.addPaths(ps)), })
)(
    class Layout extends Component {

        // ...
        static propTypes = {
            loggedIn: PropTypes.bool.isRequired,
            match: PropTypes.object.isRequired,
            paths: PropTypes.object.isRequired,
            addPaths: PropTypes.func.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // local paths
            this.props.addPaths({
                Welcome: this.rr("."),
                Bank: this.rr("bank/"),
            })
        }


        // ...
        render = () =>
            <Fragment>
                <LoadingModal />
                <Switch>
                    <Route exact path={this.props.paths.Welcome}>
                        {
                            !this.props.loggedIn ?
                                <Welcome /> :
                                <Redirect to={this.props.paths.Bank} />
                        }
                    </Route>
                    <Route path={this.props.paths.Bank}>
                        {
                            this.props.loggedIn ?
                                <Bank /> :
                                <Redirect to={this.props.paths.Welcome} />
                        }
                    </Route>
                    <Redirect to={this.props.paths.Welcome} />
                </Switch>
            </Fragment>

    }
))
