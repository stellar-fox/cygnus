export const pubKeyAbbr = (pubKey) => {
  return (pubKey.slice(0,6) + '-' + pubKey.slice(50))
}
