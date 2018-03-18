import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { Redirect } from "react-router-dom"
import { selectView } from "../../actions/index"
import { inject } from "../../lib/utils"
import { ConnectedSwitch as Switch } from "../StellarRouter"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "./Footer"




// Bank component
class Bank extends Component {

    // ...
    static contextTypes = {
        stellarRouter: PropTypes.object.isRequired,
    }


    // ...
    _name = "Bank"


    // ...
    componentWillMount = () => {
        // ...
        this._sr = this.context.stellarRouter
        this._basePath = this._sr.routes[this._name]
        Object.assign(this._sr.routes, {
            Balances: `${this._basePath}balances/`,
            Payments: `${this._basePath}payments/`,
            Account: `${this._basePath}account/`,
        })

        // ...
        this.routeToViewMap = {
            [this._sr.routes.Balances]: "Balances",
            [this._sr.routes.Payments]: "Payments",
            [this._sr.routes.Account]: "Account",
        }

        // ...
        this.iBankContent = inject(BankContent, {
            basePath: this._basePath,
            routes: this._sr.routes,
        })
    }


    // ...
    componentWillReceiveProps = ({ path, }) => {
        if (path !== this.props.path) {
            this.props.selectView(this.routeToViewMap[path])
        }
    }


    // ...
    render = () =>
        <Fragment>
            <Switch>
                <Redirect exact
                    from={this._basePath}
                    to={this._sr.routes.Balances}
                />
            </Switch>
            <BankAppBar />
            <BankDrawer routes={this._sr.routes} />
            <this.iBankContent />
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
