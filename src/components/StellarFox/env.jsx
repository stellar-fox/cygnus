import React from "react"
import {
    homepage,
    version,
} from "../../../package.json"
import { timeUnit } from "@xcmats/js-toolbox"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"



// application name
export const appName = "Stellar Fox"




// application code name
export const appCodeName = "Cygnus"




// Stellar Lumen symbol
export const stellarLumenSymbol = "∅"




// application version - taken from package.json
export const appVersion = version




// active development period
export const appCopyDates = `2017-${new Date().getFullYear()}`




// application landing page link
export const appLandingPageLink = "https://stellarfox.net/"




// Session Storage application state key (ensure to change every deployment!)
export const ssAppStateKey = `StellarFox.${appVersion}`




// Session Storage save throttling time - finest possible granularity (in ms)
export const ssSaveThrottlingTime = timeUnit.second




// base URL (change if proxied to other) - taken from package.json
export const appBasePath = homepage




// DOM attach point
export const appRootDomId = "app"




// ...
export const unknownPubKeyAbbr = "XXXXXX-XXXXXX"




// ...
export const bip32Prefix = "44'/148'/"




// ...
export const snackbarAutoHideDuration = 3 * timeUnit.second




// ...
export const bankDrawerWidth = 180




// ...
export const contentPaneSeparation = 20




// ...
export const stellarFoundationLink = "https://www.stellar.org/"




// ...
export const securityGuideLink =
    "https://github.com/stellar-fox/cygnus/wiki/Security-Guide"




// ...
export const ledgerSupportLink =
    "https://support.ledgerwallet.com/hc/en-us/articles/115003797194"




// ...
export const TopBarSecurityMessage = () => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <div className={ isMobile ? "flex-box-col items-centered content-centered alert-message-flat" : "flex-box-row content-centered alert-message"}>
        <div className={isMobile ? "tiny" : ""}>
            we will <u>never</u> ask you for your secret key.
        </div>
        <div className={isMobile ? "tiny" : "p-l"}>
            please read this <a target="_blank"
                rel="noopener noreferrer"
                href={securityGuideLink}
            >
                <strong>short guide</strong>
            </a> to keep your finances secure.
        </div>
    </div>
}




// ...
export const NotImplementedBadge = () =>
    <span className="red-badge">NOT YET IMPLEMENTED</span>




// ...
export const gravatar = "https://www.gravatar.com/avatar/"




// ...
export const gravatarSize48 = "s=48"



// ...
export const gravatarSize = "s=96"




// ...
export const defaultCurrencyRateUpdateTime = 5 * timeUnit.minute




// ...
export const domain = "stellarfox.net"




// ...
export const federationEndpoint = (domain) =>
    `https://${domain}/.well-known/stellar.toml`




// ...
export const notImplementedText = [
    "Pardon the mess.",
    "We are hard at work to bring you this feature very soon.",
    "Please check back in a while as our code is being frequently deployed.",
].join(" ")




// ...
export const maximumTrustLimit = "922337203685.4775807"




// ...
export const testNetAddr = "https://horizon-testnet.stellar.org"




// ...
export const liveNetAddr = "https://horizon.stellar.org"




// ...
export const securityMsgPlaceholder = "₪₪₪₪₪₪₪₪₪₪"




// ...
export const appTLD = "stellarfox.net"




// ...
export const serviceFee = "0.00"




// ...
export const serviceFeeCurrency = "eur"




// ...
export const baseReserve = "0.5"




// ...
export const stroop = "0.0000001"




// ...
export const transactionFetchLimit = 20




// ...
export const transactionFee = 100
