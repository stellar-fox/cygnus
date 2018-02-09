import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import './Layout.css'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Welcome from './Welcome'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import stellarTheme from '../frontend/themes/stellar'

class Layout extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            {this.props.auth.isHorizonLoggedIn ?
              (
                <MuiThemeProvider muiTheme={stellarTheme}>
                  <div>
                    <Header/>
                    <Content />
                    <Footer />
                  </div>
                </MuiThemeProvider>
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
