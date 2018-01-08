import {combineReducers} from 'redux'
import AccountAssetsReducer from './account-assets'

const reducers = combineReducers({
  accountAssets: AccountAssetsReducer
})

export default reducers
