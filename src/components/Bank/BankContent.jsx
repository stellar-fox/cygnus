import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import { Route } from "react-router-dom"
import {
    bankDrawerWidth,
    contentPaneSeparation,
} from "../StellarFox/env"
import {
    ConnectedSwitch as Switch,
    withStaticRouter,
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
export default compose(
    withStaticRouter,
    connect(
        // map state to props.
        (state) => ({ drawerVisible: state.Bank.drawerVisible, })
    )
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
                        <Route path={getPath("Balances")}>
                            { (routeProps) => <Balances {...routeProps} /> }
                        </Route>
                        <Route path={getPath("Payments")}>
                            { (routeProps) => <Payments {...routeProps} /> }
                        </Route>
                        <Route path={getPath("Account")}>
                            { (routeProps) => <Account {...routeProps} /> }
                        </Route>
                    </Switch>
                </div>
        )(this.state, this.props.staticRouter.getPath)

    }
)
