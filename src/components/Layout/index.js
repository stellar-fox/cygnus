import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"

import { inject } from "../../lib/utils"

import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import Bank from "./Bank"
import { ActionConstants } from "../../actions"




// ...
class Layout extends Component {

    // ...
    routes = {
        welcome: this.props.basePath,
        bank: `${this.props.basePath}bank/`,
    }


    // ...
    iWelcome = inject(Welcome, { basePath: this.routes.welcome, })
    iBank = inject(Bank, { basePath: this.routes.bank, })


    // ...
    render = () =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path={this.routes.welcome}>
                    {
                        !this.props.loggedIn ?
                            <Route component={this.iWelcome} /> :
                            <Redirect to={this.routes.bank} />
                    }
                </Route>
                <Route path={this.routes.bank}>
                    {
                        this.props.loggedIn ?
                            <Route component={this.iBank} /> :
                            <Redirect to={this.routes.welcome} />
                    }
                </Route>
                <Redirect to={this.routes.welcome} />
            </Switch>
        </Fragment>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        loggedIn: state.appAuth.loginState === ActionConstants.LOGGED_IN ? true : false,
    })
)(Layout)
