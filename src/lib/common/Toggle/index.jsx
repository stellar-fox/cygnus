import React from "react"
import Toggle from "material-ui/Toggle"




const styles = {
    thumbStyle: {
        backgroundColor: "#616161",
    },
    trackStyle: {
        backgroundColor: "rgba(117,117,117,0.75)",
    },
    thumbSwitchedStyle: {
        backgroundColor: "rgb(244,176,4)",
    },
    trackSwitchedStyle: {
        backgroundColor: "rgba(244,176,4,0.75)",
    },
    labelStyle: {
        color: "rgb(244,176,4)",
    },
}




// <Toggle> component
export default (props) =>
    <Toggle
        label={props.label}
        thumbStyle={props.thumbStyle || styles.thumbStyle}
        trackStyle={props.trackStyle || styles.trackStyle}
        thumbSwitchedStyle={props.thumbSwitchedStyle ||
            styles.thumbSwitchedStyle}
        trackSwitchedStyle={props.trackSwitchedStyle ||
            styles.trackSwitchedStyle}
        labelStyle={props.labelStyle || styles.labelStyle}
        onToggle={props.onToggle}
        defaultToggled={props.defaultToggled}
    />
