import React, { Component } from "react"
import { Route, Switch, withRouter } from "react-router-dom"
import { connect } from "react-redux"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./Content.css"




class Content extends Component {

    // ...
    render () {
        return (
            <div
                style={{
                    paddingLeft: this.props.ui.drawer.isOpened ? 200 : 20,
                }}
                className="content"
            >
                <Switch>
                    <Route exact path="/" component={Balances} />
                    <Route exact path="/payments" component={Payments} />
                    <Route exact path="/account" component={Account} />
                </Switch>
            </div>
        )
    }
}


export default withRouter(connect(
    // map state to props.
    (state) => ({
        ui: state.ui,
    })
)(Content))
