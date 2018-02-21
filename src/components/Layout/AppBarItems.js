import React, { Component } from "react"
import { connect } from "react-redux"

import {
    pubKeyAbbr,
    handleException,
} from "../../lib/utils"

import "./AppBarItems.css"




// ...
class AppBarItems extends Component {

    // ...
    render () {
        return (
            <div className="app-bar-items">
                <div className="app-bar-title">
                    <div className="bar-title-account">{
                        this.props.accountExists &&
                            this.props.homeDomain ? (
                                <div className="account-home-domain">{
                                    this.props.homeDomain
                                }</div>
                            ) : (
                                <div>Account Number</div>
                            )
                    }</div>
                    <div className="bar-subtitle-account">{
                        handleException(
                            () => pubKeyAbbr(this.props.pubKey),
                            () => "XXXXXX-XXXXXX"
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
        pubKey: state.accountInfo.pubKey,
        accountExists : state.accountInfo.exists,
        homeDomain : state.accountInfo.account.account.home_domain,
    })
)(AppBarItems)