import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route } from "react-router-dom"
import {
    bankDrawerWidth,
    contentPaneSeparation,
} from "../StellarFox/env"
import {
    ConnectedSwitch as Switch,
    withStellarRouter,
} from "../StellarRouter"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./BankContent.css"




// compute div's padding-left value
const computeStyle = (drawerVisible) => ({
    paddingLeft:
        drawerVisible ?
            bankDrawerWidth + contentPaneSeparation :
            contentPaneSeparation,
})




// <BankContent> component
export default withStellarRouter(connect(
    // map state to props.
    (state) => ({ drawerVisible: state.Bank.drawerVisible, })
)(
    class extends Component {

        // ...
        static propTypes = {
            drawerVisible: PropTypes.bool.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        static getDerivedStateFromProps = ({ drawerVisible, }, prevState) =>
            prevState.drawerVisible !== drawerVisible ? {
                drawerVisible,
                style: computeStyle(drawerVisible),
            } :  null


        // ...
        state = {
            drawerVisible: this.props.drawerVisible,
            style: computeStyle(this.props.drawerVisible),
        }


        // ...
        render = () => (
            ({ style, }, getPath) =>
                <div style={style} className="bank-content">
                    <Switch>
                        <Route
                            path={getPath("Balances")}
                            component={Balances}
                        />
                        <Route
                            path={getPath("Payments")}
                            component={Payments}
                        />
                        <Route
                            path={getPath("Account")}
                            component={Account}
                        />
                    </Switch>
                </div>
        )(this.state, this.props.staticRouter.getPath)

    }
))
