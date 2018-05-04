import React from "react"

import "./index.css"




// <Panel> component
export default ({ title, content, }) =>
    <article className="message">
        <div className="message-header"><p>{title}</p></div>
        <div className="message-body">{content}</div>
    </article>
