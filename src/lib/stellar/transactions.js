import { server, testNet } from "./server"



/**
 * @typedef {Object} FetchOptions
 * @property {Number} [limit] Number of transactions returned.
 * @property {String} [order] Order of returned rows.
 * @property {Any} [cursor] Paging token, specifying where to start returning records from.
 * @property {String} [horizon] Horizon API endpoint.
 */
/**
 * @typedef {Object} PageObject
 * @property {Function} [next] Returns next records.
 * @property {Function} [prev] Returns previous records.
 * @property {Array} [records] Array of record objects.
 */
/**
 * Return transactions for the Stellar Account.
 *
 * @async
 * @function transactions
 * @param {String} [accountId] Stellar account id. [G...]
 * @param {FetchOptions} [opts={}]
 * @returns {Promise.<PageObject>}
 */
export const transactions = (
    accountId,
    {
        limit = 5,
        order = "desc",
        horizon = testNet,

    } = {}
) => server(horizon)
    .transactions()
    .forAccount(accountId)
    .order(order)
    .limit(limit)
    .call()
