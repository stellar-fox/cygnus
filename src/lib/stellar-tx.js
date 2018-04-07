import { StellarSdk } from "./utils"
import { config } from "../config"

StellarSdk.Network.useTestNetwork()
const server = new StellarSdk.Server(config.horizon)


// ...
export const fetchAccount = async (publicKey) =>
    await server.loadAccount(publicKey)


// ...
export const buildCreateAccountTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await fetchAccount(txData.source)
    ).addOperation(StellarSdk.Operation.createAccount({
        destination: txData.destination,
        startingBalance: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()


// ...
export const buildPaymentTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await fetchAccount(txData.source)
    ).addOperation(StellarSdk.Operation.payment({
        destination: txData.destination,
        asset: StellarSdk.Asset.native(),
        amount: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()


// ...
export const broadcastTx = async (signedTx) =>
    server.submitTransaction(signedTx)