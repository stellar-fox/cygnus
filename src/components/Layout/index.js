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




// ...
class Layout extends Component {

    // ...
    path = {
        welcome: this.props.basePath,
        bank: `${this.props.basePath}bank/`,
    }


    // ...
    iWelcome = inject(Welcome, { basePath: this.path.welcome, })
    iBank = inject(Bank, { basePath: this.path.bank, })


    // ...
    render = () =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path={this.path.welcome}>
                    {
                        !this.props.loggedIn ?
                            <Route component={this.iWelcome} /> :
                            <Redirect to={this.path.bank} />
                    }
                </Route>
                <Route path={this.path.bank}>
                    {
                        this.props.loggedIn ?
                            <Route component={this.iBank} /> :
                            <Redirect to={this.path.welcome} />
                    }
                </Route>
                <Redirect to={this.path.welcome} />
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
