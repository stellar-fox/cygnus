import BigNumber from "bignumber.js"
import { string } from "@xcmats/js-toolbox"
import { liveNetAddr, testNetAddr } from "../components/StellarFox/env"
import { StellarSdk } from "./utils"




// ...
export const server = (network) => {
    if (network === liveNetAddr) {
        StellarSdk.Network.usePublicNetwork()
        return new StellarSdk.Server(liveNetAddr)
    }
    StellarSdk.Network.useTestNetwork()
    return new StellarSdk.Server(testNetAddr)
}




// ...
export const loadAccount = async (publicKey, network) =>
    await server(network).loadAccount(publicKey)




// ...
export const payments = (network) =>
    server(network).payments().cursor("now")




// ...
export const operations = (network) =>
    server(network).operations().cursor("now")




// ...
export const buildSetDataTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source, txData.network)
    ).addOperation(StellarSdk.Operation.manageData({
        name: txData.name,
        value: txData.value,
    })).build()




// ...
export const buildChangeTrustTx = async (txData) => {
    let txBuilder = new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source, txData.network)
    )

    txData.assets.forEach(asset => {

        if (asset.trustLimit) {
            txBuilder.addOperation(StellarSdk.Operation.changeTrust({
                asset: new StellarSdk.Asset(asset.code, asset.issuer),
                limit: asset.trustLimit,
            }))
        } else {
            txBuilder.addOperation(StellarSdk.Operation.changeTrust({
                asset: new StellarSdk.Asset(asset.code, asset.issuer),
            }))
        }

    })

    return txBuilder.build()
}




// ...
export const buildCreateAccountTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source, txData.network)
    ).addOperation(StellarSdk.Operation.createAccount({
        destination: txData.destination,
        startingBalance: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()




// ...
export const buildPaymentTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source, txData.network)
    ).addOperation(StellarSdk.Operation.payment({
        destination: txData.destination,
        asset: StellarSdk.Asset.native(),
        amount: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()




// ...
export const buildAssetPaymentTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source, txData.network)
    ).addOperation(StellarSdk.Operation.payment({
        destination: txData.destination,
        asset: new StellarSdk.Asset(txData.assetCode, txData.assetIssuer),
        amount: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()




// ...
export const submitTransaction = async (signedTx, network) =>
    server(network).submitTransaction(signedTx)




// ...
export const displayLastBalance = (balance) => {
    const bnBalance = new BigNumber(balance)

    if (bnBalance.isEqualTo(0)) { return bnBalance.toString() }
    if (bnBalance.isGreaterThan(0)) { return `+ ${balance.toString()}` }
    if (bnBalance.isLessThan(0)) { return `- ${balance.toString()}` }
}




// ...
export const displayDebit = (debit) =>
    debit ? `- ${new BigNumber(debit).abs().toString()}` : string.empty()




// ...
export const displayCredit = (credit) =>
    credit ? `+ ${new BigNumber(credit).abs().toString()}` : string.empty()




// ...
export const lastBalance = (initial, next) =>
    new BigNumber(initial).plus(next).toString()




// ...
export const debit = (operations, publicKey) => {
    const balance = operationsBalance(operations, publicKey)
    if (balance.isLessThan(0)) { return balance.toString() }
    return string.empty()
}




// ...
export const credit = (operations, publicKey) => {
    const balance = operationsBalance(operations, publicKey)
    if (balance.isGreaterThan(0)) { return balance.toString() }
    return string.empty()
}




// ...
export const operationsBalance = (operations, publicKey) => {

    const parsedOps = operations.filter((op) => (
        op.destination === publicKey || !op.source || op.source === publicKey))
        .map((op) => operationParse(op, publicKey))

    let balance = new BigNumber("0.0000000")

    parsedOps.forEach((op) => {
        if (op) {
            const match = op.match(/([+-]{1}) (.+)/)
            if (match) {
                let sign = match[1]
                let amount = new BigNumber(match[2])
                if (sign === "+") {
                    balance = balance.plus(amount)
                } else {
                    balance = balance.minus(amount)
                }
            }
        }
    })

    return balance
}




// ...
export const operationParse = (operation, publicKey) => ((sign) => {
    if (operation.startingBalance) {
        return `${sign} ${operation.startingBalance}`
    }

    if (operation.amount) {
        return `${sign} ${operation.amount}`
    }

})(creditOrDebit(operation, publicKey))




// ...
export const creditOrDebit = (operation, publicKey) => {
    if ([ "createAccount", "payment", ].includes(operation.type)) {
        return operation.destination === publicKey ? "+" : "-"
    }
}




/**
 * Returns native balance of the Account.
 *
 * @returns {string}
 */
export const nativeBalance = (Account) =>
    Account.balances.find((asset) => asset.asset_type === "native").balance




/**
 * Returns balance of an Asset held by the Account
 *
 * @returns {string}
 */
export const assetBalance = (Account, Asset) => {
    const balanceObj = Account.balances.find(
        (asset) => asset.asset_code === Asset.getCode() &&
            asset.asset_issuer === Asset.getIssuer() &&
            asset.asset_type === Asset.getAssetType()
    )

    if (!balanceObj) {
        throw new Error("Recipient did not enable this currency.")
    }

    return balanceObj.balance
}
