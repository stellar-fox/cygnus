import AuthenticationReducer from "./authentication-reducer"
import AccountInfoReducer from "./account-info-reducer"
import LoadingModalReducer from "./loading-modal-reducer"
import SelectViewReducer from "./select-view-reducer"
import UiStateReducer from "./ui-state-reducer"
import ModalReducer from "./modal-reducer"


// ...
export default {
    auth: AuthenticationReducer,
    accountInfo: AccountInfoReducer,
    loadingModal: LoadingModalReducer,
    nav: SelectViewReducer,
    ui: UiStateReducer,
    modal: ModalReducer,
}
