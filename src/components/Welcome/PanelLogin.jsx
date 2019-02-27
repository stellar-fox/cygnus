import React from "react"

import { appName } from "../StellarFox/env"

import Login from "../Login"
import Panel from "../../lib/mui-v1/Panel"

import sflogo from "../StellarFox/static/sf-logo.svg"




// <PanelLogin> component
export default () =>
    <Panel title="Login with email/password">
        <div className="panel-logo-container">
            <div className="panel-logo">
                <img
                    className="img-logo"
                    src={sflogo}
                    width="160px"
                    alt={appName}
                />
            </div>
        </div>
        <div className="panel-title">
            Manage your account<br />
            <em>with ease</em>.
        </div>
        <div className="title-small p-t">
            Once you have opened your
            account you can log in here
            to your banking terminal.
        </div>
        <Login />
    </Panel>
