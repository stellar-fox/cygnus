import React, { Component, Fragment } from "react"
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
import { action as AccountAction } from "../../redux/Account"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import SwipeableViews from "react-swipeable-views"
import {
    Tab,
    Tabs,
} from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import Profile from "./Profile"
import Settings from "./Settings"
import Security from "./Security"
import "./index.css"




// ...
const styles = (theme) => ({
    tabs: {
        backgroundColor: theme.palette.primary.other,
        borderTopLeftRadius: "2px",
        borderTopRightRadius: "2px",
    },

    tab: {
        color: theme.palette.secondary.main,
    },

    indicator: {
        backgroundColor: theme.palette.secondary.main,
    },

    tabSelected: {
        color: theme.palette.secondary.light,
    },
})



const ChoiceTabs = withStyles(styles)(
    ({ authenticated, classes, onChange, value }) =>
        <Tabs
            variant="fullWidth"
            value={ value }
            onChange={ onChange }
            classes={{
                root: classes.tabs,
                indicator: classes.indicator,
            }}
        >
            <Tab
                classes={{
                    root: classes.tab,
                    selected: classes.tabSelected,
                }}
                label="Settings"
            />
            {authenticated &&
                <Tab
                    classes={{
                        root: classes.tab,
                        selected: classes.tabSelected,
                    }}
                    label="Profile"
                />
            }
            {authenticated &&
                <Tab
                    classes={{
                        root: classes.tab,
                        selected: classes.tabSelected,
                    }}
                    label="Security"
                />
            }
        </Tabs>
)



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
    handleTabSelect = (_event, value) => {
        this.props.setState({ tabSelected: this.validTabNames[value] })
        this.props.staticRouter.pushByView(this.validTabNames[value])
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
                    <Fragment>
                        <ChoiceTabs
                            authenticated={authenticated}
                            onChange={this.handleTabSelect}
                            value={this.validTabNames
                                .indexOf(currentView)}
                        />

                        <SwipeableViews
                            axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                            index={this.validTabNames.indexOf(currentView)}
                        >
                            <div className="swipeable-tab-container">
                                <Settings />
                            </div>
                            <div className="swipeable-tab-container">
                                <Profile />
                            </div>
                            <div className="swipeable-tab-container">
                                <Security />
                            </div>
                        </SwipeableViews>
                    </Fragment>

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
        (state, theme) => ({
            authenticated: state.Auth.authenticated,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            tabSelected: state.Account.tabSelected,
            theme,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            setApiToken: LoginManagerAction.setApiToken,
            setUserId: LoginManagerAction.setUserId,
        }, dispatch)
    )
)(Account)
