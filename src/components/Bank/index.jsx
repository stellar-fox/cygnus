import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
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

import { action as RouterAction } from "../../redux/StellarRouter"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "../Layout/Footer"




// <Bank> component
export default withRouter(connect(
    (state) => ({ paths: state.Router.paths, }),
    (dispatch) => ({ addPaths: (ps) => dispatch(RouterAction.addPaths(ps)), })
)(
    class Bank extends Component {

        // ...
        static propTypes = {
            match: PropTypes.object.isRequired,
            paths: PropTypes.object.isRequired,
            addPaths: PropTypes.func.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // local paths
            this.props.addPaths({
                Balances: this.rr("balances/"),
                Payments: this.rr("payments/"),
                Account: this.rr("account/"),
            })
        }


        // ...
        render = () =>
            <Fragment>
                <Switch>
                    <Redirect exact
                        from={this.rr(".")}
                        to={this.props.paths.Balances}
                    />
                </Switch>
                <Provide paths={this.props.paths}>
                    <BankAppBar />
                </Provide>
                <BankDrawer />
                <BankContent />
                <Footer />
            </Fragment>

    }
))
