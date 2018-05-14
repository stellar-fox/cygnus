import React, { Component } from "react"
import PropTypes from "prop-types"

import { env } from "../../components/StellarFox"

import { withStyles } from "@material-ui/core/styles"
import { Snackbar } from "@material-ui/core"




// <CustomSnackbar> component
export default withStyles((theme) => ({

    primary: {
        backgroundColor: theme.palette.primaryColor,
        color: theme.palette.secondaryColor,
    },

    secondary: {
        backgroundColor: theme.palette.secondaryColor,
        color: theme.palette.primaryColor,
    },

}))(
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
                    ContentProps={{
                        "aria-describedby": "message-id",
                        classes: { root: classes[color], },
                    }}
                    message={<span id="message-id">{message}</span>}
                    transitionDuration={{ enter: 300, exit: 200, }}
                    disableWindowBlurListener={true}
                />
        )(this.props)

    }
)
