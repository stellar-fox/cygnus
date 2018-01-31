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
