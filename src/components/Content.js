import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import './Content.css'

import Balances from './Balances'
import Payments from './Payments'
import Account from './Account'


export default class Content extends Component {
  render() {
    return (
      <div style={{paddingLeft: this.props.open ? 200 : 20}} className='content'>
        <Route exact path="/balances" component={Balances}/>
        <Route exact path="/payments" component={Payments}/>
        <Route exact path="/account" component={Account}/>
      </div>
    )
  }
}
