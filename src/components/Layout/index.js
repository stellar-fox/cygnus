import React, { Component } from "react"
import { connect } from "react-redux"
import {
    Route,
    Redirect,
    Switch
} from "react-router-dom"

import {
    WalletAppBar,
    WalletDrawer,
} from "./Header"
import Content from "./Content"
import Footer from "./Footer"
import Welcome from "../Welcome"
import LoadingModal from "../LoadingModal"

import {
    ConditionalRender,
    RenderGroup
} from "../../lib/utils"




// ..
class Layout extends Component {

    // ...
    render () {
        return (
            <ConditionalRender>
                <RenderGroup display={this.props.loggedIn}>
                    <WalletAppBar />
                    <LoadingModal />
                    <WalletDrawer />
                    <Content />
                    <Footer />
                </RenderGroup>
                <LoadingModal display={!this.props.loggedIn} />
                <Switch display={!this.props.loggedIn}>
                    <Route exact path="/" component={Welcome} />
                    <Redirect to="/" />
                </Switch>
            </ConditionalRender>
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
