import {combineReducers} from 'redux'
import AccountAssetsReducer from './account-assets'
import SelectedViewReducer from './selected-view-reducer'
import DrawerStateReducer from './drawer-state-reducer'
import AuthenticationReducer from './authentication-reducer'
import AccountNumberReducer from './account-number-reducer'

const reducers = combineReducers({
  accountAssets: AccountAssetsReducer,
  selectedView: SelectedViewReducer,
  drawerState: DrawerStateReducer,
  isAuthenticated: AuthenticationReducer,
  currentAccount: AccountNumberReducer,
})

export default reducers
