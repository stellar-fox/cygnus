import React from "react"
import { Provider } from "react-redux"
import {
    ConnectedSwitch as Switch,
    StellarRouter as Router,
} from "../StellarRouter"
import {
    Redirect,
    Route,
} from "react-router-dom"
import * as env from "./env"
import { MuiThemeProvider } from "@material-ui/core/styles"
import sFoxTheme from "../../lib/sfox-mui-theme"
import { CssBaseline } from "@material-ui/core"
import LegacyMuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import sFoxThemeLegacy from "../../lib/sfox-mui-theme.legacy"
import LoginManager from "../LoginManager"
import Layout from "../Layout"
import { config } from "../../config"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "typeface-roboto"
import "./index.css"




// firebase app
export const firebaseApp = firebase.initializeApp(config.firebase)




// <StellarFox> component - application's root
export default ({ history, store }) =>
    <Provider store={store}>
        <Router history={history}>
            <MuiThemeProvider theme={sFoxTheme}>
                <LegacyMuiThemeProvider muiTheme={sFoxThemeLegacy}>
                    <LoginManager>
                        <CssBaseline />
                        <Switch>
                            <Route path={env.appBasePath}>
                                {
                                    (routeProps) =>
                                        <Layout {...routeProps} />
                                }
                            </Route>
                            <Redirect to={env.appBasePath} />
                        </Switch>
                    </LoginManager>
                </LegacyMuiThemeProvider>
            </MuiThemeProvider>
        </Router>
    </Provider>



// ...
export { env }
