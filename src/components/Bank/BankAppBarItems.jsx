import React from "react"
import { connect } from "react-redux"

import {
    pubKeyAbbr,
    handleException,
} from "../../lib/utils"
import { unknownPubKeyAbbr } from "../StellarFox/env"

import "./BankAppBarItems.css"




// <BankAppBarItems> component
export default connect(
    // map state to props.
    (state) => ({
        StellarAccount: state.StellarAccount,
        publicKey: state.LedgerHQ.publicKey,
    })
)(
    ({
        StellarAccount,
        publicKey,
    }) =>
        <div className="app-bar-items">
            <div className="app-bar-title">
                <div className="bar-title-account">
                    {
                        StellarAccount.accountId && StellarAccount.homeDomain ?
                            <div className="account-home-domain">
                                {StellarAccount.homeDomain}
                            </div> :
                            <div>Account Number</div>
                    }
                </div>
                <div className="bar-subtitle-account">
                    {
                        handleException(
                            () => pubKeyAbbr(publicKey),
                            () => unknownPubKeyAbbr
                        )
                    }
                </div>
            </div>
        </div>
)
