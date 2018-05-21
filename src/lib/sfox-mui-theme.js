import { createMuiTheme } from "@material-ui/core/styles"




// ...
export default createMuiTheme({

    palette: {
        primary: {
            main: "rgb(15, 46, 83)",
            light: "rgb(36, 65, 98)",
        },

        secondary: {
            main: "rgb(244, 176, 4)",
            light: "rgb(246, 190, 49)",
            dark: "rgb(156, 113, 3)",
        },

        primaryColor: "rgb(15, 46, 83)",
        secondaryColor: "rgb(244, 176, 4)",
        primaryHighlight: "rgb(36, 65, 98)",
        secondaryHighlight: "rgb(246, 190, 49)",
        primaryLightFade: "rgba(15, 46, 83, 0.8)",
        secondaryLightFade: "rgba(244, 176, 4, 0.6)",

        success: "rgb(34, 139, 34)",
        successHighlight: "rgb(10, 38, 10)",
        warning: "rgb(244, 176, 4)",
        warningHighlight: "rgb(67, 48, 2)",
        danger: "rgb(211, 47, 47)",
        dangerHighlight: "rgb(58, 13, 13)",
        disabledColor: "rgba(200, 145, 4, 0.8)",
        disabledBackgroundColor: "rgba(200, 145, 4, 0.3)",
        disabledSwitchColor: "rgb(110, 80, 3)",

        background: {
            paper: "rgb(244, 176, 4)",
            default: "rgb(15, 46, 83)",
        },

        spacing: {
            unit: "1rem",
        },
    },

    typography: {
        caption: {
            fontSize: "0.6rem",
        },
    },

    zIndex: {
        appBar: 10001,
    },

})
