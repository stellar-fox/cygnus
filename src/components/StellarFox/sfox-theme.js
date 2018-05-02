import { createMuiTheme } from "material-ui-next/styles"




// ...
export default createMuiTheme({

    palette: {
        primaryColor: "rgb(15,46,83)",
        secondaryColor: "rgb(244,176,4)",
        primaryHighlight: "rgb(36,65,98)",
        secondaryHighlight: "rgb(246,190,49)",
        success: "rgb(34,139,34)",
        successHighlight: "rgb(10,38,10)",
        warning: "rgb(244,176,4)",
        warningHighlight: "rgb(67,48,2)",
        danger: "rgb(211,47,47)",
        dangerHighlight: "rgb(58,13,13)",
        disabledColor: "rgba(200,145,4,0.8)",
        disabledBackgroundColor: "rgba(200,145,4,0.3)",
        disabledSwitchColor: "rgb(110,80,3)",

        background: {
            default: "rgb(15,46,83)",
        },
    },

    zIndex: {
        appBar: 10001,
    },

})
