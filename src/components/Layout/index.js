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
    welcomePath = this.props.basePath
    iWelcome = inject(Welcome, { basePath: this.welcomePath, })
    bankPath = `${this.props.basePath}bank/`
    iBank = inject(Bank, { basePath: this.bankPath, })


    // ...
    render = () =>
        <Fragment>
            <LoadingModal />
            <Switch>
                <Route exact path={this.welcomePath}>
                    {
                        !this.props.loggedIn ?
                            <Route component={this.iWelcome} /> :
                            <Redirect to={this.bankPath} />
                    }
                </Route>
                <Route path={this.bankPath}>
                    {
                        this.props.loggedIn ?
                            <Route component={this.iBank} /> :
                            <Redirect to={this.welcomePath} />
                    }
                </Route>
                <Redirect to={this.welcomePath} />
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
