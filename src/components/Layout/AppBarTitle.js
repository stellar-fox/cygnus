import React, { Component } from "react"
import { connect } from "react-redux"

import "./AppBarTitle.css"




// ...
class AppBarTitle extends Component {

    // ...
    render () {
        return (
            <div className="flex-start">
                <div className="app-bar-title">
                    <div className="bar-title"><span>Stellar Fox</span></div>
                    <div className="bar-subtitle">{this.props.viewName}</div>
                </div>
                <div className="indicator-set-col">
                    <div className="badge">test net</div>
                    <div className="p-b-small" />
                    <div>{
                        this.props.ledgerVer ? (
                            <span className="ledger-nano-s"></span>
                        ) : (
                            <span>&nbsp;</span>
                        )
                    }</div>
                </div>
            </div>
        )
    }

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        viewName: state.nav.viewName,
        ledgerVer: state.auth.ledgerSoftwareVersion,
    })
)(AppBarTitle)
