/**
 * Stellar `server` helper. Provides helper wrappers for _horizon_ access.
 *
 * @module server
 * @license Apache-2.0
 */




import { Server } from "stellar-sdk"




/**
 * Horizon end point for accessing _live net_. If you run your own node
 * then you need to adjust this endpoint accordingly.
 * @constant
 *
 * @type {string}
 */
export const liveNet = "https://horizon.stellar.org"




/**
 * Horizon end point for accessing _test net_. If you run your own node
 * then you need to adjust this endpoint accordingly.
 * @constant
 *
 * @type {string}
 */
export const testNet = "https://horizon-testnet.stellar.org"




/**
 * Server instance connected to the _horizon_ endpoint.
 *
 * @function createServer
 * @param {String} horizon Horizon end point URL.
 * @returns {Object} Server instance.
 */
export const createServer = (horizon) =>
    horizon === liveNet ?
        new Server(liveNet) : new Server(testNet)
