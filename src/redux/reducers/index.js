import {
    authReducer,
    uiReducer,
} from "./mono-reducer"
import AuthenticationReducer from "./authentication-reducer"
import AccountInfoReducer from "./account-info-reducer"
import LoadingModalReducer from "./loading-modal-reducer"
import UiStateReducer from "./ui-state-reducer"
import ModalReducer from "./modal-reducer"

import { reducer as AccountReducer } from "../Account"
import { reducer as AssetManagerReducer } from "../AssetManager"
import { reducer as BalancesReducer } from "../Balances"
import { reducer as BankReducer } from "../Bank"
import { reducer as LedgerHQReducer } from "../LedgerHQ"
import { reducer as PaymentsReducer } from "../Payments"
import { reducer as RouterReducer } from "../StellarRouter"




// ...
export default {
    auth: AuthenticationReducer,
    accountInfo: AccountInfoReducer,
    loadingModal: LoadingModalReducer,
    ui: UiStateReducer,
    modal: ModalReducer,

    appAuth: authReducer,
    appUi: uiReducer,

    Account: AccountReducer,
    Assets: AssetManagerReducer,
    Balances: BalancesReducer,
    Bank: BankReducer,
    LedgerHQ: LedgerHQReducer,
    Payments: PaymentsReducer,
    Router: RouterReducer,
}
