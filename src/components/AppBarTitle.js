import React, {Component} from 'react'
import './AppBarTitle.css'

class AppBarTitle extends Component {
  render() {
    return (
      <div className="app-bar-title">
        <div className="bar-title">
          {this.props.title}
        </div>
        <div className="bar-subtitle">
          {this.props.subtitle}
        </div>
      </div>
    )
  }
}

export default AppBarTitle
