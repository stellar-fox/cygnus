import React from "react"
import Dialog from "material-ui/Dialog"

import "./index.css"




// <Modal> component
export default ({
    title, actions, open, hideModal, children,
}) =>
    <Dialog
        paperClassName="paper-modal"
        titleClassName="title-modal"
        title={title}
        actions={actions}
        modal={true}
        open={open}
        onRequestClose={hideModal}
        autoScrollBodyContent={true}
    >
        {children}
    </Dialog>
