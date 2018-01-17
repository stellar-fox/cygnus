import {combineReducers} from 'redux'
import AuthenticationReducer from './authentication-reducer'
import AccountInfoReducer from './account-info-reducer'
import LoadingModalReducer from './loading-modal-reducer'
import SelectViewReducer from './select-view-reducer'
import UiStateReducer from './ui-state-reducer'
import ModalReducer from './modal-reducer'
import TabBarReducer from './tab-bar-reducer'

const reducers = combineReducers({
  auth: AuthenticationReducer,
  accountInfo: AccountInfoReducer,
  loadingModal: LoadingModalReducer,
  nav: SelectViewReducer,
  ui: UiStateReducer,
  modal: ModalReducer,
  tabBar: TabBarReducer,
})

export default reducers
