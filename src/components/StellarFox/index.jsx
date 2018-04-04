import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    connect,
    Provider,
} from "react-redux"

import {
    StellarRouter as Router,
    resolvePath,
} from "../StellarRouter"
import { action as RouterAction } from "../../redux/StellarRouter"
import { appBasePath } from "./env"

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import stellarTheme from "./theme"

import LoginManager from "../LoginManager"
import AssetManager from "../AssetManager"
import Layout from "../Layout"

import "./index.css"




// <StellarFox> component - application's root
export default connect(
    (state) => ({ paths: state.Router.paths, }),
    (dispatch) => ({ addPaths: (ps) => dispatch(RouterAction.addPaths(ps)), })
)(
    class StellarFox extends Component {

        // ...
        static propTypes = {
            paths: PropTypes.object.isRequired,
            addPaths: PropTypes.func.isRequired,
            store: PropTypes.object.isRequired,
            history: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(appBasePath)

            // static paths (needed by Layout)
            this.props.addPaths({
                Welcome: this.rr("."),
                Bank: this.rr("bank/"),
            })
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
)
