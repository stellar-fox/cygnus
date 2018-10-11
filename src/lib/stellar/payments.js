import server from "./server"
import { config } from "../../config"



/**
 * @typedef {Object} FetchOptions
 * @property {Number} [limit] Number of transactions returned.
 * @property {String} [order] Order of returned rows.
 * @property {Any} [cursor] Paging token, specifying where to start returning records from.
 */
/**
 * @typedef {Object} PageObject
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
 * @function payments
 * @param {String} [accountId] Stellar account id. [G...]
 * @param {FetchOptions} [opts={}]
 * @returns {Promise.<PageObject>}
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




/**
 * @typedef {Object} Record
 * @property {Function} [next] Returns next records.
 * @property {Function} [prev] Returns previous records.
 * @property {Array} [records] Array of record objects.
 */
/**
 * Returns the amount of the payment based on the type of payment record.
 *
 * @function getAmount
 * @param {Record} [record] Payment record.
 * @returns {String} Amount in native currency (XLM).
 */
export const getAmount = (record) => {
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) { return record.amount }

    if (record.type === "create_account") {
        return record.starting_balance
    }
}




// ...
export const getPlusMinus = (record, accountId) => {
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) {
        if (record.to === accountId) {
            return "+"
        }
    }

    if (record.type === "create_account") {
        if (record.account === accountId) {
            return "+"
        }
    }

    return "-"
}
