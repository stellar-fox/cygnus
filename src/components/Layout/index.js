import React, { Component, Fragment, } from "react"
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom"
import { connect } from "react-redux"
import { WalletAppBar, WalletDrawer } from "./Header"
import Content from "./Content"
import Footer from "./Footer"
import Welcome from "../Welcome"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import stellarTheme from "../../frontend/themes/stellar"


// ..
class Layout extends Component {

    // ...
    render () {
        return (
            <MuiThemeProvider muiTheme={stellarTheme}>
                <Router>{
                    this.props.loggedIn ? (
                        <Fragment>
                            <WalletAppBar />
                            <WalletDrawer />
                            <Content />
                            <Footer />
                        </Fragment>
                    ) : (
                        <Switch>
                            <Route exact path="/" component={Welcome} />
                            <Redirect to="/" />
                        </Switch>
                    )
                }</Router>
            </MuiThemeProvider>
        )
    }
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        loggedIn: state.auth.isHorizonLoggedIn,
    })
)(Layout)
