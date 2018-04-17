import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"
import {
    bankDrawerWidth,
    contentPaneSeparation,
} from "../StellarFox/env"
import {
    ConnectedSwitch as Switch,
    resolvePath,
    withStaticRouter,
} from "../StellarRouter"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./BankContent.css"




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
            match: PropTypes.object.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        static getDerivedStateFromProps = ({ drawerVisible, }) => ({
            style: {
                paddingLeft: drawerVisible ?
                    bankDrawerWidth + contentPaneSeparation :
                    contentPaneSeparation,
            },
        })


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.staticRouter.addPaths({
                "Balances": this.rr("balances/"),
                "Payments": this.rr("payments/"),
                "Account": this.rr("account/"),
            })
        }


        // ...
        state = {}


        // ...
        render = () => (
            ({ style, }, { getPath, }) =>
                <div style={style} className="bank-content">
                    <Switch>
                        <Redirect exact
                            from={this.rr(".")}
                            to={getPath("Balances")}
                        />
                        <Route path={getPath("Balances")}>
                            { (routeProps) => <Balances {...routeProps} /> }
                        </Route>
                        <Route path={getPath("Payments")}>
                            { (routeProps) => <Payments {...routeProps} /> }
                        </Route>
                        <Route path={getPath("Account")}>
                            { (routeProps) => <Account {...routeProps} /> }
                        </Route>
                        <Redirect to={getPath("Balances")} />
                    </Switch>
                </div>
        )(this.state, this.props.staticRouter)

    }
)
