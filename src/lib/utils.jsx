import React, { Fragment } from "react"
import axios from "axios"
import toml from "toml"
import {
    capitalize,
    emptyString,
    handleException,
    head,
    isString,
    objectMap,
    parMap,
    wrap,
} from "@xcmats/js-toolbox"
import MD5 from "../lib/md5"
import shajs from "sha.js"
import BigNumber from "bignumber.js"
import { loadAccount } from "../lib/stellar-tx"
import { env } from "../components/StellarFox"
import { config } from "../config"




// FIXME
// when using:
//    import StellarSdk from "stellar-sdk"
// or
//    import { Network, Server, ... } from "stellar-sdk"
// a following error occurs:
//     Error: XDR Error:AccountId is already defined
export const StellarSdk = window.StellarSdk





// ...
const domainRegex = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/




// ...
export const ntoes = (input) => isString(input)  ?  input  :  emptyString()




// ...
export const findContactByPublicKey = (contacts, publicKey) => contacts.find(
    (c) => c.pubkey === publicKey
)



// ...
export const formatFullName = (firstName, lastName) => (
    firstName && lastName ?
        `${firstName} ${lastName}`  :
        firstName ? firstName   :
            lastName ? lastName : "No Name"
)




// ...
export const formatPaymentAddress = (alias, domain) => (
    alias && domain ?
        `${alias}*${domain}` : "-"
)




// ...
export const formatMemo = (memoType, memo) => (
    memoType && memo ? memo :  "-"
)




// ...
export const getRegisteredUser = async (publicKey, bip32Path) => {
    if (publicKey && bip32Path) {
        try {
            return await axios.post(
                `${config.api}/user/ledgerauth/${publicKey}/${bip32Path}`
            )
        } catch (e) {
            return Promise.reject({ error: e.message, })
        }
    }
}




// ...
export const getUserExternalContacts = async (userId, token) => {
    try {
        return (await axios.post(`${config.apiV2}/contacts/list/federated/`, {
            user_id: userId,
            token,
        })).data
    } catch (_e) {
        return null
    }
}




// ...
export const changeContactStatus = async (
    userId, token, status, requested_by
) => {
    try {
        return await axios.post(`${config.api}/contact/update/`, {
            user_id: userId,
            token,
            status,
            contact_id: userId,
            requested_by,
        })
    } catch (_e) {
        return null
    }
}




// ...
export const findContact = (contacts, id, external = false) =>
    contacts.find((c) => external ? id === c.id : id === c.contact_id)




// ...
export const getUserData = async (id, token) => {
    try {
        return (
            await axios.post(`${config.api}/user/`, { user_id: id, token, })
        ).data.data
    } catch (_e) {
        return null
    }
}




// ...
export const resubmitFundingTx = async (userId, token, chargeData) => {
    try {
        return await axios.post(`${config.apiV2}/account/resubmit-fund/`,
            { user_id: userId, token, chargeData, })
    } catch (e) {
        throw new Error(e.message)
    }
}




// ...
export const pubKeyAbbr = (pubKey) => handleException(
    () => `${pubKey.slice(0, 6)}-${pubKey.slice(50)}`,
    (_) => { throw new Error("Malformed key.") }
)




// ...
export const pubKeyAbbrLedgerHQ = (pubKey) => handleException(
    () => `${pubKey.slice(0, 12)}-${pubKey.slice(44)}`,
    (_) => { throw new Error("Malformed key.") }
)




// ...
export const utcToLocaleDateTime = (utcDateTime, includeTime = true) => (
    (date) =>
        includeTime ?
            `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` :
            date.toLocaleDateString()
)(utcDateTime ? new Date(utcDateTime) : new Date())




// ...
export const emailValid = (email) => !!(
    new RegExp([
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))/,
        /@/,
        domainRegex,
    ].map(r => r.source).join(emptyString()))
).test(email)




// ...
export const passwordValid = (password) => !!/^.{8,}$/.test(password)




// ...
export const federationIsAliasOnly = (federationAddress) =>
    !!/^[a-zA-Z\-0-9.@][^*]+$/.test(federationAddress)




// ...
export const federationAddressValid = (federationAddress) => !!(
    new RegExp([
        /^[a-zA-Z\-0-9.@]+\*/,
        domainRegex,
    ].map(r => r.source).join(emptyString()))
).test(federationAddress)




// ...
export const paymentAddress = (alias, domain) => (
    federationAddressValid(`${alias}*${domain}`)  ?
        `${alias}*${domain}`  :
        emptyString()
)




// ...
export const toAliasAndDomain = (paymentAddress) => paymentAddress.split("*")




// Validates given public key (string)
// returns true/false  (valid/invalid key).
export const publicKeyValid = (publicKey) =>
    StellarSdk.StrKey.isValidEd25519PublicKey(publicKey)




// ...
export const invalidPaymentAddressMessage = (address) => {
    // Valid federation address. Return empty string for error message.
    if (federationAddressValid(address)) {
        return emptyString()
    }
    // Valid public key. Return empty string for error message.
    if (publicKeyValid(address)) {
        return emptyString()
    }
    // Looks like something totally invalid for this field.
    if (!address.match(/\*/) && !address.match(/^G/)) {
        return "Invalid input."
    }
    // Looks like user is entering Federation Address format.
    if (address.match(/\*/) && !federationAddressValid(address)) {
        return "Invalid payment address."
    }
    // This must be an attempt at a Stellar public key format.
    if (!publicKeyValid(address)) {
        if (address.length < 56) {
            return publicKeyMissingCharsMessage(address)
        } else if (address.length === 56) {
            return "Invalid checksum."
        } else {
            return "Invalid key."
        }
    }
}




// ...
export const invalidFederationAddressMessage = (address) => {
    // Looks like something totally invalid for this field.
    if (address && !address.match(/\*/)) {
        return "Invalid input."
    }
    // Looks like user is entering Federation Address format.
    if (address && address.match(/\*/) && !federationAddressValid(address)) {
        return "Invalid payment address."
    }
    return emptyString()
}




// ...
export const publicKeyMissingCharsMessage = (publicKey) =>
    `Needs ${(56 - publicKey.length)} more characters.`




// Based on given 'federationAddress' (name*domain)
// returns corresponding stellar public key
export const fedToPub = async (fedAddress) =>
    (await axios.get(`${
        await endpointLookup(fedAddress)
    }?q=${fedAddress}&type=name`)).data.account_id




// ...
export const getFederationRecord = async (fedAddress) =>
    (await axios.get(`${
        await endpointLookup(fedAddress)
    }?q=${fedAddress}&type=name`)).data




// Based on given 'federationAddress' (name*domain)
// returns federation server URL for that domain.
export const endpointLookup = (federationAddress) => (
    async (domain) => {
        if (domain) {
            return toml.parse(
                (await axios.get(
                    env.federationEndpoint(head(domain)))
                ).data
            ).FEDERATION_SERVER
        }
        throw new Error("Wrong address format.")
    }
)(federationAddress.match(domainRegex))




// Lookup asset information in stellar.toml located at specified domain
export const assetLookup = async (domain) =>
    toml.parse(
        (await axios.get(
            env.federationEndpoint(domain))
        ).data
    ).CURRENCIES




// ...
export const augmentAssets = (assets, horizon) =>
    parMap(
        assets,
        (asset) => assetAvatar(asset, horizon)
    )
        .then(
            (results) => {
                return results.map((r) => {
                    let assetToUpdate = assets.find((a) =>
                        a.asset_code === r.asset_code
                    )
                    assetToUpdate["avatar"] = r.avatar
                    assetToUpdate["decimals"] = r.decimals
                    assetToUpdate["verified"] = r.verified
                    return assetToUpdate
                })
            }
        )




// ...
export const assetAvatar = async (asset, horizon) => {
    let issuingAccount = await loadAccount(
        asset.asset_issuer, horizon
    )

    if (issuingAccount.home_domain) {
        const assetInfo = await assetLookup(issuingAccount.home_domain)
        if (assetInfo) {
            const assetIssuerInfo = assetInfo.find(
                (a) => a.code === asset.asset_code
            )
            return {
                asset_code: asset.asset_code,
                avatar: assetIssuerInfo ?
                    assetIssuerInfo.image :
                    `https://www.gravatar.com/avatar/${MD5(
                        asset.asset_issuer
                    )}?s=42&d=identicon`,
                decimals: assetIssuerInfo ?
                    assetIssuerInfo.display_decimals : 7,
                verified: assetIssuerInfo ? true : false,
            }
        }
    } else {
        return {
            asset_code: asset.asset_code,
            avatar: `https://www.gravatar.com/avatar/${MD5(
                asset.asset_issuer
            )}?s=42&d=identicon`,
            decimals: 7,
            verified: false,
        }
    }
}




// extracts Z from "XX'/YYY'/Z'"
export const extractPathIndex = (path) => handleException(
    () => path.match(/\/(\d{1,})'$/)[1],
    (_) => { throw new Error("Path index cannot be found.") }
)




// inserts path index substituting Z in "XX'/YYY'/Z'"
export const insertPathIndex = (index) => `${env.bip32Prefix}${index}'`




// declarative conditional rendering in JSX
export const ConditionalRender = (props) => (
    (cn) => Array.isArray(cn) ?
        cn.filter((c) => c.props.display) :
        cn.props.display ? cn : null
)(props.children)




// React.Fragment can only receive 'key' and 'children' as props, so...
export const RenderGroup = ({ children, }) => children




// ...
export const Null = () => null




// inject props "p" into component "C"
export const inject = (C, p) => (props) => <C {...{ ...props, ...p, }} />




// provide props into all children components (non-recursive)
export const Provide = ({ children, ...rest }) =>
    React.Children.map(
        children,
        (child) => child ? React.cloneElement(child, rest) : child
    )




// emojis!
export const emojiDB = {
    "beer": "🍺",
    "bomb": "💣",
    "boom": "💥",
    "cancel": "❌",
    "check": "✔️",
    "crazy": "🤪",
    "fire": "🔥",
    "fist": "👊",
    "fox": "🦊",
    "ghost": "👻",
    "glad": "😊",
    "happy": "😃",
    "lightning": "⚡️",
    "love": "❤️",
    "music": "🎶",
    "nerd": "🤓",
    "pizza": "🍕",
    "pencil": "✎",
    "rocket": "🚀",
    "rotfl": "😂",
    "smile": "☺️",
    "star": "⭐️",
    "stars": "✨",
    "strong": "💪",
    "wink": "😉",
}




// emoji components (built on the 'emojiDB' object base)
export const emoji = objectMap(emojiDB,
    ([k, v,]) => [
        capitalize(k),
        () => React.createElement(Fragment, null, v),
    ]
)




// construct emoji string based on given emoji names
export const emojis = (...args) =>
    args.map((en) => emojiDB[en]).join(emptyString())




// construct string with all emojis from emojiDB
export const allEmojis = () => emojis(...Object.keys(emojiDB))




// commonly-used HTML entities
export const htmlEntities = {

    // https://www.fileformat.info/info/unicode/char/2212/index.htm
    //
    // Minus: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0x2212)
    // ),
    Minus: () => <Fragment>&#x2212;</Fragment>,

    // https://www.fileformat.info/info/unicode/char/2b/index.htm
    //
    // Plus: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0x2B)
    // ),
    Plus: () => <Fragment>&#x2B;</Fragment>,

    // https://www.fileformat.info/info/unicode/char/20/index.htm
    //
    // Space: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0x20)
    // ),
    Space: () => <Fragment>{" "}</Fragment>,

    // https://www.fileformat.info/info/unicode/char/a0/index.htm
    //
    // Nbsp: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0xA0)
    // ),
    Nbsp: () => <Fragment>&nbsp;</Fragment>,

    // https://www.fileformat.info/info/unicode/char/a9/index.htm
    //
    // Copy: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0xA9)
    // ),
    Copy: () => <Fragment>&copy;</Fragment>,

    // https://www.fileformat.info/info/unicode/char/27/index.htm
    // Apos: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0x27)
    // ),
    Apos: () => <Fragment>&apos;</Fragment>,

    // https://www.fileformat.info/info/unicode/char/2713/index.htm
    // Apos: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0x2713)
    // ),
    Check: () => <Fragment>&#10003;</Fragment>,

    // ...
    SL: () => <Fragment>𝕊𝕃</Fragment>,

}




// shallowly compare two objects
export const shallowEquals = (objA, objB) => {
    if (Object.keys(objA).length !== Object.keys(objB).length)
        return false
    for (let k in objA)
        if (!(k in objB) || objA[k] !== objB[k])
            return false
    return true
}




// determine runtime environment
// devEnv() -> true/false
export const devEnv = () =>
    Object.prototype.hasOwnProperty.call(sessionStorage, "dev")  ||
    // eslint-disable-next-line
    process.env.NODE_ENV !== "production"




// asynchronously load libraries (used in dev. environment)
export const dynamicImportLibs = async () => {
    let [
        StellarFox, apiAccount, apiContacts,
        bignumber, jss, ledger, lodash, md5, mui,
        redshift, redux,
        StellarTx,
        toolbox, utils,
    ] = await Promise.all([
        import("../../src/components/StellarFox"),
        import("../../src/components/Account/api"),
        import("../../src/components/Contacts/api"),
        import("bignumber.js"),
        import("jss"),
        import("./ledger"),
        import("lodash"),
        import("./md5"),
        import("@material-ui/core"),
        import("@stellar-fox/redshift"),
        import("redux"),
        import("../lib/stellar-tx"),
        import("@xcmats/js-toolbox"),
        import("./utils"),
    ])
    return {
        api: {
            account: apiAccount,
            contacts: apiContacts,
            firebase: StellarFox.firebaseApp,
        },
        axios,
        BigNumber: bignumber.default,
        jss, ledger, lodash, md5: md5.default, mui,
        redshift, redux,
        StellarSdk, StellarTx,
        toolbox, utils,
    }
}




// asynchronously load reducers (used in dev. environment)
export const dynamicImportReducers = async () => {
    let [
        Account, Alert, AssetManager, Balances, Bank,
        LedgerHQ, LoadingModal, LoginManager, Modal, Payments,
        Snackbar, StellarAccount, StellarRouter,
    ] = await Promise.all([
        import("../redux/Account"),
        import("../redux/Alert"),
        import("../redux/AssetManager"),
        import("../redux/Balances"),
        import("../redux/Bank"),
        import("../redux/LedgerHQ"),
        import("../redux/LoadingModal"),
        import("../redux/LoginManager"),
        import("../redux/Modal"),
        import("../redux/Payments"),
        import("../redux/Snackbar"),
        import("../redux/StellarAccount"),
        import("../redux/StellarRouter"),
    ])
    return {
        Account, Alert, AssetManager, Balances, Bank,
        LedgerHQ, LoadingModal, LoginManager, Modal, Payments,
        Snackbar, StellarAccount, StellarRouter,
    }
}




// ...
export const dataDigest = (dataObj) =>
    shajs("sha256").update(
        Object.values(dataObj).map(
            (v) =>
                shajs("sha256")
                    .update(ntoes(v))
                    .digest("hex")
        ).join()
    ).digest("hex")




// ...
export const signatureValid = (dataObj, signature) =>
    dataDigest(dataObj) === atob(signature)




// ...
export const currentAccountReserve = (accountSubentries) => {
    BigNumber.config({ DECIMAL_PLACES: 1, ROUNDING_MODE: 4, })
    const baseReserve = new BigNumber(env.baseReserve)
    return baseReserve.times(2 + parseInt(accountSubentries, 10)).toFixed(2)
}




// ...
export const accountIsLocked = (signers, publicKey) => {
    let ownerAccount = signers.find((s) => s.public_key === publicKey)
    return ownerAccount && ownerAccount.weight === 0
}




// ...
export const sortBy = (attr="first_name") => (a, b) => {
    let nameA = emptyString(), nameB = emptyString()

    if (a[attr]) { nameA = a[attr].toUpperCase() }
    if (b[attr]) { nameB = b[attr].toUpperCase() }

    if (nameA < nameB) { return -1 }
    if (nameA > nameB) { return 1 }

    return 0
}




// little helper for JSS urls
export const url = (x) => wrap(x, "url(", ")")




// little helper for JSS colors
export const rgb = (r, g, b) =>
    wrap([r, g, b,].join(", "), "rgb(", ")")




// little helper for JSS colors with alpha
export const rgba = (r, g, b, a) =>
    wrap([r, g, b, a,].join(", "), "rgba(", ")")
