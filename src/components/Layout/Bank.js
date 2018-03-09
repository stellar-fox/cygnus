import React, { Component, Fragment } from "react"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { selectView } from "../../actions/index"
import { inject } from "../../lib/utils"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "./Footer"




// Bank component
class Bank extends Component {

    // ...
    routes = {
        balances: `${this.props.basePath}balances/`,
        payments: `${this.props.basePath}payments/`,
        account: `${this.props.basePath}account/`,
    }


    // ...
    routeToViewMap = {
        [this.routes.balances]: "Balances",
        [this.routes.payments]: "Payments",
        [this.routes.account]: "Account",
    }


    // ...
    componentWillReceiveProps = ({ path, }) => {
        if (path !== this.props.path) {
            this.props.selectView(this.routeToViewMap[path])
        }
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


// ...
export default connect(
    // map state to props.
    (state) => ({
        path: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(Bank)
