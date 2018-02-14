import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  logOutOfHorizon,
  logOut,
  openDrawer,
  closeDrawer,
  selectView,
} from '../actions/index'
import {NavLink} from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import './Header.css'
import AppBarTitle from './AppBarTitle'
import AppBarItems from './AppBarItems'
import IconButton from 'material-ui/IconButton'

class Header extends Component {
  handleToggle() {
    this.props.ui.drawer.isOpened ?
     this.props.closeDrawer() : this.props.openDrawer()
  }
  handleMenuClick(view, obj) {
    this.props.selectView(view)
    setTimeout(() => {
      this.props.closeDrawer()
    }, 300)
  }
  handleLogOutClick(state) {
    this.props.logOutOfHorizon()
    this.props.logOut()
    this.props.selectView('/')
    sessionStorage.clear()
  }

  render() {
    return (
      <div>
        <AppBar
          title={
            <div className="flex-row">
              <AppBarTitle title={
                <span>
                  <span>Stellar Fox</span>
                  <span className="header-badge">
                    testnet
                  </span>
                  {this.props.auth.ledgerSoftwareVersion && (
                    <span className="p-l">
                      <img src="/img/ledger.svg" width="50px" alt="Ledger" />
                    </span>
                  )}
                </span>
              } subtitle={
                this.props.nav.view
              }/>
              <AppBarItems accountTitle={
                  (this.props.accountInfo.exists === true &&
                    this.props.accountInfo.account.account.home_domain !== undefined) ?
                    <div className="account-home-domain">
                      {this.props.accountInfo.account.account.home_domain}
                    </div> : <div>Account Number</div>

              } accountNumber={
                this.props.accountInfo.pubKey.slice(0,6) +
                '-' + this.props.accountInfo.pubKey.slice(50)
              }/>
            </div>
          }
          className="navbar"
          style={{
            position:'fixed',
            left:0,
            top:0
          }}
          onLeftIconButtonClick={this.handleToggle.bind(this)}
          iconElementRight={
            <IconButton iconStyle={{color: 'rgba(15,46,83,0.45)'}} onClick={this.handleLogOutClick.bind(this, false)}>
              <i className="material-icons">power_settings_new</i>
            </IconButton>
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
        }} open={this.props.ui.drawer.isOpened}>
            <NavLink className='menu-item'
              onClick={this.handleMenuClick.bind(this, 'Balances')}
              exact activeClassName="active" to="/">
              <i className="material-icons">account_balance_wallet</i>Balances
            </NavLink>
            {this.props.accountInfo.exists ?
            (
              <div>
                <NavLink className='menu-item'
                  onClick={this.handleMenuClick.bind(this, 'Payments')}
                  exact activeClassName="active" to="/payments/">
                  <i className="material-icons">payment</i>Payments
                </NavLink>
                
              </div>
            ) : null}
            <NavLink className='menu-item'
              onClick={this.handleMenuClick.bind(this, 'Account')}
              exact activeClassName="active" to="/account/">
              <i className="material-icons">account_balance</i>Account
            </NavLink>
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountInfo: state.accountInfo,
    auth: state.auth,
    nav: state.nav,
    ui: state.ui
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    logOutOfHorizon,
    logOut,
    openDrawer,
    closeDrawer,
    selectView,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Header)
