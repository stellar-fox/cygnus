import React from "react"
import { snackBarAutoHideDuration } from "../../components/StellarFox/env"
import Snackbar from "material-ui/Snackbar"




// ...
const styles = {
    body: {
        backgroundColor: "rgb(244,176,4)",
    },
    content: {
        color: "rgb(15,46,83)",
    },
}


// <SnackBar> component
export default (props) =>
    <Snackbar
        bodyStyle={styles.body}
        contentStyle={styles.content}
        open={props.open}
        message={props.message}
        autoHideDuration={snackBarAutoHideDuration}
        onRequestClose={props.onRequestClose}
    />
