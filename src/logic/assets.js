import { BigNumber } from "bignumber.js"
import { string } from "@xcmats/js-toolbox"




/**
 * Converts native currency units (XLM) against provided exchange rate.
 *
 * @function nativeToAsset
 * @param {Any} amount Amount of native currency
 * @param {Any} rate Exchange rate
 * @returns {String}
 */
export const nativeToAsset = (amount, rate) => {
    BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4 })
    return amount !== string.empty() ?
        new BigNumber(amount).multipliedBy(rate).toFixed(2) : "0.00"
}




/**
 * Converts currency units against provided native currency exchange rate.
 *
 * @function assetToNative
 * @param {Any} amount Amount of asset currency
 * @param {Any} rate Exchange rate
 * @returns {String}
 */
export const assetToNative = (amount, rate) => {
    BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4 })
    return amount !== string.empty() ?
        new BigNumber(amount).dividedBy(rate).toFixed(7) : "0.0000000"
}
