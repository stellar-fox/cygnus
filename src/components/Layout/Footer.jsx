import React from "react"
import {
    appVersion,
    appName,
    appCopyDates,
    appLandingPageLink,
} from "../StellarFox/env"
import {
    htmlEntities as he,
    emoji
} from "../../lib/utils"

import "./Footer.css"




// <Footer> component
export default () =>
    <div className="footer">
        <div className="flex-row-space-between">
            <div>
                <he.Copy /><he.Nbsp /><he.Nbsp />
                <a target="_blank"
                    href={appLandingPageLink}>
                    <span className="stellar-style">{appName}</span>
                </a>
                <he.Nbsp /><he.Nbsp />
                <emoji.Rocket />
                <he.Nbsp /><he.Nbsp />
                {appCopyDates}.
            </div>
            <div>
                ver.<he.Nbsp />
                <span className="stellar-style">{appVersion}</span>
                <he.Nbsp /><he.Nbsp />
                <emoji.Fire />
                <he.Nbsp /><he.Nbsp />
            </div>
        </div>
    </div>
