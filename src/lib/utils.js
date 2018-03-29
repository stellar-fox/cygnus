import React from "react"
import axios from "axios"
import toml from "toml"
import { bip32Prefix } from "../components/StellarFox/env"


// TODO: convert-to/use-as module
export const StellarSdk = window.StellarSdk


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
export const getAssetCode = (asset) =>
    asset.asset_type === "native" ? "XLM" : asset.asset_code


// ...
export const formatAmount = (amount, precision = 2) =>
    Number.parseFloat(amount).toFixed(precision)


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


// ...
export const federationLookup = (federationAddress) => (
    (federationDomain) =>
        federationDomain ?
            axios
                .get(`https://${federationDomain[0]}/.well-known/stellar.toml`)
                .then((response) => ({
                    ok: true,
                    endpoint: toml.parse(response.data).FEDERATION_SERVER,
                })) :
            // in case of failure - return rejected promise with error description
            Promise.reject(new Error("Federation address domain not found..."))
)(federationAddress.match(domainRegex))


// ...
export const pubKeyValid = (pubKey) => {
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


// extracts Z from "XX'/YYY'/Z'"
export const extractPathIndex = (path) => handleException(
    () => path.match(/\/(\d{1,})'$/)[1],
    (_) => { throw new Error("Path index cannot be found.") }
)


// inserts path index substituting Z in "XX'/YYY'/Z'"
export const insertPathIndex = (index) => `${bip32Prefix}${index}'`


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
export const RenderGroup = (props) => props.children


// inject props "p" into component "C"
export const inject = (C, p) => (props) => <C {...{ ...props, ...p, }} />


// provide props into all children components
export const Provide = ({ children, ...rest }) =>
    React.Children.map(
        children,
        (child) => child ? React.cloneElement(child, rest) : child
    )


// ...
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
export const createReducer = (initState = {}) => (actions) =>
    (state = initState, action) =>
        choose(
            action.type,
            actions,
            (s, _a) => s,
            [state, action,]
        )


// ...
export const currencyGlyph = (currency) => (
    (c) => c[currency]
)({
    eur: "€",
    usd: "$",
    aud: "$",
    nzd: "$",
    thb: "฿",
    pln: "zł",
})
