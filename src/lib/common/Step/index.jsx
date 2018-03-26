import React, { Fragment } from "react"
import {
    Step as MUIStep,
    StepLabel,
    StepContent
} from "material-ui/Stepper"




// <Step> component
export default ({
    icon, label, active, content,
}) =>
    <MUIStep
        children={
            <Fragment>
                <StepLabel
                    style={{
                        fontSize: "1.2rem",
                        color: "rgba(15,46,83,0.9)",
                    }}
                    icon={<i className="material-icons">{icon}</i>}
                    children={label}
                />
                <StepContent
                    active={active}
                    style={{
                        borderLeft: "1px solid rgba(15,46,83,0.2)",
                        fontSize: "1rem",
                        color: "rgba(15,46,83,1)",
                    }}
                    children={content}
                />
            </Fragment>
        }
    />
