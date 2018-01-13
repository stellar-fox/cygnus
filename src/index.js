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

const middleware = applyMiddleware(thunk, createLogger())
const store = createStore(reducers, middleware)

// store.dispatch((dispatch) => {
//   try {
//     window.StellarSdk.Keypair.fromPublicKey("GAUWLOIHFR2E52DYNEYDO6ZADIDVWZKK3U77V7PMFBNOIOBNREQBHBRR")
//     dispatch({
//       type: "PUBKEY_VALID",
//       payload: "GAUWLOIHFR2E52DYNEYDO6ZADIDVWZKK3U77V7PMFBNOIOBNREQBHBRR",
//     })
//   } catch (e) {
//     dispatch({
//       type: "PUBKEY_INVALID",
//       payload: "GAUWLOIHFR2E52DYNEYDO6ZADIDVWZKK3U77V7PMFBNOIOBNREQBHBRR",
//     })
//   }
//   let server = new window.StellarSdk.Server('https://horizon.stellar.org')
//   server.loadAccount("GAUWLOIHFR2E52DYNEYDO6ZADIDVWZKK3U77V7PMFBNOIOBNREQBHBRR")
//     .catch(window.StellarSdk.NotFoundError, function (error) {
//       throw new Error('Account not active.');
//     })
//     .then(function(account) {
//       dispatch({
//         type: "ACCOUNT_ACTIVE",
//         payload: account,
//       })
//     }, function (e) {
//       dispatch({
//         type: "ACCOUNT_INACTIVE",
//         payload: e.message,
//       })
//     })
// })

ReactDOM.render(
  <Provider store={store}>
    <Layout/>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
