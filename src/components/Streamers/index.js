import {
    loadAccount,
    operations,
    payments,
} from "../../lib/stellar-tx"



// ...
export const paymentsStreamer = (
    publicKey, changeSnackbarState, accountExistsOnLedger, updateAccountTree
) =>
    payments().stream({
        onmessage: (message) => {

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

            RECEIVED.some(el => el) && changeSnackbarState({
                open: true,
                message: "Payment received.",
            }) && loadAccount(publicKey).then(
                account => {
                    accountExistsOnLedger({ account, })
                    updateAccountTree(account)
                }
            )

            SENT.some(el => el) && changeSnackbarState({
                open: true,
                message: "Payment sent.",
            }) && loadAccount(publicKey).then(
                account => {
                    accountExistsOnLedger({ account, })
                    updateAccountTree(account)
                }
            )
        },
    })




// ...
export const operationsStreamer = (
    publicKey, changeSnackbarState, accountExistsOnLedger, updateAccountTree
) =>
    operations().stream({
        onmessage: (message) => {
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

            HOME_DOMAIN_UPDATE.some(el => el) && changeSnackbarState({
                open: true,
                message: "Account domain updated.",
            }) && loadAccount(publicKey).then(
                account => {
                    accountExistsOnLedger({ account, })
                    updateAccountTree(account)
                }
            )

            HOME_DOMAIN_REMOVE.some(el => el) && changeSnackbarState({
                open: true,
                message: "Account domain removed.",
            }) && loadAccount(publicKey).then(
                account => {
                    accountExistsOnLedger({ account, })
                    updateAccountTree(account)
                }
            )
        },
    })
