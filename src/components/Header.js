import React, {Component} from 'react'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {sideBarMenuSelect, sideBarMenuToggle} from '../actions/index'

import {NavLink} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import './Header.css'


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

  componentDidMount() {
    // this.props.sideBarMenuSelect('Stellar Fox')
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
        <AppBar
          title={"Stellar Fox - " + this.props.view}
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
        }} open={this.props.drawer}>
            <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Balances')} exact activeClassName="active" to="/balances/">
              <i style={{fontSize: 21, verticalAlign: 'text-bottom', paddingRight: 10}} className="material-icons">account_balance_wallet</i>Balances
            </NavLink>
            <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Payments')} exact activeClassName="active" to="/payments/">
              <i style={{fontSize: 21, verticalAlign: 'text-bottom', paddingRight: 10}} className="material-icons">payment</i>Payments
            </NavLink>
            <NavLink className='menu-item' onClick={this.handleMenuClick.bind(this, 'Account')} exact activeClassName="active" to="/account/">
              <i style={{fontSize: 21, verticalAlign: 'text-bottom', paddingRight: 10}} className="material-icons">account_balance</i>Account
            </NavLink>
            <div>{this.props.assets.map((asset) => {
              return (
                <p key={asset.asset_code}>{asset.asset_code} : {asset.balance}</p>
              )
            })}</div>
        </Drawer>
        </div>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    assets: state.accountAssets,
    view: state.selectedView,
    drawer: state.drawerState,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({sideBarMenuSelect, sideBarMenuToggle}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Header)
