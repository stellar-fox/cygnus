import React, { Component, Fragment } from "react"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"
import { inject } from "../../lib/utils"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "./Footer"




// Bank component
export default class Bank extends Component {

    // ...
    routes = {
        balances: `${this.props.basePath}balances/`,
        payments: `${this.props.basePath}payments/`,
        account: `${this.props.basePath}account/`,
    }


    // ...
    iBankDrawer = inject(BankDrawer, { basePath: this.props.basePath, routes: this.routes, })
    iBankContent = inject(BankContent, { basePath: this.props.basePath, routes: this.routes, })


    // ...
    render = () =>
        <Fragment>
            <Switch>
                <Redirect exact
                    from={this.props.basePath}
                    to={this.routes.balances}
                />
            </Switch>
            <BankAppBar />
            <Route component={this.iBankDrawer} />
            <Route component={this.iBankContent} />
            <Footer />
        </Fragment>

}
