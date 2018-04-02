import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route } from "react-router-dom"
import {
    bankDrawerWidth,
    contentPaneSeparation,
} from "../StellarFox/env"
import { ConnectedSwitch as Switch } from "../StellarRouter"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./BankContent.css"




// compute div's padding-left value
const computeStyle = (drawerOpened) => ({
    paddingLeft:
        drawerOpened ?
            bankDrawerWidth + contentPaneSeparation :
            contentPaneSeparation,
})




// <BankContent> component
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(
    class BankContent extends Component {

        // ...
        static propTypes = {
            drawerOpened: PropTypes.bool.isRequired,
            paths: PropTypes.object.isRequired,
        }


        // ...
        static getDerivedStateFromProps = ({ drawerOpened, }, prevState) =>
            prevState.drawerOpened !== drawerOpened ? {
                drawerOpened,
                style: computeStyle(drawerOpened),
            } :  null


        // ...
        state = {
            drawerOpened: this.props.drawerOpened,
            style: computeStyle(this.props.drawerOpened),
        }


        // ...
        render = () =>
            <div style={this.state.style} className="bank-content">
                <Switch>
                    <Route
                        path={this.props.paths.Balances}
                        component={Balances}
                    />
                    <Route
                        path={this.props.paths.Payments}
                        component={Payments}
                    />
                    <Route
                        path={this.props.paths.Account}
                        component={Account}
                    />
                </Switch>
            </div>

    }
)
