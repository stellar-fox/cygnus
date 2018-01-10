import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import './Layout.css'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Welcome from './Welcome'
import {
  logInViaPublicKey,
  sideBarMenuToggle,
  sideBarMenuSelect,
  updateAccountNumber,
} from '../actions/index'

class Layout extends Component {
  componentDidMount() {
    console.log(sessionStorage.getItem('pubKey'));
    if (sessionStorage.getItem('pubKey') !== null) {
      this.props.logInViaPublicKey(true)
      this.props.sideBarMenuToggle(true)
      this.props.sideBarMenuSelect('Balances')
      this.props.updateAccountNumber(
        sessionStorage.getItem('pubKey').slice(0, 6) + '-' +
        sessionStorage.getItem('pubKey').slice(50)
      )
    }
  }
  render() {
    return (
      <div>
        <Router>
          <div>
            {this.props.isAuthenticated ?
              <div>
                <Header/>
                <Content />
                <Footer />
              </div> : (
                <Switch>
                  <Route exact path="/" component={Welcome}/>
                  <Redirect to="/"/>
                </Switch>
              )
            }
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.isAuthenticated,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    logInViaPublicKey,
    sideBarMenuToggle,
    sideBarMenuSelect,
    updateAccountNumber,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Layout)
