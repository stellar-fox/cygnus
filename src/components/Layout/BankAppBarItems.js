import React from "react"
import { connect } from "react-redux"

import {
    pubKeyAbbr,
    handleException,
} from "../../lib/utils"

import "./BankAppBarItems.css"




// <BankAppBarItems> component
export default connect(
    (state) => ({
        accountExists: state.accountInfo.exists,
        homeDomain:
            state.accountInfo.account  &&
            state.accountInfo.account.account.home_domain,
        pubKey: state.appAuth.publicKey, //state.accountInfo.pubKey,
    })
)(
    ({
        accountExists,
        homeDomain,
        pubKey,
    }) =>
        <div className="app-bar-items">
            <div className="app-bar-title">
                <div className="bar-title-account">
                    {
                        accountExists && homeDomain ?
                            <div className="account-home-domain">
                                {homeDomain}
                            </div> :
                            <div>Account Number</div>
                    }
                </div>
                <div className="bar-subtitle-account">
                    {
                        handleException(
                            () => pubKeyAbbr(pubKey),
                            () => "XXXXXX-XXXXXX"
                        )
                    }
                </div>
            </div>
        </div>
)
