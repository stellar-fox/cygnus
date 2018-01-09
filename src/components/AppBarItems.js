import React, {Component} from 'react'
import './AppBarItems.css'

class AppBarTitle extends Component {
  render() {
    return (
      <div className="app-bar-items">
        {this.props.accountNumber}
      </div>
    )
  }
}

export default AppBarTitle
