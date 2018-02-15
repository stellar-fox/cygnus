import React, { Component } from "react"
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom"
import { connect } from "react-redux"
import Header from "./Header"
import Content from "./Content"
import Footer from "./Footer"
import Welcome from "../Welcome/Welcome"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import stellarTheme from "../../frontend/themes/stellar"

import "./Layout.css"

class Layout extends Component {
    render () {
        return (
            <MuiThemeProvider muiTheme={stellarTheme}>
                <div>
                    <Router>
                        <div>
                            {this.props.auth.isHorizonLoggedIn ? (
                                <div>
                                    <Header />
                                    <Content />
                                    <Footer />
                                </div>
                            ) : (
                                <Switch>
                                    <Route exact path="/" component={Welcome} />
                                    <Redirect to="/" />
                                </Switch>
                            )}
                        </div>
                    </Router>
                </div>
            </MuiThemeProvider>
        )
    }
}

function mapStateToProps (state) {
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(Layout)
