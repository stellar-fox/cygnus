/**
 * Stellar `orderbook` helper. Provides convenience wrappers for order book
 * queries.
 *
 * @module offers
 * @license Apache-2.0
 */




import { createServer, testNet } from "./server"
import { Asset } from "stellar-sdk"




/**
 * The best price someone is willing to pay in order to buy the asset.
 *
 * @async
 * @function getFirstBid
 * @param {Asset} base Base asset.
 * @param {Asset} counter Counter asset.
 * @param {PageOptions} [opts={}]
 * @returns {Promise.<Bid>} Promise containing `Bid` object when resolved
 * successfully.
 */
export const getFirstBid = (
    base,
    counter = new Asset.native(),
    {
        limit = 1,
        horizon = testNet,

    } = {}
) =>
    createServer(horizon)
        .orderbook(base, counter)
        .limit(limit)
        .call()
        .then((entry) => {
            return entry.bids[0]
        })
