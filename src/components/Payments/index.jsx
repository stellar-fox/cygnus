import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    Route
} from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    ensureTrailingSlash,
    resolvePath,
    withDynamicRoutes,
    withStaticRouter,
} from "../StellarRouter"
import { rgba } from "../../lib/utils"
import {
    Tab,
    Tabs,
} from "material-ui/Tabs"
import PaymentsTable from "../PaymentsTable"
import { Typography } from "@material-ui/core"
import { func } from "@xcmats/js-toolbox"
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




// <Payments> component
class Payments extends Component {

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
        this.validTabNames = ["History"]

        // static paths
        this.props.staticRouter.addPaths(
            this.validTabNames.reduce((acc, tn) => ({
                ...acc,
                [tn]: this.rr(ensureTrailingSlash(tn.toLowerCase())),
            }), {})
        )
    }


    // ...
    handleTabSelect = (value) => func.identity(value)


    // ...
    render = () => (
        ({ currentView, staticRouter: { getPath }, tabSelected }) =>
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
                            this.validTabNames.indexOf(currentView) !== -1 ?
                                currentView : tabSelected
                        }
                        onChange={this.handleTabSelect}
                    >
                        <Tab
                            style={styles.tab}
                            label={this.validTabNames[0]}
                            value={this.validTabNames[0]}
                        >
                            <div className="tab-content">
                                <Typography variant="body1" color="secondary">
                                    Payment History
                                </Typography>
                                <Typography variant="caption" color="secondary">
                                    Newest transactions shown as first.
                                </Typography>
                                <PaymentsTable />
                            </div>
                        </Tab>
                    </Tabs>
                </Route>
                <Redirect to={getPath(tabSelected)} />
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
            tabSelected: state.Payments.tabSelected,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
        }, dispatch)
    ),
)(Payments)
