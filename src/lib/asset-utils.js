import { string } from "@xcmats/js-toolbox"

/**
 * Returns utf-8 currency symbol for given asset code
 *
 * @returns {string}
 */
export const assetGlyph = (assetCode) => (
    (codes) => codes[assetCode.toLowerCase()] ?
        codes[assetCode.toLowerCase()] : string.empty()
)({ eur: "€", usd: "$", aud: "$", nzd: "$", thb: "฿", pln: "zł", xlm: "⩙", })




/**
 * Returns long currency name for a given asset code
 *
 * @returns {string}
 */
export const assetDescription = (assetCode) => (
    (codes) => codes[assetCode.toLowerCase()] ?
        codes[assetCode.toLowerCase()] : string.empty()
)({
    eur: "European Union Euro", usd: "United States Dollar",
    aud: "Australian Dollar", nzd: "New Zealand Dollar",
    thb: "Thai Baht", pln: "Polish Złoty", xlm: "Stellar Lumen",
})


// ...
export const opAmountisNative = (operation) =>
    (operation.asset && operation.asset.code === "XLM")
    || operation.startingBalance
