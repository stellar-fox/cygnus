import React from "react"
import { env } from "../StellarFox"
import {
    emoji,
    htmlEntities as he,
} from "../../lib/utils"

import "./Footer.css"




// <Footer> component
export default () =>
    <div className="footer">
        <div className="flex-row-space-between">
            <div>
                <he.Nbsp /><he.Nbsp />
                <he.Copy /><he.Nbsp /><he.Nbsp />
                <a target="_blank"
                    href={env.appLandingPageLink}>
                    <span className="stellar-style">{env.appName}</span>
                </a>
                <he.Nbsp /><he.Nbsp />
                <emoji.Fox />
                <he.Nbsp /><he.Nbsp />
                {env.appCopyDates}.
            </div>
            <div>
                ver.<he.Nbsp />
                <span className="stellar-style">{env.appVersion}</span>
                <he.Nbsp /><he.Nbsp />
                <emoji.Rocket />
                <he.Nbsp /><he.Nbsp />
            </div>
        </div>
    </div>
