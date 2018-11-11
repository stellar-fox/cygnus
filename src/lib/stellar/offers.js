/**
 * Stellar `orderbook` helper. Provides convenience wrappers for order book
 * queries.
 *
 * @module offers
 * @license Apache-2.0
 */




import { createServer, testNet } from "./server"
import { Asset } from "stellar-sdk"
import BigNumber from "bignumber.js"




/**
 * Current offers for a base/counter asset pair. By default the best bid/ask
 * offer is fetched.
 *
 * @async
 * @function getOffers
 * @param {Asset} baseAsset Base asset.
 * @param {Asset} counterAsset Counter asset.
 * @param {PageOptions} [opts={}]
 * @returns {Promise.<Bid>} Promise containing `Bids` object when resolved
 * successfully.
 */
export const getOffers = (
    baseAsset,
    counterAsset = new Asset.native(),
    {
        limit = 1,
        horizon = testNet,
    } = {}
) =>
    createServer(horizon)
        .orderbook(baseAsset, counterAsset)
        .limit(limit)
        .call()




/**
 * Finds out the current, actual market price for the amount of asset
 * that you have and want to market sell.
 *
 * @async
 * @function getSellMarketPrice
 * @param {Asset} baseAsset Base asset.
 * @param {Asset} counterAsset Counter asset.
 * @param {Number} have The amount to be sold.
 * @param {PageOptions} [opts={}]
 * @returns {Promise.<String>} Promise containing `String` reflecting the sell
 * market price at that moment.
 */

export const getSellMarketPrice = async (
    baseAsset,
    counterAsset,
    have,
    {
        limit = 1,
        horizon = testNet,
        increaseDepth = 5,
    } = {}
) => {

    BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4 })

    try {
        const offers = await getOffers(
            baseAsset, counterAsset, {limit, horizon}
        )
        let willGet = new BigNumber(0.00),
            available = new BigNumber(0.00),
            collected = new BigNumber(0.00)

        offers.bids.some((bid) => {

            collected = collected.plus(available)
            available = available.plus(bid.amount)

            if (available.isGreaterThanOrEqualTo(have)) {

                willGet = willGet.plus(
                    new BigNumber(bid.price).times(
                        collected.minus(have).absoluteValue()
                    )
                )

            } else {

                willGet = willGet.plus(
                    new BigNumber(bid.price).times(bid.amount)
                )

            }

            return available.isGreaterThanOrEqualTo(have)
        })

        if (available.isLessThan(have)) {
            return getSellMarketPrice(
                baseAsset,
                counterAsset,
                have,
                {
                    limit: limit + increaseDepth,
                    horizon,
                }
            )
        }

        return willGet.toFixed(7)

    } catch (error) {
        return error
    }
}
