import Transport from "@ledgerhq/hw-transport-u2f"
import Str from "@ledgerhq/hw-app-str"
import { StellarSdk } from "./stellar-tx"


/**
 * Establishing connection to the Ledger device constitutes essentially
 * querrying for the current software version of the installed application.
 *
 * @returns {String}
 */
export const getSoftwareVersion = async () => {
    const
        transport = await Transport.create(),
        str = new Str(transport),
        result = await str.getAppConfiguration()
    return result.version
}


/**
 * Gets Stellar Public Key from the device based on BIP-32 derivation path
 * provided as String argument [e.g. 44'/148'/0']
 *
 * @returns {String}
 */
export const getPublicKey = async (bip32Path) => {
    const
        transport = await Transport.create(),
        str = new Str(transport),
        result = await str.getPublicKey(bip32Path)

    return result.publicKey
}


/**
 * Returns signed transaction with a signature for the account specified by
 * BIP-32 derivation path and provided Stellar Public Key.
 *
 * @returns {Object}
 */
export const signTransaction = async (bip32Path, publicKey, transaction) => {
    const
        transport = await Transport.create(),
        str = new Str(transport),
        signature = await str.signTransaction(
            bip32Path,
            transaction.signatureBase()
        ),
        keyPair = StellarSdk.Keypair.fromPublicKey(publicKey),
        hint = keyPair.signatureHint(),
        decorated = new StellarSdk.xdr.DecoratedSignature({
            hint: hint,
            signature: signature.signature,
            /**
             * signature.signature does not render "XDR Write Error: not a number"
             * upon submission to Horizon (as opposed to using "signature" only
             * and as stated in documentation).
             * TODO: consult with Ledger.
             */
        })

    transaction.signatures.push(decorated)

    return transaction
}
