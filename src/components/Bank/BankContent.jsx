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
const computeStyle = (drawerOpened) => ({
    paddingLeft:
        drawerOpened ?
            bankDrawerWidth + contentPaneSeparation :
            contentPaneSeparation,
})




// <BankContent> component
export default withStellarRouter(connect(
    (state) => ({ drawerOpened: state.ui.drawer.isOpened, })
)(
    class BankContent extends Component {

        // ...
        static propTypes = {
            drawerOpened: PropTypes.bool.isRequired,
            stellarRouter: PropTypes.object.isRequired,
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
        render = () => (
            ({ style, }, getStaticPath) =>
                <div style={style} className="bank-content">
                    <Switch>
                        <Route
                            path={getStaticPath("Balances")}
                            component={Balances}
                        />
                        <Route
                            path={getStaticPath("Payments")}
                            component={Payments}
                        />
                        <Route
                            path={getStaticPath("Account")}
                            component={Account}
                        />
                    </Switch>
                </div>
        )(this.state, this.props.stellarRouter.getStaticPath)

    }
))
