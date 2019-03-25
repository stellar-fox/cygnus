import {
    loadAccount,
    operations,
    payments,
} from "../../lib/stellar-tx"




// ...
export const paymentsStreamer = (
    blinkPayentStreamerLed, streamerPaymentConnected, surfaceSnacky, publicKey,
    network, updateAccountTree,
) => {

    streamerPaymentConnected(true)

    return payments(network).stream({
        onmessage: (message) => {

            blinkPayentStreamerLed()

            const RECEIVED = [
                (message.type === "create_account" &&
                    message.account === publicKey),
                (message.type === "payment" &&
                    message.to === publicKey),
            ]

            const SENT = [
                (message.type === "create_account" &&
                    message.source_account === publicKey),
                (message.type === "payment" &&
                    message.from === publicKey),
            ]

            RECEIVED.some(el => el) &&
                surfaceSnacky("success", "Payment received.") &&
                loadAccount(publicKey).then(
                    account => updateAccountTree(account)
                )

            SENT.some(el => el) &&
                surfaceSnacky("success", "Payment sent.") &&
                loadAccount(publicKey).then(
                    account => updateAccountTree(account)
                )
        },
    })
}



// ...
export const operationsStreamer = (
    blinkOperationStreamerLed, streamerOperationConnected, surfaceSnacky,
    publicKey, network, updateAccountTree
) => {

    streamerOperationConnected(true)

    return operations(network).stream({
        onmessage: (message) => {

            blinkOperationStreamerLed()

            const HOME_DOMAIN_UPDATE = [
                (message.type === "set_options" &&
                    message.source_account === publicKey &&
                    message.home_domain
                ),
            ]

            const HOME_DOMAIN_REMOVE = [
                (message.type === "set_options" &&
                    message.source_account === publicKey &&
                    !message.home_domain
                ),
            ]

            HOME_DOMAIN_UPDATE.some(el => el) &&
                surfaceSnacky("success", "Account domain updated.") &&
                    loadAccount(publicKey).then(
                        account => updateAccountTree(account)
                    )

            HOME_DOMAIN_REMOVE.some(el => el) &&
                surfaceSnacky("success", "Account domain removed.") &&
                    loadAccount(publicKey).then(
                        account => updateAccountTree(account)
                    )
        },
    })
}
