import React, {Component} from "react"
import "./AppBarTitle.css"

class AppBarTitle extends Component {
    render () {
        return (
            <div className="flex-start">
                <div className="app-bar-title">
                    <div className="bar-title">
                        {this.props.title}
                    </div>
                    <div className="bar-subtitle">
                        {this.props.subtitle}
                    </div>
                </div>
                <div className="indicator-set-col">
                    <div>
                        {this.props.network}
                    </div>
                    <div className="p-b-small"></div>
                    <div>
                        {this.props.ledgerUsed}
                    </div>
                </div>
            </div>
        )
    }
}

export default AppBarTitle
