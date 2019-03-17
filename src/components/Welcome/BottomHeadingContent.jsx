import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { nativeToAsset } from "../../logic/assets"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import {
    AccountBalance,
    AlarmOn,
    Email,
    Fingerprint,
    Language,
    LocationOff,
    PermContactCalendar,
    Replay,
    SettingsEthernet,
} from "@material-ui/icons"




/**
 * Cygnus.
 *
 * Renders bottom heading content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<BottomHeadingContent>` component.
 *
 * @function BottomHeadingContent
 * @returns {React.ReactElement}
 */
const BottomHeadingContent = ({ usd }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <div className={isMobile ? "flex-box-col" : "flex-box-row space-around"}>
        <div>
            <div className="col-header">True freedom</div>
            <div className="col-item">
                <AlarmOn className="heading-svg-icon" />
                Transaction settlement in seconds.
            </div>
            <div className="col-item">
                <LocationOff className="heading-svg-icon" />
                Location independent.
            </div>
            <div className="col-item">
                <Language className="heading-svg-icon" />
                Global, permissionless transacting.
            </div>
        </div>
        <div>
            <div className="col-header">
                Easy, secure transactions
            </div>
            <div className="col-item">
                <Fingerprint className="heading-svg-icon" />
                Security by design.
            </div>
            <div className="col-item">
                <PermContactCalendar className="heading-svg-icon" />
                Pay to address book contacts.
            </div>
            <div className="col-item">
                <Email className="heading-svg-icon" />
                Use email as payment address.
            </div>
        </div>
        <div>
            <div className="col-header">
                Fractional cost
            </div>
            <div className="col-item">
                <AccountBalance className="heading-svg-icon" />
                Refundable activation fee {usd} <small>USD</small>
            </div>
            <div className="col-item">
                <SettingsEthernet className="heading-svg-icon" />
                100k operations for {usd} <small>USD</small>
            </div>
            <div className="col-item">
                <Replay className="heading-svg-icon" />
                Free recurring payments.
            </div>
        </div>
    </div>
}




// ...
export default func.compose(
    connect(
        (state) => ({
            usd: nativeToAsset(
                1, state.ExchangeRates.usd.rate
            ),
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(BottomHeadingContent)
