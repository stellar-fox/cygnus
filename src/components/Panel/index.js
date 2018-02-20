import React, { Component } from "react"
import "./index.css"

export default class Panel extends Component {
    render () {
        return (
            <article className="message">
                <div className="message-header">
                    <p>{this.props.title}</p>
                </div>
                <div className="message-body">{this.props.content}</div>
            </article>
        )
    }
}
