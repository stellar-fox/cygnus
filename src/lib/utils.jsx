import React, { Fragment } from "react"
import axios from "axios"
import toml from "toml"
import { StellarSdk, fetchAccount } from "./stellar-tx"
import { env } from "../components/StellarFox"




// ...
const domainRegex = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/




// ...
export const pubKeyAbbr = (pubKey) => handleException(
    () => `${pubKey.slice(0, 6)}-${pubKey.slice(50)}`,
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
    ].map(r => r.source).join(""))
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
    ].map(r => r.source).join(""))
).test(federationAddress)




// Validates given public key (string)
// returns true/false  (valid/invalid key).
export const pubKeyValid = (pubKey) =>
    pubKey.match(/^G/)  &&
    !pubKey.match(/\*/)  &&
    pubKey.length === 56
    // TODO: && matches appropriate letter groups




// ...
export const errorMessageForInvalidPaymentAddress = (address) => {
    // Looks like something totally invalid for this field.
    if (!address.match(/\*/) && !address.match(/^G/)) {
        return "Invalid input."
    }
    // Looks like user is entering Federation Address format.
    if (address.match(/\*/) && !federationAddressValid(address)) {
        return "Invalid payment address."
    }
    // This must be an attempt at a Stellar public key format.
    if (address.match(/^G/) && !address.match(/\*/)) {
        const publicKeyValidityObj = pubKeyValidMessage(address)
        if (!publicKeyValidityObj.valid) {
            return publicKeyValidityObj.message
        }
    }
    return null
}




// Based on given 'federationAddress' (name*domain)
// returns corresponding stellar public key
export const fedToPub = async (fedAddress) =>
    (await axios.get(`${
        await endpointLookup(fedAddress)
    }?q=${fedAddress}&type=name`)).data.account_id




// Based on given 'federationAddress' (name*domain)
// returns federation server URL for that domain.
export const endpointLookup = (federationAddress) => (
    async (domain) => {
        if (domain) {
            return toml.parse(
                (await axios.get(
                    env.federationEndpoint(domain[0]))
                ).data
            ).FEDERATION_SERVER
        }
        throw new Error("Wrong address format.")
    }
)(federationAddress.match(domainRegex))




// TODO: refactor
export const pubKeyValidMessage = (pubKey) => {
    let validity = {}
    switch (true) {
        case pubKey.length < 56:
            validity = Object.assign(validity || {}, {
                valid: false,
                length: 56 - pubKey.length,
                message:
                    pubKey.length !== 0
                        ? `needs ${56 - pubKey.length} more characters`
                        : null,
            })
            break
        case pubKey.length === 56:
            try {
                StellarSdk.Keypair.fromPublicKey(pubKey)
                validity = Object.assign(validity || {}, {
                    valid: true,
                    message: null,
                })
            } catch (error) {
                validity = Object.assign(validity || {}, {
                    valid: false,
                    message: error.message,
                })
            }
            break
        default:
            break
    }
    return validity
}




// ...
export const publicKeyExists = async (publicKey) => {
    try {
        await fetchAccount(publicKey)
        return true
    } catch (ex) {
        if (ex.message  &&  ex.message.status === 404) {
            return false
        }
        throw ex
    }
}




// extracts Z from "XX'/YYY'/Z'"
export const extractPathIndex = (path) => handleException(
    () => path.match(/\/(\d{1,})'$/)[1],
    (_) => { throw new Error("Path index cannot be found.") }
)




// inserts path index substituting Z in "XX'/YYY'/Z'"
export const insertPathIndex = (index) => `${env.bip32Prefix}${index}'`




// ...
export const handleException = (fn, handler) => {
    try { return fn() }
    catch (ex) { return typeof handler === "function" ? handler(ex) : ex }
}




// ...
export const nullToUndefined = (val) => val === null ? undefined : val




// ...
export const flatten = (arr) => arr.reduce((acc, el) => acc.concat(el), [])




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




// functional replacement of 'switch' statement
export const choose = (
    key,
    actions = {},
    defaultAction = () => null,
    args = []
) =>
    key in actions ?
        actions[key](...args) :
        defaultAction(...args)




// ...
export const createReducer = (initState = {}) =>
    (actions, defaultAction = (s, _a) => s) =>
        (state = initState, action) =>
            choose(
                action.type,
                actions,
                defaultAction,
                [state, action,]
            )




// makes first letter capital (e.g. "hello" -> "Hello")
export const capitalize = (str) =>
    str.substring(0, 1).toUpperCase() + str.substring(1)




// emojis!
export const emojiString = {
    "pencil": "✎",
    "rocket": "🚀",
    "fire": "🔥",
    "love": "❤️",
    "fox": "🦊",
    "star": "⭐️",
    "stars": "✨",
    "lightning": "⚡️",
}




// emoji components (built on the 'emojiString' object base)
export const emoji = Object.keys(emojiString).reduce(
    (acc, ek) => ({
        ...acc,
        [capitalize(ek)]: () =>
            React.createElement(Fragment, null, emojiString[ek]),
    }), {}
)




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
}




// construct object from result of Object.entries() call
// entries = [[k1,v1], ... [kn, vn]]
// imitates Python's dict()
export const dict = (entries) => entries.reduce(
    (acc, [k, v,]) => Object.assign(acc, { [k]: v, }), {}
)




// when o = { a: "b", c: "d" }
// then swap(o) = { b: "a", d: "c" }
export const swap = (o) => dict(
    Object
        .entries(o)
        .map((kv) => [].concat(kv).reverse())
)




// shallowly compare two objects
export const shallowEquals = (objA, objB) => {
    if (Object.keys(objA).length !== Object.keys(objB).length)
        return false
    for (let k in objA)
        if (!(k in objB) || objA[k] !== objB[k])
            return false
    return true
}
