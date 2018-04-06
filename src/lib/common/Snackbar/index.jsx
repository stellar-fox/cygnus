import React from "react"
import { env } from "../../../components/StellarFox"
import Snackbar from "material-ui/Snackbar"




// ...
const snackbarStyles = {
    body: {
        backgroundColor: "rgb(244,176,4)",
    },
    content: {
        color: "rgb(15,46,83)",
    },
}




// <Snackbar> component
export default ({
    open, message, onRequestClose,
}) =>
    <Snackbar
        bodyStyle={snackbarStyles.body}
        contentStyle={snackbarStyles.content}
        open={open}
        message={message}
        autoHideDuration={env.snackbarAutoHideDuration}
        onRequestClose={onRequestClose}
    />
