import React, { Component } from "react"
import PropTypes from "prop-types"
import { NotImplementedBadge } from "../StellarFox/env"
import Toggle from "../../lib/common/Toggle"

export default class Security extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }

    render = () => 
        <div className="tab-content">
            <div className="f-b space-between">
                <div>
                    <h2 className="tab-content-headline">Account Security</h2>
                    <div className="account-title">
                        Adjust security settings for your account.
                    </div>
                    <div className="account-subtitle">
                        Protect your account with additional
                        security options.
                    </div>
                </div>
            </div>

            <div className="m-t-large f-b space-between outline">
                <div>
                    <div className="account-title">
                        Enable two-factor authentication. (2FA)
                    </div>
                    <div className="account-subtitle">
                        Confirm your account transations
                        with second authentication factor.
                    </div>
                    <NotImplementedBadge />
                </div>
                <div>
                    <Toggle
                        toggled={false}
                        onToggle={null}
                    />
                </div>
            </div>

            <div className="m-t-large f-b space-between outline">
                <div>
                    <div className="account-title">
                        Add co-signers to your account.
                        (Multisignature Verification)
                    </div>
                    <div className="account-subtitle">
                        Multisignature account requires two or
                        more signatures on every transaction.
                    </div>
                    <NotImplementedBadge />
                </div>
                <div>
                    <Toggle
                        toggled={false}
                        onToggle={null}
                    />
                </div>
            </div>
        </div>
}
