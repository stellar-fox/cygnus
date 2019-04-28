import { reducer as AccountReducer } from "./Account"
import { reducer as AlertChoiceReducer } from "./AlertChoice"
import { reducer as AlertReducer } from "./Alert"
import { reducer as AppReducer } from "./App"
import { reducer as AssetManagerReducer } from "./AssetManager"
import { reducer as AuthReducer } from "./Auth"
import { reducer as BalancesReducer } from "./Balances"
import { reducer as BankReducer } from "./Bank"
import { reducer as ContactsReducer } from "./Contacts"
import { reducer as ExchangeRatesReducer } from "./ExchangeRates"
import { reducer as ErrorsReducer } from "./Errors"
import { reducer as LedgerHQReducer } from "./LedgerHQ"
import { reducer as LoadingModalReducer } from "./LoadingModal"
import { reducer as LoginMangerReducer } from "./LoginManager"
import { reducer as ModalReducer } from "./Modal"
import { reducer as PaymentsReducer } from "./Payments"
import { reducer as ProgressReducer } from "./Progress"
import { reducer as RouterReducer } from "./StellarRouter"
import { reducer as SocketReducer } from "./Socket"
import { reducer as StellarAccountReducer } from "./StellarAccount"
import { reducer as SnackyReducer } from "./Snacky"
import { reducer as TransactionReducer } from "./Transaction"




// ...
export default {
    Account: AccountReducer,
    AlertChoice: AlertChoiceReducer,
    Alert: AlertReducer,
    App: AppReducer,
    Assets: AssetManagerReducer,
    Auth: AuthReducer,
    Balances: BalancesReducer,
    Bank: BankReducer,
    Contacts: ContactsReducer,
    ExchangeRates: ExchangeRatesReducer,
    Errors: ErrorsReducer,
    LedgerHQ: LedgerHQReducer,
    LoadingModal: LoadingModalReducer,
    LoginManager: LoginMangerReducer,
    Modal: ModalReducer,
    Payments: PaymentsReducer,
    Progress: ProgressReducer,
    Router: RouterReducer,
    Socket: SocketReducer,
    StellarAccount: StellarAccountReducer,
    Snacky: SnackyReducer,
    Transaction: TransactionReducer,
}
