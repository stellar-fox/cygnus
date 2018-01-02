import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import './App.css'
import Welcome from './pages/Welcome/Welcome'
import AccountExplorer from './pages/AccountExplorer/AccountExplorer'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      aexp: true,
    }
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Welcome} />
          <Route exact path="/aexp" component={AccountExplorer} />
        </div>
      </Router>
    )
  }
}

export default App;
