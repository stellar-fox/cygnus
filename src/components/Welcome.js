import React, {Component} from 'react'
import './Welcome.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
  logInViaPublicKey,
  sideBarMenuToggle,
  sideBarMenuSelect,
  updateAccountNumber,
} from '../actions/index'

class Welcome extends Component {
  componentDidMount() { // this is simulating login via ledger
    setTimeout(() => {
      this.props.logInViaPublicKey(true)
      this.props.sideBarMenuToggle(true)
      this.props.sideBarMenuSelect('Balances')
      this.props.updateAccountNumber('GAZ-FOX')
    },3000)
  }

  render() {
    return (
      <div>
        Welcome
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    logInViaPublicKey,
    sideBarMenuToggle,
    sideBarMenuSelect,
    updateAccountNumber,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Welcome)
