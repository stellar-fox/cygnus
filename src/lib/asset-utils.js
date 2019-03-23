import { string } from "@xcmats/js-toolbox"




/**
 * Converts 3 letter currency code to currency glyph.
 *
 * @function assetGlyph
 * @param {String} assetCode Lower case ISO 3-letter currency code.
 * @returns {String} Currency glyph.
 */
export const assetGlyph = (assetCode) => (
    (codes) => codes[assetCode.toLowerCase()] ?
        codes[assetCode.toLowerCase()] : string.empty()
)({ eur: "€", usd: "$", aud: "$", nzd: "$", thb: "บาท", pln: "zł", xlm: "∅" })




/**
 * Returns long currency name for a given asset code.
 *
 * @function assetDescription
 * @param {String} assetCode Lower case ISO 3-letter currency code.
 * @returns {String} Long currency name.
 */
export const assetDescription = (assetCode) => (
    (codes) => codes[assetCode.toLowerCase()] ?
        codes[assetCode.toLowerCase()] : string.empty()
)({
    eur: "European Union Euro", usd: "United States Dollar",
    aud: "Australian Dollar", nzd: "New Zealand Dollar",
    thb: "Thai Baht", pln: "Polish Złoty", xlm: "Stellar Lumen",
})
