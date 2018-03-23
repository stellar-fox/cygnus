import React, { Component } from "react"
import Dialog from "material-ui/Dialog"
import "./index.css"




// <Modal> component
export default class Modal extends Component {

    // ...
    render = () => <Dialog
        paperClassName="paper-modal"
        titleClassName="title-modal"
        title={this.props.title}
        actions={this.props.actions}
        modal={true}
        open={this.props.open}
        onRequestClose={this.props.hideModal}
        autoScrollBodyContent={true}
    >{this.props.children}</Dialog>
}
