import Transport from "@ledgerhq/hw-transport-u2f"
import Str from "@ledgerhq/hw-app-str"


/**
 * Establishing connection to the Ledger device constitutes essentially
 * querrying for the current software version of the installed application.
 * 
 * @returns {String}
 */

export const awaitConnection = async () => {
    const transport = await Transport.create()
    const str = new Str(transport)
    const result = await str.getAppConfiguration()
    return result.version
}

export const getPublicKey = async (bip32Path) => {
    const transport = await Transport.create()
    const str = new Str(transport)
    const result = await str.getPublicKey(bip32Path)
    return result.publicKey
}
