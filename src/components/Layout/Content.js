import React, { Component } from "react"
import {
    Route,
    Switch,
} from "react-router-dom"
import { connect } from "react-redux"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./Content.css"




// ...
class Content extends Component {

    // ...
    constructor (props) {
        super(props)
        this.state = {
            style: this.computeStyle(this.props.drawerOpened),
        }
    }


    // ...
    computeStyle = (drawerOpened) => ({
        paddingLeft: drawerOpened ? 200 : 20,
    })


    // ...
    componentWillReceiveProps (nextProps) {
        if (this.props.drawerOpened !== nextProps.drawerOpened) {
            this.setState({
                style: this.computeStyle(nextProps.drawerOpened),
            })
        }
    }


    // ...
    render () {
        return (
            <div style={this.state.style} className="content">
                <Switch>
                    <Route exact path="/" component={Balances} />
                    <Route exact path="/payments/" component={Payments} />
                    <Route exact path="/account/" component={Account} />
                </Switch>
            </div>
        )
    }
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
        path : state.router.location.pathname,
    })
)(Content)
