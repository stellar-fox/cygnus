import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux'
import reducers from './reducers'
import {Provider} from 'react-redux'

import './index.css';
import Layout from './components/Layout'
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers)

ReactDOM.render(
  <Provider store={store}>
    <Layout/>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
