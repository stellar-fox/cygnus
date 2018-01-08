import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { createStore } from 'redux'
import reducers from './reducers'
import {Provider} from 'react-redux'
import Layout from './components/Layout'


const store = createStore(reducers)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout/>
      </Provider>
    )
  }
}

export default App;
