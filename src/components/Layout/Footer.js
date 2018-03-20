import React from "react"
import {
    appVersion,
    appName,
    appCopyDates,
} from "../../env.js"

import "./Footer.css"




// <Footer> component
export default () =>
    <div className="footer">
        <div className="flex-row-space-between">
            <div>
                &copy;
                &nbsp;<span className="stellar-style">{appName}</span>&nbsp;
                {appCopyDates}.
            </div>
            <div>ver. {appVersion}</div>
        </div>
    </div>
