import server from "./server"
import { config } from "../../config"



/**
 * @typedef {Object} FetchOptions
 * @property {Number} [limit] Number of transactions returned.
 * @property {String} [order] Order of returned rows.
 * @property {Any} [cursor] Paging token, specifying where to start returning records from.
 */
/**
 * @typedef {Object} RecordsObject
 * @property {Function} [next] Returns next records.
 * @property {Function} [prev] Returns previous records.
 * @property {Array} [records] Array of record objects.
 */
/**
 * Return payments for the Stellar Account.
 * The operation falls under "Payments" category if its type is in one of the
 * following categories: "create_account", "payment", "path_payment" or
 * "account_merge"
 *
 * @async
 * @function transactions
 * @param {String} [accountId] Stellar account id. [G...]
 * @param {FetchOptions} [opts={}]
 * @returns {Promise.<RecordsObject>}
 */
export const payments = (
    accountId,
    {
        limit = 5,
        order = "desc",

    } = {}
) => server(config.horizon)
    .payments()
    .forAccount(accountId)
    .order(order)
    .limit(limit)
    .call()
