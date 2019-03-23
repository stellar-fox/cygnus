import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
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
import { withStyles } from "@material-ui/core/styles"
import Account from "../Account"
import Balances from "../Balances"
import Payments from "../Payments"
import Contacts from "../Contacts"
import { fetchStellarAccount } from "../../thunks/stellar"
import {
    getUserContacts,
    getUserProfile,
    surfaceRegistrationCard,
} from "../../thunks/users"





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
        // map state to props
        (state) => ({
            accountId: state.StellarAccount.accountId,
            authenticated: state.Auth.authenticated,
            drawerVisible: state.Bank.drawerVisible,
        }),
        // actions to props
        (dispatch) => bindActionCreators({
            fetchStellarAccount,
            getUserContacts,
            getUserProfile,
            surfaceRegistrationCard,
        }, dispatch)
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
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.staticRouter.addPaths({
                "Balances": this.rr("balances/"),
                "Payments": this.rr("payments/"),
                "Account": this.rr("account/"),
                "Contacts": this.rr("contacts/"),
            })
        }

        state = {}

        componentDidMount = () => {
            if (!this.props.accountId) {
                this.props.fetchStellarAccount()
            }

            if (this.props.authenticated) {
                this.props.getUserProfile()
                this.props.getUserContacts()
            } else {
                this.props.surfaceRegistrationCard()
            }

        }


        // ...
        static getDerivedStateFromProps = ({ drawerVisible }) => ({
            style: {
                paddingLeft: drawerVisible ?
                    bankDrawerWidth + contentPaneSeparation :
                    contentPaneSeparation,
            },
        })


        // ...
        render = () => (
            ({ style }, { classes, staticRouter: { getPath } }) =>
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
                        <Route path={getPath("Contacts")}>
                            { (routeProps) => <Contacts {...routeProps} /> }
                        </Route>
                        <Redirect to={getPath("Balances")} />
                    </Switch>
                </div>
        )(this.state, this.props)

    }
)
