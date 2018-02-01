import axios from 'axios'
import toml from 'toml'

export const pubKeyAbbr = (pubKey) => {
  return (pubKey.slice(0,6) + '-' + pubKey.slice(50))
}

export const utcToLocaleDateTime = (utcDateTime, includeTime=true) => {
  if (utcDateTime !== undefined) {
    let date = new Date(utcDateTime)
    if (includeTime === true) {
      return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
    }
    return `${date.toLocaleDateString()}`
  }
  return undefined
}

export const getAssetCode = (asset) => {
  if (asset.asset_type === 'native') {
    return 'XLM'
  }
  return asset.asset_code
}

export const formatAmount = (amount, precision=2) => {
  return Number.parseFloat(amount).toFixed(precision)
}

export const emailValid = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return (regex.test(email) === true) ? true : false
}

export const federationAddressValid = (federationAddress) => {
  const regex = /^[a-zA-Z\-0-9.@]+\*((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return (regex.test(federationAddress) === true) ? true : false
}

export const federationLookup = (federationAddress) => {
  let federationAddressDomain = federationAddress.match(/((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  if (federationAddressDomain !== null) {
    return axios.get(`https://${federationAddressDomain[0]}/.well-known/stellar.toml`)
      .then((response) => {
        let data = toml.parse(response.data)
        return data.FEDERATION_SERVER
      })
      .catch((error) => {
        console.log(error.message)
      });
  }

}
