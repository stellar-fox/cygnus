import {combineReducers} from 'redux'
import AuthenticationReducer from './authentication-reducer'
import AccountInfoReducer from './account-info-reducer'
import LoadingModalReducer from './loading-modal-reducer'
import SelectViewReducer from './select-view-reducer'
import UiStateReducer from './ui-state-reducer'
import ModalReducer from './modal-reducer'
import CurrencyReducer from './currency-reducer'

const reducers = combineReducers({
  auth: AuthenticationReducer,
  accountInfo: AccountInfoReducer,
  loadingModal: LoadingModalReducer,
  nav: SelectViewReducer,
  ui: UiStateReducer,
  modal: ModalReducer,
  currency: CurrencyReducer,
})

export default reducers
