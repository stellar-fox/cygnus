import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { Redirect } from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    resolvePath,
    withStellarRouter,
} from "../StellarRouter"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "../Layout/Footer"




// <Bank> component
export default withStellarRouter(
    class Bank extends Component {

        // ...
        static propTypes = {
            match: PropTypes.object.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


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
        render = () => (
            (getPath) =>
                <Fragment>
                    <Switch>
                        <Redirect exact
                            from={this.rr(".")}
                            to={getPath("Balances")}
                        />
                    </Switch>
                    <BankAppBar />
                    <BankDrawer />
                    <BankContent />
                    <Footer />
                </Fragment>
        )(this.props.staticRouter.getPath)

    }
)
