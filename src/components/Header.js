import React, {Component} from 'react'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  sideBarMenuSelect,
  sideBarMenuToggle,
  logOutButtonPress,
  logInViaPublicKey,
} from '../actions/index'

import {NavLink} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import './Header.css'
import AppBarTitle from './AppBarTitle'
import AppBarItems from './AppBarItems'
import IconButton from 'material-ui/IconButton'
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new'

class Header extends Component {
  handleToggle() {
    this.props.sideBarMenuToggle(!this.props.drawer)
  }
  handleMenuClick(title, obj) {
    this.props.sideBarMenuSelect(title)
    setTimeout(() => {
      this.props.sideBarMenuToggle(false)
    }, 300)
  }
  handleLogOutClick(state) {
    this.props.logOutButtonPress(state)
    sessionStorage.clear()
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
        <AppBar
          title={
            <div className="flex-row">
              <AppBarTitle title="Stellar Fox" subtitle={this.props.view}/>
              <AppBarItems accountNumber={this.props.currentAccount}/>
            </div>
          }
          className="navbar"
          style={{
            position:'fixed',
            left:0,
            top:0
          }}
          onLeftIconButtonClick={this.handleToggle.bind(this)}
          iconElementRight={this.props.isAuthenticated ?
            <IconButton onClick={this.handleLogOutClick.bind(this, false)}>
              <PowerSettingsNew />
            </IconButton> : null
          }
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
        }} open={this.props.drawer}>
            <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Balances')} exact activeClassName="active" to="/">
              <i className="material-icons">account_balance_wallet</i>Balances
            </NavLink>
            {this.props.accountExists ?
            (
              <div>
                <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Payments')} exact activeClassName="active" to="/payments/">
                  <i className="material-icons">payment</i>Payments
                </NavLink>
                <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Account')} exact activeClassName="active" to="/account/">
                  <i className="material-icons">account_balance</i>Account
                </NavLink>
              </div>
            ) : null}

        </Drawer>
        </div>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountExists: state.accountExists,
    assets: state.accountAssets,
    view: state.selectedView,
    drawer: state.drawerState,
    isAuthenticated: state.isAuthenticated,
    currentAccount: state.currentAccount,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    sideBarMenuSelect,
    sideBarMenuToggle,
    logOutButtonPress,
    logInViaPublicKey,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Header)
