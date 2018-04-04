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
            stellarRouter: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.stellarRouter.addStaticPaths({
                "Balances": this.rr("balances/"),
                "Payments": this.rr("payments/"),
                "Account": this.rr("account/"),
            })
        }


        // ...
        render = () => (
            (getStaticPath) =>
                <Fragment>
                    <Switch>
                        <Redirect exact
                            from={this.rr(".")}
                            to={getStaticPath("Balances")}
                        />
                    </Switch>
                    <BankAppBar />
                    <BankDrawer />
                    <BankContent />
                    <Footer />
                </Fragment>
        )(this.props.stellarRouter.getStaticPath)

    }
)
