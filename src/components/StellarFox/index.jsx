import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "react-redux"

import { StellarRouter as Router } from "../StellarRouter"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import LoginManager from "../LoginManager"
import AssetManager from "../AssetManager"
import Layout from "../Layout"

import stellarTheme from "./theme"

import "./index.css"




// <StellarFox> component - application's root
export default class StellarFox extends Component {

    // ...
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }


    // ...
    render = () => (
        ({ store, history, }) =>
            <Provider store={store}>
                <Router history={history}>
                    <MuiThemeProvider muiTheme={stellarTheme}>
                        <LoginManager>
                            <AssetManager>
                                <Layout />
                            </AssetManager>
                        </LoginManager>
                    </MuiThemeProvider>
                </Router>
            </Provider>
    )(this.props)

}
