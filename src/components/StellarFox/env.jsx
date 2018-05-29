import React from "react"
import {
    homepage,
    version,
} from "../../../package.json"




// application name
export const appName = "Stellar Fox"




// application version (taken from package.json)
export const appVersion = version




// active development period
export const appCopyDates = "2017-2018"




// application landing page link (taken from package.json)
export const appLandingPageLink = homepage




// Session Storage application state key (ensure to change every deployment!)
export const ssAppStateKey = `StellarFox.${appVersion}`




// Session Storage save throttling time - finest possible granularity (in ms)
export const ssSaveThrottlingTime = 1000




// base URL (change if proxied to other)
export const appBasePath = "/"




// DOM attach point
export const appRootDomId = "app"




// ...
export const unknownPubKeyAbbr = "XXXXXX-XXXXXX"




// ...
export const bip32Prefix = "44'/148'/"




// ...
export const snackbarAutoHideDuration = 3100




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
export const TopBarSecurityMessage = () =>
    <div className="alert-message">
        <span>we will <u>never</u> ask you for your secret key.</span>
        &nbsp;&nbsp;
        <span>
            please read this <a target="_blank"
                rel="noopener noreferrer"
                href={securityGuideLink}
            >
                <strong>short guide</strong>
            </a> to keep your finances secure.
        </span>
    </div>




// ...
export const NotImplementedBadge = () =>
    <span className="red-badge">NOT IMPLEMENTED YET</span>




// ...
export const gravatar = "https://www.gravatar.com/avatar/"




// ...
export const gravatarSize48 = "s=48"



// ...
export const gravatarSize = "s=96"




// ...
export const defaultCurrencyRateUpdateTime = 300000




// ...
export const federationEndpoint = (domain) =>
    `https://${domain}/.well-known/stellar.toml`




// ...
export const minimumAccountReserve = 1




// ...
export const minimumReserveMessage =
    `Minimum reserve of ${minimumAccountReserve} required.`




// ...
export const notImplementedText = [
    "Pardon the mess.",
    "We are hard at work to bring you this feature very soon.",
    "Please check back in a while as our code is being frequently deployed.",
].join(" ")




// ...
export const maximumTrustLimit = "922337203685.4775807"




// ...
export const testNetAddr = "https://horizon-testnet.stellar.org/"




// ...
export const liveNetAddr = "https://horizon.stellar.org/"




// ...
export const securityMsgPlaceholder = "₪₪₪₪₪₪₪₪₪₪"




// ...
export const tos = appBasePath + "tos.txt"




// ...
export const privacy = appBasePath + "privacy.txt"




// ...
export const stellarFoxDomain = "stellarfox.net"