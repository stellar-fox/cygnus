import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import {Provider} from 'react-redux'
import './index.css';
import Layout from './components/Layout'
import registerServiceWorker from './registerServiceWorker';
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import {loadState, saveState} from './load-state'
import throttle from 'lodash/throttle'

const persistedState = loadState()
const middleware = applyMiddleware(thunk, createLogger())
const store = createStore(reducers, persistedState, middleware)

store.subscribe(throttle(() => {
  saveState(store.getState())
}, 1000))

ReactDOM.render(
  <Provider store={store}>
    <Layout/>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
