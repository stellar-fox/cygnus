import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
    Backdrop,
    Fade,
    Modal,
} from "@material-ui/core"

import "./index.css"


const useStyles = makeStyles(theme => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: "2px",
    },
}))


// <Modal> component
export default ({ open, hideModal, children }) => {
    const classes = useStyles()

    return <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={hideModal}
        onBackdropClick={hideModal}
        onEscapeKeyDown={hideModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 300,
        }}
    >
        <Fade in={open}>
            <div className={classes.paper}>
                {children}
            </div>
        </Fade>
    </Modal>
}

