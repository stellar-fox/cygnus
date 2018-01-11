import {combineReducers} from 'redux'
import AccountExistenceReducer from './account-existence-reducer'
import ProgressMessageReducer from './progress-message-reducer'
import AccountAssetsReducer from './account-assets'
import SelectedViewReducer from './selected-view-reducer'
import DrawerStateReducer from './drawer-state-reducer'
import AuthenticationReducer from './authentication-reducer'
import AccountNumberReducer from './account-number-reducer'

const reducers = combineReducers({
  accountExists: AccountExistenceReducer,
  progressMessage: ProgressMessageReducer,
  accountAssets: AccountAssetsReducer,
  selectedView: SelectedViewReducer,
  drawerState: DrawerStateReducer,
  isAuthenticated: AuthenticationReducer,
  currentAccount: AccountNumberReducer,
})

export default reducers
