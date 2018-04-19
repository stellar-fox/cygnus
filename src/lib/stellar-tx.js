import { config } from "../config"



// TODO: convert-to/use-as module
export const StellarSdk = window.StellarSdk



StellarSdk.Network.useTestNetwork()
const server = new StellarSdk.Server(config.horizon)




// ...
export const loadAccount = async (publicKey) =>
    await server.loadAccount(publicKey)




// ...
export const payments = () =>
    server.payments().cursor("now")




// ...
export const operations = () =>
    server.operations().cursor("now")




// ...
export const buildCreateAccountTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source)
    ).addOperation(StellarSdk.Operation.createAccount({
        destination: txData.destination,
        startingBalance: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()




// ...
export const buildPaymentTx = async (txData) =>
    new StellarSdk.TransactionBuilder(
        await loadAccount(txData.source)
    ).addOperation(StellarSdk.Operation.payment({
        destination: txData.destination,
        asset: StellarSdk.Asset.native(),
        amount: txData.amount,
    })).addMemo(StellarSdk.Memo.text(txData.memo)).build()




// ...
export const submitTransaction = async (signedTx) =>
    server.submitTransaction(signedTx)
