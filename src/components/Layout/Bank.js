import React, { Component, Fragment } from "react"
import { inject } from "../../lib/utils"

import {
    BankAppBar,
    BankDrawer,
} from "./Header"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"
import Content from "./Content"
import Footer from "./Footer"




// Bank component
export default class Bank extends Component {

    // ...
    balancesPath = `${this.props.basePath}balances/`
    iBankDrawer = inject(BankDrawer, { basePath: this.props.basePath, })
    iContent = inject(Content, { basePath: this.props.basePath, })


    // ...
    render = () =>
        <Fragment>
            <Switch>
                <Redirect exact
                    from={this.props.basePath}
                    to={this.balancesPath}
                />
            </Switch>
            <BankAppBar />
            <Route component={this.iBankDrawer} />
            <Route component={this.iContent} />
            <Footer />
        </Fragment>

}
