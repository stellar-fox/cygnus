/**
 * Stellar payments helper. Provides wrappers for payment operation querying
 *
 * @module payments
 * @license Apache-2.0
 */




import { config } from "../../config"
import {
    createServer,
    testNet,
    liveNet,
} from "./server"
import {
    Asset,
    Networks,
} from "stellar-sdk"
import { getOffers } from "./offers"




/**
 * @typedef {Object} Page
 * @property {Function} next Returns next page of records.
 * @property {Function} prev Returns previous page of records.
 * @property {Array} records Array of payment records.
 */

/**
 * @typedef {Object} OperationRecord
 * @property {String} [account] New account that was funed if operation type is
 * `create_account`.
 * @property {String} [amount] Amount sent in native currency.
 * @property {String} [asset_type] Can be either `native` | `alphanum4` |
 * `alphanum12` if operation type is `payment`.
 * @property {String} [asset_code] Code of the destination asset. Appears in
 * `payment` type only.
 * @property {String} [asset_issuer] Account ID of the issuing account of the
 * asset. Appears in `payment` type only.
 * @property {String} created_at Date and time ledger in which this operation
 * happened.
 * @property {String} [from] Account ID of the account where the payment was
 * sent from if operation type is `payment`.
 * @property {String} [funder] Account ID of the funding account if operation
 * type is `create_account`.
 * @property {Number|String} id Canonical ID of the operation.
 * @property {String} [into] Account ID where funds of deleted account were
 * transferred. Appears only in `account_merge` type only.
 * @property {Number|String} paging_token Paging token to be used as cursor
 * parameter.
 * @property {String} source_account Account ID of the acccount that paid
 * for this operation.
 * @property {String} starting_balance Amount the account was funded with.
 * @property {String} transaction_hash Hash of the transaction in which this
 * operation happened.
 * @property {Number} type_i Operation type expressed as integer.
 * @property {String} type Operation type expressed as string.
 */




/**
 * @typedef {Object} PageOptions
 * @property {Number} limit Number of transactions returned.
 * @property {String} order Order of returned rows.
 * @property {String|Number} cursor Paging token, specifying where to start
 * returning records from.
 * @property {String} horizon Horizon API endpoint.
 */
/**
 * Payments for the Stellar Account as most recent first. Limited by default to
 * five records only.
 * The operation falls under "Payments" category if its type is in one of the
 * following categories: "create_account", "payment", "path_payment" or
 * "account_merge"
 *
 * @async
 * @function getPayments
 * @param {String} accountId Stellar account ID.
 * @param {PageOptions} [opts={}]
 * @returns {Promise.<Page>} Promise containing `Page` object when resolved
 * successfully.
 */
export const getPayments = (
    accountId,
    {
        cursor = "now",
        limit = 5,
        order = "desc",
        horizon = config.network === Networks.PUBLIC ? liveNet : testNet,
    } = {}
) =>
    createServer(horizon)
        .payments()
        .forAccount(accountId)
        .cursor(cursor)
        .order(order)
        .limit(limit)
        .call()



/**
 * Amount value of the operation along with arithmetic sign. The sign
 * signifies whether the amount was debited or credited to the account.
 *
 * @async
 * @function getArithmeticAmount
 * @param {OperationRecord} record Single payment record.
 * @param {String} accountId Stellar account ID.
 * @param {PageOptions} [opts={}]
 * @returns {Promise.<String>} Promise containing object with arithmetic sign
 * `+|-` along with amount when resolved successfully.
 */
export const getArithmeticAmount = async (
    record,
    accountId,
    {
        horizon = testNet,
    } = {}
) => {

    /**
     * Any asset can be used for `payment` and `path_payment` operation types.
     */
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) {

        let retVal = {}

        if (record.asset_code) {

            const offers = (await getOffers(
                new Asset(record.asset_code, record.asset_issuer),
                new Asset.native(),
                {horizon}
            ))

            const asks = offers.asks

            if (asks[0] && offers.counter.asset_type === "native") {
                retVal.bestBid = asks[0].price
            } else {
                retVal.bestBid = "0.0000000"
            }
        }

        retVal.sign = record.to === accountId ? "+" : "-"
        retVal.value = record.amount


        return Promise.resolve(retVal)

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
            effects.records.forEach((effect) => {
                if (effect.account === accountId) {
                    if (effect.type === "account_debited") {
                        value = effect.amount
                        sign = "-"
                        return
                    }
                    if (effect.type === "account_credited") {
                        value = effect.amount
                        sign = "+"
                        return
                    }
                }
            })
            return Promise.resolve({ sign, value })
        })
    }
}
