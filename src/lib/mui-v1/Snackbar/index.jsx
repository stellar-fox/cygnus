import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "material-ui-next/styles"
import { env } from "../../../components/StellarFox"
import Snackbar from "material-ui-next/Snackbar"




// ...
const styles = (theme) => ({
    primary: {
        backgroundColor: theme.palette.primaryColor,
        color: theme.palette.secondaryColor,
    },
    secondary: {
        backgroundColor: theme.palette.secondaryColor,
        color: theme.palette.primaryColor,
    },
})


// ...
export default withStyles(styles)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, onClose, message, open, color, }) => 
                <Snackbar
                    open={open}
                    autoHideDuration={env.snackbarAutoHideDuration}
                    onClose={onClose}
                    SnackbarContentProps={{
                        "aria-describedby": "message-id",
                        classes: {root: classes[color],},
                    }}
                    message={<span id="message-id">{message}</span>}
                    transitionDuration={{ enter: 300, exit: 200, }}
                    disableWindowBlurListener={true}
                />
        )(this.props)

    }
)
