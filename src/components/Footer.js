import React, {Component} from 'react'
import './Footer.css'


export default class Footer extends Component {
  render() {
    return (
      <div className='footer'>
        <div className="flex-row-space-between">
          <div>
            © <span>Stellar Fox</span> 2017-2018.
          </div>
          <div>
            ver. 0.1.16
          </div>
        </div>
      </div>
    )
  }
}
