import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"

import { ConnectedSwitch as Switch } from "../StellarRouter"

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
    componentWillMount = () => {
        this._sr = this.context.stellarRouter
        Object.assign(this._sr.routes, {
            Welcome: this.props.basePath,
            Bank: `${this.props.basePath}bank/`,
        })
    }


    // ...
    render = () =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path={this._sr.routes.Welcome}>
                    {
                        !this.props.loggedIn ?
                            <Welcome basePath={this._sr.routes.Welcome} /> :
                            <Redirect to={this._sr.routes.Bank} />
                    }
                </Route>
                <Route path={this._sr.routes.Bank}>
                    {
                        this.props.loggedIn ?
                            <Bank basePath={this._sr.routes.Bank} /> :
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
