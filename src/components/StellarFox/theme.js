import getMuiTheme from "material-ui/styles/getMuiTheme"




// ...
const palette = {
    defaultColor: "rgb(251,192,45)",
    defaultTextColor: "rgba(15,46,83,0.7)",
    primaryColor: "rgb(15,46,83)",
    secondaryColor: "rgb(244,176,4)",
    disabledPrimaryColor: "rgb(209,151,4)",
    disabledPrimaryTextColor: "rgb(244,176,4)",
}




// ...
export default getMuiTheme({

    tooltip: {
        color: "rgb(15,46,83)",
        rippleBackgroundColor: "rgb(244,176,4)",
    },

    raisedButton: {
        color: palette.defaultColor,
        textColor: palette.defaultTextColor,
        primaryColor: palette.primaryColor,
        primaryTextColor: palette.secondaryColor,
        secondaryColor: palette.secondaryColor,
        secondaryTextColor: palette.primaryColor,
        disabledColor: palette.disabledPrimaryColor,
        disabledTextColor: palette.disabledPrimaryTextColor,
    },

    flatButton: {
        textColor: palette.defaultTextColor,
        primaryColor: palette.primaryColor,
        primaryTextColor: palette.secondaryColor,
        secondaryColor: palette.secondaryColor,
        secondaryTextColor: palette.primaryColor,
        disabledTextColor: palette.disabledPrimaryColor,
    },

    datePicker: {
        selectColor: "rgb(15,46,83)",
        selectTextColor: "rgb(244,176,4)",
        headerColor: "rgb(15,46,83)",
        textColor: "rgb(244,176,4)",
    },

})
