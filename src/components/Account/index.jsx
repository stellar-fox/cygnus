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
    ConnectedSwitch as Switch,
    ensureTrailingSlash,
    resolvePath,
    withDynamicRoutes,
    withStaticRouter,
} from "../StellarRouter"
import { rgba } from "../../lib/utils"
import { action as AccountAction } from "../../redux/Account"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import {
    Tab,
    Tabs,
} from "material-ui/Tabs"
import Profile from "./Profile"
import Settings from "./Settings"
import Security from "./Security"
import "./index.css"




// ...
const styles = {
    tab: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
        color: rgba(244, 176, 4, 0.9),
    },
    inkBar: {
        backgroundColor: rgba(244, 176, 4, 0.8),
    },
    container: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
    },
}




// <Account> component
class Account extends Component {

    // ...
    static propTypes = {
        match: PropTypes.object.isRequired,
        staticRouter: PropTypes.object.isRequired,
    }


    // ...
    constructor (props) {
        super(props)

        // relative resolve
        this.rr = resolvePath(this.props.match.path)

        // ...
        this.validTabNames = ["Settings", "Profile", "Security" ]

        // static paths
        this.props.staticRouter.addPaths(
            this.validTabNames.reduce((acc, tn) => ({
                ...acc,
                [tn]: this.rr(ensureTrailingSlash(tn.toLowerCase())),
            }), {})
        )
    }


    // ...
    handleTabSelect = (value) => {
        this.props.setState({ tabSelected: value })
        this.props.staticRouter.pushByView(value)
    }


    // ...
    render = () => (
        ({ 
            authenticated, currentView, staticRouter: { getPath }, tabSelected,
        }) =>
            <Switch>
                <Redirect exact
                    from={this.rr(".")}
                    to={getPath(tabSelected)}
                />
                <Route
                    exact
                    path={
                        this.validTabNames.indexOf(currentView) !== -1 ?
                            getPath(currentView) : getPath(tabSelected)
                    }
                >
                    <Tabs
                        tabItemContainerStyle={styles.container}
                        inkBarStyle={styles.inkBar}
                        value={
                            this.validTabNames
                                .indexOf(currentView) !== -1 ?
                                currentView :
                                tabSelected
                        }
                        onChange={this.handleTabSelect}
                        className="tabs-container"
                    >
                        <Tab
                            style={styles.tab}
                            label={this.validTabNames[0]}
                            value={this.validTabNames[0]}
                        >
                            <Settings />
                        </Tab>
                        {
                            authenticated ?
                                <Tab
                                    style={styles.tab}
                                    label={this.validTabNames[1]}
                                    value={this.validTabNames[1]}
                                >
                                    <Profile />
                                </Tab> : null
                        }
                        {
                            authenticated ?
                                <Tab
                                    style={styles.tab}
                                    label={this.validTabNames[2]}
                                    value={this.validTabNames[2]}
                                >
                                    <Security />
                                </Tab> : null
                        }
                    </Tabs>
                </Route>
                <Redirect exact to={getPath(tabSelected)} />
            </Switch>
    )(this.props)

}


// ...
export default compose(
    withStaticRouter,
    withDynamicRoutes,
    connect(
        // map state to props.
        (state) => ({
            authenticated: state.Auth.authenticated,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            tabSelected: state.Account.tabSelected,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            setApiToken: LoginManagerAction.setApiToken,
            setUserId: LoginManagerAction.setUserId,
        }, dispatch)
    )
)(Account)
