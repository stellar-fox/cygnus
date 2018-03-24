import React from "react"
import {
    appVersion,
    appName,
    appCopyDates,
    appLandingPageLink,
} from "../../env"

import "./Footer.css"




// <Footer> component
export default () =>
    <div className="footer">
        <div className="flex-row-space-between">
            <div>
                &copy;
                &nbsp;<a target="_blank"
                    href={appLandingPageLink}>
                    <span className="stellar-style">{appName}</span>
                </a>&nbsp;
                {appCopyDates}.
            </div>
            <div>ver. {appVersion}</div>
        </div>
    </div>
