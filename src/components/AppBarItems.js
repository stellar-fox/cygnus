import React, {Component} from 'react'
import './AppBarItems.css'

class AppBarTitle extends Component {
  render() {
    return (
      <div className="app-bar-items">
        <div className="app-bar-title">
          <div className="bar-title-account">
            Account Number
          </div>
          <div className="bar-subtitle-account">
            {this.props.accountNumber}
          </div>
        </div>
      </div>
    )
  }
}

export default AppBarTitle
