/**
 * Stellar payments processing.
 *
 * @module payments
 * @license Apache-2.0
 */




import { server, testNet } from "./server"




/**
 * @typedef {Object} PaymentRecord
 * @property {Function} next Returns next records.
 * @property {Function} prev Returns previous records.
 * @property {Array} records Array of record objects.
 */




/**
 * Returns sign of the record (is it credit or debit).
 *
 * @function getSign
 * @param {PaymentRecord} record Payment record.
 * @param {String} accountId Stellar account ID.
 * @returns {String}
 */
const getSign = (record, accountId) => {
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) {
        if (record.to === accountId) {
            return "+"
        }
    }
    return "-"
}





/**
 * @typedef {Object} FetchOptions
 * @property {Number} limit Number of transactions returned.
 * @property {String} order Order of returned rows.
 * @property {*} cursor Paging token, specifying where to start
 *      returning records from.
 * @property {String} horizon Horizon API endpoint.
 */
/**
 * @typedef {Object} PageObject
 * @property {Function} next Returns next records.
 * @property {Function} prev Returns previous records.
 * @property {Array} records Array of record objects.
 */
/**
 * Return payments for the Stellar Account.
 * The operation falls under "Payments" category if its type is in one of the
 * following categories: "create_account", "payment", "path_payment" or
 * "account_merge"
 *
 * @async
 * @function getPayments
 * @param {String} accountId Stellar account id. [G...]
 * @param {FetchOptions} [opts={}]
 * @returns {Promise.<PageObject>}
 */
export const getPayments = (
    accountId,
    {
        cursor = "now",
        limit = 5,
        order = "desc",
        horizon = testNet,

    } = {}
) =>
    server(horizon)
        .payments()
        .forAccount(accountId)
        .cursor(cursor)
        .order(order)
        .limit(limit)
        .call()



/**
 * Returns the amount of the payment based on the type of payment record.
 *
 * @async
 * @function getAmountWithSign
 * @param {PaymentRecord} record Payment record.
 * @param {String} accountId Stellar account ID.
 * @returns {Object} Amount in native currency (XLM)
 *      along with the arithmetic sign `+-`.
 */
export const getAmountWithSign = (record, accountId) => {

    /**
     * Any asset can be used for `payment` and `path_payment` operation types.
     */
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) {
        return Promise.resolve({
            sign: getSign(record, accountId),
            value: record.amount,
            assetType: record.asset_type,
            assetCode: record.asset_code,
            assetIssuer: record.asset_issuer,
        })
    }

    /**
     * This type of operation can happen with native currency of the network
     */
    if (record.type === "create_account") {
        return Promise.resolve({
            sign: record.account === accountId ? "+" : "-",
            value: record.starting_balance,
        })
    }

    /**
     * Merge can happen with native currency of the network when no other
     * account subentries are present.
     */
    if (record.type === "account_merge") {
        return record.effects().then((effects) => {
            let value = "", sign = ""
            effects.records.forEach((record) => {
                if (record.account === accountId) {
                    if (record.type === "account_debited") {
                        value = record.amount
                        sign = "-"
                        return
                    }
                    if (record.type === "account_credited") {
                        value = record.amount
                        sign = "+"
                        return
                    }
                }
            })
            return { sign, value }
        })
    }
}
