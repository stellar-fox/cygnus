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
        computeStyle = (drawerOpened) => ({
            paddingLeft:
                drawerOpened ?
                    bankDrawerWidth + contentPaneSeparation :
                    contentPaneSeparation,
        })


        // ...
        state = { style: this.computeStyle(this.props.drawerOpened), }


        // ...
        componentWillReceiveProps = ({ drawerOpened, }) => {
            if (this.props.drawerOpened !== drawerOpened) {
                this.setState({
                    style: this.computeStyle(drawerOpened),
                })
            }
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
