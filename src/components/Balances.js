import React, {Component} from 'react'
import './Balances.css'
import {connect} from 'react-redux'

class Balances extends Component {
  render() {
    return (
      <div>
        {this.props.accountExists ? (
          <div>Account Info</div>
        ) : (
          <div>This account does not exist on Stellar ledger.</div>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountExists: state.accountExists,
  }
}

export default connect(mapStateToProps)(Balances)
