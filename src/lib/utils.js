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

export const federationIsAliasOnly = (federationAddress) => {
  const regex = /^[a-zA-Z\-0-9.@][^*]+$/
  return (regex.test(federationAddress) === true) ? true : false
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
        return {ok: true, endpoint: data.FEDERATION_SERVER}
      })
      .catch((error) => {
        return {error: error.message}
      });
  }
}

export const pubKeyValid = (pubKey) => {
  let validity = {}
  switch (true) {
    case pubKey.length < 56:
      validity = Object.assign(validity || {}, {
        valid: false,
        length: (56- pubKey.length),
        message: (pubKey.length !== 0 ? `needs ${56 - pubKey.length} more characters` : null),
      })
      break;
    case pubKey.length === 56:
      try {
        window.StellarSdk.Keypair.fromPublicKey(pubKey)
        validity = Object.assign(validity || {}, {valid: true, message: null})
      } catch (error) {
        validity = Object.assign(validity || {}, {valid: false, message: error.message})
      }
      break;
    default:
      break;
  }
  return validity
}

export const signTransaction = (pubKey, signature, transaction) => {
  let keyPair = window.StellarSdk.Keypair.fromPublicKey(pubKey)
  let hint = keyPair.signatureHint()
  let decoratedSignature = new window.StellarSdk.xdr.DecoratedSignature({
    hint: hint,
    signature: signature,
  })
  transaction.signatures.push(decoratedSignature)
}

export const ledgerGetSignature = (transaction, pathIndex=0) => {
  let bip32Path = `44'/148'/${pathIndex}'`
  window.StellarSdk.Network.useTestNetwork();
  return window.StellarLedger.comm.create_async().then((comm) => {
    let api = new window.StellarLedger.Api(comm)
    return api.signTx_async(bip32Path, transaction).then((result) => {
      return result['signature']
    })
  }).catch((error) => {
    console.log(error)
  })
}


export const ledgerGetPubKey = (pathIndex=0) => {
  let bip32Path = `44'/148'/${pathIndex}'`
  return window.StellarLedger.comm.create_async().then((comm) => {
    let api = new window.StellarLedger.Api(comm)
    return api.getPublicKey_async(bip32Path).then((result) => {
      return result['publicKey']
    }).catch(function (err) {
      console.error(err)
    })
  })
}