import React, { Component } from "react"
import "./index.css"

export default class Panel extends Component {
    render () {
        return (
            <div className={this.props.className}>
                <article className="message" style={{margin: "0 auto 0 auto",}}>
                    <div className="message-header">
                        <p>{this.props.title}</p>
                    </div>
                    <div className="message-body">{this.props.content}</div>
                </article>
            </div>
        )
    }
}
