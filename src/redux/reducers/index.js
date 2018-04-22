import {
    uiReducer,
} from "./mono-reducer"
import LoadingModalReducer from "./loading-modal-reducer"

import { reducer as AccountReducer } from "../Account"
import { reducer as AssetManagerReducer } from "../AssetManager"
import { reducer as BalancesReducer } from "../Balances"
import { reducer as BankReducer } from "../Bank"
import { reducer as LedgerHQReducer } from "../LedgerHQ"
import { reducer as LoginMangerReducer } from "../LoginManager"
import { reducer as PaymentsReducer } from "../Payments"
import { reducer as StellarAccountReducer } from "../StellarAccount"
import { reducer as RouterReducer } from "../StellarRouter"
import { reducer as SnackbarReducer } from "../Snackbar"




// ...
export default {
    loadingModal: LoadingModalReducer,
    appUi: uiReducer,

    Account: AccountReducer,
    Assets: AssetManagerReducer,
    Balances: BalancesReducer,
    Bank: BankReducer,
    LedgerHQ: LedgerHQReducer,
    LoginManager: LoginMangerReducer,
    Payments: PaymentsReducer,
    Router: RouterReducer,
    StellarAccount: StellarAccountReducer,
    Snackbar: SnackbarReducer,
}
