import React, { Component } from "react"
import {defaultGravatar} from "../StellarFox/env"
import Input from "../../lib/common/Input"


// <Profile> component
export default class Profile extends Component {
    state = {
        firstName: "",
    }

    // ...
    changeFirstName = (event) =>
        this.setState({ firstName: event.target.value, })

    render = () =>
        <div className="tab-content">
            <div className="f-b space-between">
                <div>
                    <h2 className="tab-content-headline">
                        Account Profile
                    </h2>
                    <div className="account-title">
                        Manage your profile details.
                    </div>
                    <div className="account-subtitle">
                        Your payment address is visible
                        to the public by default.
                        The details of your account profile are
                        confidential and contribute to KYC/AML
                        compliance.
                    </div>
                </div>
                <figure style={{
                    marginRight: "0px",
                    marginBottom: "0px",
                }}>
                    <img
                        className="image"
                        src={defaultGravatar}
                        alt="Gravatar"
                    />
                </figure>
            </div>

            <div className="f-b p-t-large">
                <Input
                    width="100%"
                    className="lcars-input p-b"
                    value={this.state.firstName}
                    label="First Name"
                    inputType="text"
                    maxLength="100"
                    autoComplete="off"
                    handleChange={
                        this.changeFirstName
                    }
                    subLabel={
                        "First Name: " +
                        this.state.firstName
                    }
                />
            </div>

        </div>
}