import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { createStore } from 'redux'
import reducers from './reducers'
import {Provider} from 'react-redux'

// import './App.css'

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

// import Welcome from './pages/Welcome/Welcome'
// import AccountExplorer from './pages/AccountExplorer/AccountExplorer'
//
// import reducers from './reducers'
//
// const store = createStore(reducers)
//
// class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       error: null,
//       aexp: true,
//     }
//   }
//   render() {
//     return (
//       <Router>
//         <div className="App">
//           <Route exact path="/" component={Welcome} />
//           <Route exact path="/aexp" component={AccountExplorer} />
//         </div>
//       </Router>
//     )
//   }
// }

export default App;
