import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    withRouter,
} from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    resolvePath,
} from "../StellarRouter"
import { Provide } from "../../lib/utils"

import { selectView } from "../../redux/actions"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "../Layout/Footer"




// <Bank> component
export default withRouter(connect(
    // map state to props.
    (state) => ({
        currentPath: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(
    class Bank extends Component {

        // ...
        static propTypes = {
            match: PropTypes.object.isRequired,
            currentPath: PropTypes.string.isRequired,
            selectView: PropTypes.func.isRequired,
        }


        // relative resolve
        rr = resolvePath(this.props.match.path)


        // local paths
        paths = {
            Balances: this.rr("balances/"),
            Payments: this.rr("payments/"),
            Account: this.rr("account/"),
        }


        // route mapping
        routeToViewMap = {
            [this.paths.Balances]: "Balances",
            [this.paths.Payments]: "Payments",
            [this.paths.Account]: "Account",
        }


        // ...
        UNSAFE_componentWillReceiveProps = ({ currentPath, }) => {
            if (currentPath !== this.props.currentPath) {
                this.props.selectView(this.routeToViewMap[currentPath])
            }
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
                <BankAppBar />
                <Provide paths={this.paths}>
                    <BankDrawer />
                    <BankContent />
                </Provide>
                <Footer />
            </Fragment>

    }
))
