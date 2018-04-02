import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    Redirect,
    withRouter,
} from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    resolvePath,
} from "../StellarRouter"
import { Provide } from "../../lib/utils"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "../Layout/Footer"




// <Bank> component
export default withRouter(
    class Bank extends Component {

        // ...
        static propTypes = {
            match: PropTypes.object.isRequired,
        }


        // relative resolve
        rr = resolvePath(this.props.match.path)


        // local paths
        paths = {
            Balances: this.rr("balances/"),
            Payments: this.rr("payments/"),
            Account: this.rr("account/"),
        }


        // ...
        render = () =>
            <Fragment>
                <Switch>
                    <Redirect exact
                        from={this.rr(".")}
                        to={this.paths.Balances}
                    />
                </Switch>
                <Provide paths={this.paths}>
                    <BankAppBar />
                    <BankDrawer />
                    <BankContent />
                </Provide>
                <Footer />
            </Fragment>

    }
)
