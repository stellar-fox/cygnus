import React, { Fragment } from "react"
import axios from "axios"
import toml from "toml"
import {
    array,
    func,
    handleException,
    handleRejection,
    head,
    objectMap,
    parMap,
    string,
    type,
} from "@xcmats/js-toolbox"
import {
    Asset,
    Keypair,
    Memo,
    Network,
    Networks,
    Operation,
    Server,
    StrKey,
    Transaction,
    TransactionBuilder,
} from "stellar-sdk"
import MD5 from "../lib/md5"
import shajs from "sha.js"
import BigNumber from "bignumber.js"
import { loadAccount } from "../lib/stellar-tx"
import { env } from "../components/StellarFox"
import { config } from "../config"
import numberToText from "number-to-text"




/**
 * Holds regular expression used to check the validity of the domain format.
 */
const domainRegex = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/




// ...
export const ntoes = (input) => type.isString(input)  ?  input  :  string.empty()




// ...
export const findContactByPublicKey = (contacts, publicKey) =>
    contacts.find((c) => c.pubkey === publicKey)




// ...
export const formatFullName = (firstName, lastName) => (
    firstName && lastName  ?
        `${firstName} ${lastName}`  :
        firstName  ?
            firstName  :
            lastName  ?
                lastName  :
                "No Name"
)




// ...
export const formatPaymentAddress = (alias, domain) => (
    alias && domain  ?
        `${alias}*${domain}`  :  "-"
)




// ...
export const formatMemo = (memoType, memo) => (
    memoType && memo  ?  memo  :  "-"
)




// ...
export const getRegisteredUser = async (publicKey, bip32Path) => {
    if (publicKey  &&  bip32Path) {
        return await axios.post(
            `${config.api}/user/ledgerauth/${publicKey}/${bip32Path}`
        )
    } else {
        throw new Error("[publicKey && bip32Path] condition not met.")
    }
}




// ...
export const getUserExternalContacts = async (userId, token) => {
    try {
        return (
            await axios.post(`${config.apiV2}/contacts/list/federated/`, {
                user_id: userId,
                token,
            })
        ).data
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
            await axios.post(`${config.api}/user/`, {
                user_id: id, token,
            })
        ).data.data
    } catch (_e) {
        return null
    }
}




// ...
export const resubmitFundingTx = async (userId, token, chargeData) => {
    try {
        return await axios.post(`${config.apiV2}/account/resubmit-fund/`, {
            user_id: userId, token, chargeData,
        })
    } catch (e) {
        throw new Error(e.message)
    }
}




// ...
export const amountToText = (amount) => {
    const grouped = amount.match(
        /^(\d+)([.](\d{1,2}))?$/
    )
    // amount with fractions case
    if (grouped[3]) {
        return `${numberToText.convertToText(grouped[1])} and ${
            grouped[3]}/100`
    }
    // whole amount case
    else if (grouped[1] && !grouped[2]) {
        return numberToText.convertToText(grouped[1])
    }
}




// ...
export const pubKeyAbbr = (pubKey) => handleException(
    () => `${pubKey.slice(0, 6)}-${pubKey.slice(50)}`,
    (_) => { throw new Error("Malformed key.") }
)




// ...
export const pubKeyAbbrLedgerHQ = (pubKey) => handleException(
    () => `${pubKey.slice(0, 12)}..${pubKey.slice(44)}`,
    (_) => { throw new Error("Malformed key.") }
)




// ...
export const utcToLocaleDateTime = (utcDateTime, includeTime = true) => (
    (date) => {
        const options = {
            localeMatcher: "best fit",
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        }

        if (includeTime) {
            options.hour = "numeric"
            options.minute = "numeric"
            options.second = "numeric"
        }

        return date.toLocaleDateString(undefined, options)
    }
)(utcDateTime ? new Date(utcDateTime) : new Date())




/**
 * Checks the validity of email address format.
 *
 * @param {String} email
 * @returns {Boolean}
 */
export const emailValid = (email) => type.toBool((
    new RegExp([
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))/,
        /@/,
        domainRegex,
    ].map(r => r.source).join(string.empty()))
).test(email))




/**
 * Checks the validity of a given password.
 *
 * @param {String} password
 * @returns {Boolean}
 */
export const passwordValid = (password) =>
    type.toBool(/^.{8,}$/.test(password))




// ...
export const federationIsAliasOnly = (federationAddress) =>
    type.toBool(/^[a-zA-Z\-0-9.@][^*]+$/.test(federationAddress))




// ...
export const federationAddressValid = (federationAddress) => type.toBool((
    new RegExp([
        /^[a-zA-Z\-0-9.@]+\*/,
        domainRegex,
    ].map(r => r.source).join(string.empty()))
).test(federationAddress))




// ...
export const paymentAddress = (alias, domain) => (
    federationAddressValid(`${alias}*${domain}`)  ?
        `${alias}*${domain}`  :
        string.empty()
)




// ...
export const toAliasAndDomain = (paymentAddress) => paymentAddress.split("*")




// Validates given public key (string)
// returns true/false  (valid/invalid key).
export const publicKeyValid = (publicKey) =>
    StrKey.isValidEd25519PublicKey(publicKey)




// ...
export const invalidPaymentAddressMessage = (address) => {
    // Valid federation address. Return empty string for error message.
    if (federationAddressValid(address)) {
        return string.empty()
    }
    // Valid public key. Return empty string for error message.
    if (publicKeyValid(address)) {
        return string.empty()
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
    return string.empty()
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
export const RenderGroup = ({ children }) => children




// ...
export const Null = () => null




// inject props "p" into component "C"
export const inject = (C, p) => (props) => <C {...{ ...props, ...p }} />




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




// ...
export const glyphsDB = {
    "ellipsis": "…",
}




// emoji components (built on the 'emojiDB' object base)
export const emoji = objectMap(emojiDB,
    ([k, v]) => [
        string.capitalize(k),
        () => React.createElement(Fragment, null, v),
    ]
)




// construct emoji string based on given emoji names
export const emojis = (...args) =>
    args.map((en) => emojiDB[en]).join(string.empty())




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




// asynchronously load libraries (used in dev. environment)
export const dynamicImportLibs = async () => {
    let [
        StellarFox, apiAccount, apiContacts,
        bignumber, jss, ledger, lodash, md5, mui,
        redshift, redux,
        stellar, StellarTx,
        toolbox, utils, payments, server,
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
        import("stellar-sdk"),
        import("../lib/stellar-tx"),
        import("@xcmats/js-toolbox"),
        import("./utils"),
        import("./stellar/payments"),
        import("./stellar/server"),
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
        stellar, StellarTx,
        toolbox, utils, payments, server,
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
    BigNumber.config({ DECIMAL_PLACES: 1, ROUNDING_MODE: 4 })
    const baseReserve = new BigNumber(env.baseReserve)
    return baseReserve.times(2 + parseInt(accountSubentries, 10)).toFixed(2)
}




// ...
export const accountIsLocked = (signers, publicKey) => {
    if (signers) {
        let ownerAccount = signers.find((s) => s.public_key === publicKey)
        return ownerAccount && ownerAccount.weight === 0
    }
    return false
}




// ...
export const sortBy = (attr = "first_name") => (a, b) => {
    let nameA = string.empty(), nameB = string.empty()

    if (a[attr]) { nameA = a[attr].toUpperCase() }
    if (b[attr]) { nameB = b[attr].toUpperCase() }

    if (nameA < nameB) { return -1 }
    if (nameA > nameB) { return 1 }

    return 0
}




// little helper for JSS urls
export const url = (x) => string.wrap(x, "url(", ")")




// little helper for JSS colors
export const rgb = (r, g, b) =>
    string.wrap([r, g, b].join(", "), "rgb(", ")")




// little helper for JSS colors with alpha
export const rgba = (r, g, b, a) =>
    string.wrap([r, g, b, a].join(", "), "rgba(", ")")




// display transaction fee as XLM fraction
export const calculateTxFee = (opsNum) => {
    BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4 })
    return (`${new BigNumber(env.transactionFee).times(opsNum)
        .dividedBy(10000000).toString()} XLM`)
}




// display sequence number for the next/current??? transaction
export const nextSequenceNumber = (sequenceNumber) =>
    new BigNumber(sequenceNumber).plus(1).toString()




// dev. only (!)
// shambhala.client integration testing
//
// this is almost exact copy of shambhala/src/host/index.js:testPieces
// with some minor tweaks related to cygnus weirdness/heritage...
export const shambhala = (() => {

    let
        context = {},
        that = { scenario: {} }


    // eslint-disable-next-line no-console
    that.log = console.log


    // dynamically import client library
    that.importClient = async () => {

        if (!type.toBool(context.Shambhala)) {
            that.log("Importing...")
            context.Shambhala = (await import("./shambhala.client")).default
            if (type.isObject(window.sf)) {
                window.sf.Shambhala = context.Shambhala
            }
        }

        that.log("Shambhala client library imported.")

    }


    // instantiate client
    that.instantiate = async (
        url = "https://secrets.localhost/shambhala/shambhala.html"
    ) => {

        await that.importClient()

        if (!type.isObject(context.shambhala)) {
            context.shambhala = new context.Shambhala(url)
            context.shambhalaUrl = url
            if (type.isObject(window.sf)) {
                window.sf.shambhala = context.shambhala
                window.sf.shambhalaContext = context
            }
        }

        that.log(`Instance pointing to ${string.quote(url)} created.`)

    }


    // choose network and _stellar_ horizon server
    that.setEnv = async ({
        network = Networks.TESTNET,
        horizonUrl = "https://horizon-testnet.stellar.org/",
    } = {}) => {

        Network.use(new Network(network))
        context.network = network

        context.server = new Server(horizonUrl)
        context.horizonUrl = horizonUrl

        that.log(`Network: ${string.quote(network)}`)
        that.log(` Server: ${horizonUrl}`)

    }


    // address generation
    // https://bit.ly/shambhalagenaccount
    that.generateAddress = async () => {

        that.log("Requesting address generation...")

        context.G_PUBLIC = await context.shambhala.generateAddress()

        that.log("Got it:", context.G_PUBLIC)
        return context.G_PUBLIC

    }


    // signing keys generation
    // https://bit.ly/shambhalagensig
    that.generateSigningKeys = async (G_PUBLIC = context.G_PUBLIC) => {

        that.log("Requesting signing keys generation...")

        let { C_PUBLIC, S_PUBLIC } =
            await context.shambhala.generateSigningKeys(G_PUBLIC)
        context.C_PUBLIC = C_PUBLIC
        context.S_PUBLIC = S_PUBLIC

        that.log(
            "Got them:",
            string.shorten(C_PUBLIC, 11),
            string.shorten(S_PUBLIC, 11)
        )
        return context.keys

    }


    // account creation, initial funding
    // and finding sequence number
    // http://bit.ly/stellarseqnumber
    that.createAccountOnLedger = async (G_PUBLIC = context.G_PUBLIC) => {

        that.log("Requesting account generation and initial funds...")

        let friendbotResponse =
            await axios.get("https://friendbot.stellar.org/", {
                params: { addr: G_PUBLIC },
            })

        that.log(
            "Got it:",
            func.compose(
                string.quote,
                (op) => `${op.type}: ${op.startingBalance} XLM`,
                (tx) => tx.operations[0],
                (xdr64) => new Transaction(xdr64)
            )(friendbotResponse.data.envelope_xdr)
        )

        that.log("Getting account sequence...")

        context.account = await context.server.loadAccount(G_PUBLIC)
        context.sequence = context.account.sequenceNumber()

        that.log("It's:", string.quote(context.sequence))

        return context.account

    }


    // automatic keys association
    // http://bit.ly/shambhalaautokeyassoc
    that.generateSignedKeyAssocTX = async (
        G_PUBLIC = context.G_PUBLIC,
        sequence = context.sequence,
        network = context.network
    ) => {

        that.log("Requesting transaction associating keys with account...")

        context.tx = await context.shambhala.generateSignedKeyAssocTX(
            G_PUBLIC, sequence, network
        )

        that.log(
            "It came:",
            func.compose(
                string.quote,
                (opTypes) => opTypes.join(string.space()),
                (ops) => ops.map((op) => op.type)
            )(context.tx.operations)
        )
        return context.tx

    }


    // send transaction to the network
    // https://bit.ly/stellarsubmittx
    that.submitTransaction = async (tx = context.tx) => {

        that.log("Sending transaction to the stellar network.")

        await context.server.submitTransaction(tx)

        that.log("Sent.")

    }


    // build transaction sending >>value<< from `source` to `destination`
    // if `destination` doesn't exists it'll be created
    that.transferMoney = async (
        source, destination, amount,
        memoText = "https://bit.ly/shambhalasrc"
    ) => {

        that.log(
            "Building test transaction:\n",
            "[",
            string.quote(string.shorten(source, 11)),
            "->",
            string.quote(string.shorten(destination, 11)),
            "],",
            `amount: ${amount} XLM,`,
            `memo: ${string.quote(memoText)}`
        )

        let
            // try loading `sourceAccount`
            // if it doesn't exist - let the exception propagate out
            // as nothing can be done in such case
            sourceAccount = await context.server.loadAccount(source),

            // try loading `destinationAccount`, but handle
            // the eventual rejection - if there is no `destination`
            // then it shall be created,
            // so `destinationAccount` can be set to null
            destinationAccount = await handleRejection(
                context.server.loadAccount.bind(context.server, destination),
                () => null
            ),

            tx = func.compose(

                // build the transaction
                (tb) => tb.build(),

                // add memo
                (tb) => tb.addMemo(Memo.text(memoText)),

                destinationAccount ?

                    // if `destination` exists - create payment
                    (tb) => tb.addOperation(Operation.payment({
                        destination,
                        asset: Asset.native(),
                        amount: String(amount),
                    })) :

                    // if `destination` doesn't exist - create account
                    (tb) => tb.addOperation(Operation.createAccount({
                        destination,
                        startingBalance: String(amount),
                    }))

            )(new TransactionBuilder(sourceAccount))

        context.tx = tx
        that.log("Transaction built.")

        return tx

    }


    // sign the transaction `tx` on behalf of an `accountId`
    // https://bit.ly/shambhalasigning
    that.sign = async (accountId = context.G_PUBLIC, tx = context.tx) => {

        that.log("Request transaction to be signed by shambhala.")

        await context.shambhala.signTransaction(accountId, tx)

        that.log("Success!")

    }


    // backup (test)
    that.backup = async (G_PUBLIC = context.G_PUBLIC) => {

        that.log(`Requesting encrypted backup for ${G_PUBLIC}.`)

        context.backup = await context.shambhala.backup(G_PUBLIC)

        that.log("Here it is:", context.backup)

    }


    // restore (test)
    that.restore = async (
        G_PUBLIC = context.G_PUBLIC,
        backup = context.backup
    ) => {

        that.log(`Trying to restore backup for ${G_PUBLIC}.`)

        await context.shambhala.restore(
            G_PUBLIC, backup
        )

        that.log("All good.")

    }


    // ...
    that.scenario.accountCreation = async () => {

        that.log("Account Creation Test BEGIN")
        // eslint-disable-next-line no-console
        console.time("Account Creation")

        await that.instantiate()
        await that.setEnv()
        await that.generateAddress()
        await that.generateSigningKeys()
        await that.createAccountOnLedger()
        await that.generateSignedKeyAssocTX()
        await that.submitTransaction()

        // eslint-disable-next-line no-console
        console.timeEnd("Account Creation")
        that.log("Account Creation Test END")
        return context

    }


    // ...
    that.scenario.backupRestore = async () => {

        that.log("Backup-Restore Test BEGIN")
        // eslint-disable-next-line no-console
        console.time("Backup-Restore")

        await that.instantiate()
        await that.setEnv()
        await that.backup()
        await that.restore()

        // eslint-disable-next-line no-console
        console.timeEnd("Backup-Restore")
        that.log("Backup-Restore Test END")
        return context

    }


    // ...
    that.scenario.wasteSomeMoney = async (
        source = context.G_PUBLIC,
        destination = null,
        amount = null,
        memoText = "https://bit.ly/cygnussrc"
    ) => {

        that.log("Transaction-Signing Test BEGIN")
        // eslint-disable-next-line no-console
        console.time("Transaction-Signing")

        let randomDestination = null

        if (!destination) {
            randomDestination = Keypair.random()
            that.log("Using some random, ad-hoc generated destination.")
        }

        await that.instantiate()
        await that.setEnv()
        await that.transferMoney(
            source,
            destination || randomDestination.publicKey(),
            amount || array.head(array.sparse(10, 100, 1)),
            memoText
        )
        await that.sign(source)
        await that.submitTransaction()

        if (!destination) {
            that.log(
                "Here's destination SECRET:",
                randomDestination.secret()
            )
        }

        // eslint-disable-next-line no-console
        console.timeEnd("Transaction-Signing")
        that.log("Transaction-Signing Test END")
        return context

    }

    return Object.freeze(that)

})()
