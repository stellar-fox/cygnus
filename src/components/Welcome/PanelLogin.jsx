import React, { Component } from "react"
import { appName } from "../../env"
import Login from "../Login"
import Panel from "../Panel"




// <PanelLogin> component
export default class PanelLogin extends Component {

    // ...
    render = () =>
        <Panel
            className="welcome-panel-center"
            title="Customize"
            content={
                <div>
                    <img
                        style={{marginBottom: "4px",}}
                        src="/img/sf.svg"
                        width="140px"
                        alt={appName}
                    />
                    <div className="title">
                        Manage your account with ease.
                    </div>
                    <div className="title-small p-t">
                        Once you have opened your
                        account you can log in here
                        to your banking terminal.
                    </div>
                    <div className="f-b">
                        <Login />
                    </div>
                </div>
            }
        />
}

