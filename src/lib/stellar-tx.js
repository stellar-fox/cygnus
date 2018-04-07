import { StellarSdk } from "./utils"
import { config } from "../config"
import { signTransaction } from "./ledger"

StellarSdk.Network.useTestNetwork()
const server = new StellarSdk.Server(config.horizon)


// ...
export const fetchAccount = async (publicKey) => {
    try {
        return await server.loadAccount(publicKey)
    } catch (error) {
        return error
    }
}


// ...
export const createAccountTx = async (txData) => {
    try {
        return new StellarSdk.TransactionBuilder(
            await fetchAccount(txData.source)
        ).addOperation(StellarSdk.Operation.createAccount({
            destination: txData.destination,
            startingBalance: txData.amount,
        })).addMemo(StellarSdk.Memo.text(txData.memo)).build()
    } catch (error) {
        return error
    }
}

// ...
export const signTx = async (txData) => {
    try {
        return await signTransaction(
            txData.bip32Path,
            txData.publicKey,
            txData.tx
        )
    } catch (error) {
        return error
    }

}