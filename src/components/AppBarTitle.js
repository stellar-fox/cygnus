import React, {Component} from 'react'
import './AppBarTitle.css'

class AppBarTitle extends Component {
  render() {
    return (
      <div className="app-bar-title">
        <div className="title">
          {this.props.title}
        </div>
        <div className="subtitle">
          {this.props.subtitle}
        </div>
      </div>
    )
  }
}

export default AppBarTitle
