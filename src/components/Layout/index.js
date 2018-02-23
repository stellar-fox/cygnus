import React, { Component } from "react"
import { connect } from "react-redux"
import {
    Route,
    Redirect,
    Switch,
    withRouter,
} from "react-router-dom"

import {
    WalletAppBar,
    WalletDrawer,
} from "./Header"
import Content from "./Content"
import Footer from "./Footer"
import Welcome from "../Welcome"

import {
    ConditionalRender,
    RenderGroup
} from "../../lib/utils"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import stellarTheme from "../../frontend/themes/stellar"




// ..
class Layout extends Component {

    // ...
    render () {
        return (
            <MuiThemeProvider muiTheme={stellarTheme}>
                <ConditionalRender>
                    <RenderGroup render={this.props.loggedIn}>
                        <WalletAppBar />
                        <WalletDrawer />
                        <Content />
                        <Footer />
                    </RenderGroup>
                    <Switch render={!this.props.loggedIn}>
                        <Route exact path="/" component={Welcome} />
                        <Redirect to="/" />
                    </Switch>
                </ConditionalRender>
            </MuiThemeProvider>
        )
    }

}


// ...
export default withRouter(connect(
    // map state to props.
    (state) => ({
        loggedIn: state.auth.isHorizonLoggedIn,
    })
)(Layout))
