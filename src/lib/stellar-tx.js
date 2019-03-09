import BigNumber from "bignumber.js"
import {
    Asset,
    BASE_FEE,
    Memo,
    Networks,
    Operation,
    TransactionBuilder,
} from "stellar-sdk"
import {
    string,
    timeUnit,
} from "@xcmats/js-toolbox"
import {
    createServer,
    testNet,
    liveNet,
} from "./stellar/server"
import { config } from "../config"




// ...
export const loadAccount = async (publicKey) =>
    createServer(
        config.network === Networks.PUBLIC ? liveNet : testNet
    ).loadAccount(publicKey)




// ...
export const payments = () =>
    createServer(
        config.network === Networks.PUBLIC ? liveNet : testNet
    ).payments().cursor("now")




// ...
export const operations = () =>
    createServer(
        config.network === Networks.PUBLIC ? liveNet : testNet
    ).operations().cursor("now")




// ...
export const buildSetDataTx = async (txData) =>
    new TransactionBuilder(
        await loadAccount(txData.source), { fee: BASE_FEE }
    ).addOperation(Operation.manageData({
        name: txData.name,
        value: txData.value,
    })).setTimeout(10 * timeUnit.second).build()




// ...
export const buildChangeTrustTx = async (txData) => {
    let txBuilder = new TransactionBuilder(
        await loadAccount(txData.source), { fee: BASE_FEE }
    )

    txData.assets.forEach(asset => {

        if (asset.trustLimit) {
            txBuilder.addOperation(Operation.changeTrust({
                asset: new Asset(asset.code, asset.issuer),
                limit: asset.trustLimit,
            }))
        } else {
            txBuilder.addOperation(Operation.changeTrust({
                asset: new Asset(asset.code, asset.issuer),
            }))
        }

    })

    return txBuilder.setTimeout(10 * timeUnit.second).build()
}




// ...
export const buildCreateAccountTx = async (txData) =>
    new TransactionBuilder(
        await loadAccount(txData.source), { fee: BASE_FEE }
    ).addOperation(Operation.createAccount({
        destination: txData.destination,
        startingBalance: txData.amount,
    })).addMemo(Memo.text(txData.memo)).setTimeout(10 * timeUnit.second).build()




// ...
export const buildPaymentTx = async (txData) => {
    return new TransactionBuilder(
        await loadAccount(txData.source), { fee: BASE_FEE }
    ).addOperation(Operation.payment({
        destination: txData.destination,
        asset: Asset.native(),
        amount: txData.amount,
    })).addMemo(Memo.text(txData.memo)).setTimeout(10 * timeUnit.second).build()
}



// ...
export const buildAssetPaymentTx = async (txData) =>
    new TransactionBuilder(
        await loadAccount(txData.source), { fee: BASE_FEE }
    ).addOperation(Operation.payment({
        destination: txData.destination,
        asset: new Asset(txData.assetCode, txData.assetIssuer),
        amount: txData.amount,
    })).addMemo(Memo.text(txData.memo)).setTimeout(10 * timeUnit.second).build()




// ...
export const submitTransaction = async (signedTx) =>
    createServer(
        config.network === Networks.PUBLIC ? liveNet : testNet
    ).submitTransaction(signedTx)




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
    if (["createAccount", "payment"].includes(operation.type)) {
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
