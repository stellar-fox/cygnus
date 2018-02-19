import axios from "axios"
import toml from "toml"


// TODO: convert-to/use-as module
export const StellarSdk = window.StellarSdk


// ...
const domainRegex = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


// ...
export const pubKeyAbbr = (pubKey) =>
    `${pubKey.slice(0, 6)}-${pubKey.slice(50)}`


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
export const passwordsMatch = (pass1, pass2) => pass1 === pass2


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


// ...
export const extractPathIndex = (path) => {
    const pathIndex = path.match(/\/(\d{1,})'$/)
    if (pathIndex) {
        return pathIndex[1]
    }
    return null
}


// ...
export const handleException = (fn, handler) => {
    try { return fn() }
    catch (ex) { return handler ? handler(ex) : undefined }
}


// ...
export const nullToUndefined = (val) =>
    val === null ? undefined : val
