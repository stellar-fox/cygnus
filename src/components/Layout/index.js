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




// ...
class Layout extends Component {

    // ...
    static propTypes = {
        loggedIn: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
    }


    // relative resolve
    rr = resolvePath(this.props.match.path)


    // local paths
    p = {
        Welcome: this.rr("."),
        Bank: this.rr("bank/"),
    }


    // ...
    render = () =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path={this.p.Welcome}>
                    {
                        !this.props.loggedIn ?
                            <Welcome /> :
                            <Redirect to={this.p.Bank} />
                    }
                </Route>
                <Route path={this.p.Bank}>
                    {
                        this.props.loggedIn ?
                            <Bank /> :
                            <Redirect to={this.p.Welcome} />
                    }
                </Route>
                <Redirect to={this.p.Welcome} />
            </Switch>
        </Fragment>

}


// ...
export default withRouter(connect(
    // map state to props.
    (state) => ({
        loggedIn: state.auth.isHorizonLoggedIn,
    })
)(Layout))
