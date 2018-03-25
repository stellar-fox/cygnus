import React, { Component, Fragment } from "react"
import {
    Step,
    StepLabel,
    StepContent
} from "material-ui/Stepper"

import "./index.css"



// <Modal> component
export default class StepTemplate extends Component {

    // ...
    render = () => <Step
        children={
            <Fragment>
                <StepLabel
                    style={{
                        fontSize: "1.2rem",
                        color: "rgba(15,46,83,0.9)",
                    }}
                    icon={
                        <i className="material-icons">
                            {this.props.icon}
                        </i>
                    }
                    children={this.props.label}
                />
                <StepContent
                    active={this.props.active}
                    style={{
                        borderLeft: "1px solid rgba(15,46,83,0.2)",
                        fontSize: "1rem",
                        color: "rgba(15,46,83,1)",
                    }}
                    children={this.props.content}
                />
            </Fragment>
        }
    />


}
