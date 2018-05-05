import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"
import {
    bankDrawerWidth,
    contentPaneSeparation,
} from "../StellarFox/env"
import {
    ConnectedSwitch as Switch,
    resolvePath,
    withStaticRouter,
} from "../StellarRouter"

import { withStyles } from "material-ui-next/styles"

import Account from "../Account"
import Balances from "../Balances"
import Payments from "../Payments"




// <BankContent> component
export default compose(
    withStyles({

        bankContent: {
            paddingTop: 84,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 50,
            transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1)",
        },

    }),
    withStaticRouter,
    connect(
        // map state to props.
        (state) => ({ drawerVisible: state.Bank.drawerVisible, })
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            drawerVisible: PropTypes.bool.isRequired,
            match: PropTypes.object.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        static getDerivedStateFromProps = ({ drawerVisible, }) => ({
            style: {
                paddingLeft: drawerVisible ?
                    bankDrawerWidth + contentPaneSeparation :
                    contentPaneSeparation,
            },
        })


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
        state = {}


        // ...
        render = () => (
            ({ style, }, { classes, staticRouter: { getPath, }, }) =>
                <div style={style} className={classes.bankContent}>
                    <Switch>
                        <Redirect exact
                            from={this.rr(".")}
                            to={getPath("Balances")}
                        />
                        <Route path={getPath("Balances")}>
                            { (routeProps) => <Balances {...routeProps} /> }
                        </Route>
                        <Route path={getPath("Payments")}>
                            { (routeProps) => <Payments {...routeProps} /> }
                        </Route>
                        <Route path={getPath("Account")}>
                            { (routeProps) => <Account {...routeProps} /> }
                        </Route>
                        <Redirect to={getPath("Balances")} />
                    </Switch>
                </div>
        )(this.state, this.props)

    }
)
