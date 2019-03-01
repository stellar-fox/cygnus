import React from "react"
import { NotImplementedBadge } from "../StellarFox/env"
import Switch from "../../lib/mui-v1/Switch"
import { Typography } from "@material-ui/core"




// <Security> component
export default  () =>
    <div className="tab-content">

        <div className="flex-box-row">
            <div>
                <Typography variant="body1" color="secondary">
                    Secure your account even further.
                </Typography>
                <Typography variant="caption" color="secondary">
                    Protect your account with additional
                    security options.
                </Typography>
            </div>
        </div>

        <div className="m-t-large f-b space-between outline">
            <div>
                <Typography variant="body1" color="secondary">
                    Enable two-factor authentication. (2FA)
                </Typography>
                <Typography variant="caption" color="secondary">
                    Confirm your account transations
                    with second authentication factor.
                </Typography>
                <NotImplementedBadge />
            </div>
            <div>
                <Switch
                    checked={false}
                    onChange={null}
                    color="secondary"
                    disabled
                />
            </div>
        </div>

        <div className="m-t-large f-b space-between outline">
            <div>
                <Typography variant="body1" color="secondary">
                    Add co-signers to your account.
                </Typography>
                <Typography variant="caption" color="secondary">
                    Multisignature account requires two or
                    more signatures in order to send the transaction.
                </Typography>
                <NotImplementedBadge />
            </div>
            <div>
                <Switch
                    checked={false}
                    onChange={null}
                    color="secondary"
                    disabled
                />
            </div>
        </div>
    </div>
