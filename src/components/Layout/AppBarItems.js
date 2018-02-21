import React, { Component } from "react"

import "./AppBarItems.css"




// ...
export default class AppBarItems extends Component {

    // ...
    render () {
        return (
            <div className="app-bar-items">
                <div className="app-bar-title">
                    <div className="bar-title-account">
                        {this.props.accountTitle}
                    </div>
                    <div className="bar-subtitle-account">
                        {this.props.accountNumber}
                    </div>
                </div>
            </div>
        )
    }

}
