import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"

import { inject } from "../../lib/utils"
import PropTypes from "prop-types"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "./Bank"




// ...
class Layout extends Component {

    // ...
    static contextTypes = {
        stellarRouter: PropTypes.object.isRequired,
    }


    // ...
    _name = "Layout"


    // ...
    componentWillMount = () => {
        // ...
        this._sr = this.context.stellarRouter
        Object.assign(this._sr.routes, {
            Welcome: this._sr.basePath,
            Bank: `${this._sr.basePath}bank/`,
        })

        // ...
        this.iWelcome = inject(Welcome, { basePath: this._sr.routes.Welcome, })
    }


    // ...
    render = () =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path={this._sr.routes.Welcome}>
                    {
                        !this.props.loggedIn ?
                            <Route component={this.iWelcome} /> :
                            <Redirect to={this._sr.routes.Bank} />
                    }
                </Route>
                <Route path={this._sr.routes.Bank}>
                    {
                        this.props.loggedIn ?
                            <Route component={Bank} /> :
                            <Redirect to={this._sr.routes.Welcome} />
                    }
                </Route>
                <Redirect to={this._sr.routes.Welcome} />
            </Switch>
        </Fragment>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        loggedIn: state.auth.isHorizonLoggedIn,
    })
)(Layout)
