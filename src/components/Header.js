import React, {Component} from 'react'
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import './Header.css'


export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      title: 'Stellar Fox',
    }
  }
  handleToggle() {
    this.setState((prevState) => ({
      open: !prevState.open
    }))
  }
  handleMenuClick(title, obj) {
    this.setState({
      title: title,
    })
    setTimeout(() => {
      this.setState({
        open: false,
      })
    }, 300)

  }
  getTitle() {
    return this.state.title
  }
  render() {
    return (

        <MuiThemeProvider>
          <div>
          <AppBar
            title={this.getTitle.call(this)}
            className="navbar"
            style={{
              position:'fixed',
              left:0,
              top:0
            }}
            onLeftIconButtonClick={this.handleToggle.bind(this)}
          />
          <Drawer containerStyle={{
            width: 180,
            height: 'calc(100% - 100px)',
            top: 65,
            borderTop: '1px solid #052f5f',
            borderBottom: '1px solid #052f5f',
            borderLeft: '1px solid #052f5f',
            borderTopRightRadius: '3px',
            borderBottomRightRadius: '3px',
            backgroundColor: '#2e5077'
          }} open={this.state.open}>
              <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Balances')} exact activeClassName="active" to="/balances/">
                <i style={{fontSize: 21, verticalAlign: 'text-bottom', paddingRight: 10}} className="material-icons">account_balance_wallet</i>Balances
              </NavLink>
              <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Payments')} exact activeClassName="active" to="/payments/">
                <i style={{fontSize: 21, verticalAlign: 'text-bottom', paddingRight: 10}} className="material-icons">payment</i>Payments
              </NavLink>
              <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Account')} exact activeClassName="active" to="/account/">
                <i style={{fontSize: 21, verticalAlign: 'text-bottom', paddingRight: 10}} className="material-icons">account_balance</i>Account
              </NavLink>
          </Drawer>
          </div>
        </MuiThemeProvider>

    )
  }
}
