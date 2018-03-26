import React from "react"
import "./index.css"




// <Panel> component
export default ({
    className,
    title,
    content,
}) =>
    <div className={className}>
        <article className="message" style={{ margin: "0 auto 0 auto", }}>
            <div className="message-header">
                <p>{title}</p>
            </div>
            <div className="message-body">{content}</div>
        </article>
    </div>
