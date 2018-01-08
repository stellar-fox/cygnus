import {combineReducers} from 'redux'
import AccountAssetsReducer from './account-assets'
import SelectedViewReducer from './selected-view-reducer'
import DrawerStateReducer from './drawer-state-reducer'

const reducers = combineReducers({
  accountAssets: AccountAssetsReducer,
  selectedView: SelectedViewReducer,
  drawerState: DrawerStateReducer,
})

export default reducers
