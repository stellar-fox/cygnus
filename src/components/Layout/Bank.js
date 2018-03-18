import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { selectView } from "../../actions/index"
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
    componentWillMount = () => {
        this._sr = this.context.stellarRouter
        Object.assign(this._sr.routes, {
            Balances: `${this.props.basePath}balances/`,
            Payments: `${this.props.basePath}payments/`,
            Account: `${this.props.basePath}account/`,
        })

        // ...
        this.routeToViewMap = {
            [this._sr.routes.Balances]: "Balances",
            [this._sr.routes.Payments]: "Payments",
            [this._sr.routes.Account]: "Account",
        }
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
                    from={this.props.basePath}
                    to={this._sr.routes.Balances}
                />
            </Switch>
            <BankAppBar />
            <BankDrawer />
            <BankContent basePath={this.props.basePath} />
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
