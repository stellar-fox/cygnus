import {
    liveNetAddr,
    testNetAddr,
} from "../components/StellarFox/env"




// TODO: convert-to/use-as module
export const StellarSdk = window.StellarSdk




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
export const submitTransaction = async (signedTx, network) =>
    server(network).submitTransaction(signedTx)
