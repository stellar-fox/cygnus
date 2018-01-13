import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import './Layout.css'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Welcome from './Welcome'

class Layout extends Component {
  // componentDidMount() {
  //   if (sessionStorage.getItem('pubKey') !== null) {
  //     if (sessionStorage.getItem('accountExists') === 'true') {
  //       this.props.setAccountExists(true)
  //     } else {
  //       this.props.setAccountExists(false)
  //     }
  //     this.props.logInViaPublicKey(true)
  //     this.props.sideBarMenuToggle(true)
  //     this.props.sideBarMenuSelect('Balances')
  //     this.props.updateAccountNumber(
  //       sessionStorage.getItem('pubKey').slice(0, 6) + '-' +
  //       sessionStorage.getItem('pubKey').slice(50)
  //     )
  //   }
  // }
  render() {
    return (
      <div>
        <Router>
          <div>
            {this.props.auth.isAuthenticated ?
              (
                <div>
                  <Header/>
                  <Content />
                  <Footer />
                </div>
              ) : (
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
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(Layout)
