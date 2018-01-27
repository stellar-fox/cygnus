export const pubKeyAbbr = (pubKey) => {
  return (pubKey.slice(0,6) + '-' + pubKey.slice(50))
}

export const utcToLocaleDateTime = (utcDateTime) => {
  if (utcDateTime !== undefined) {
    let date = new Date(utcDateTime)
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
  }
  return undefined
}

export const getAssetCode = (asset) => {
  if (asset.asset_type === 'native') {
    return 'XLM'
  }
  return asset.asset_code
}
