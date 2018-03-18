import React, { Component } from "react"
import Dialog from "material-ui/Dialog"
import "./index.css"

export default class Modal extends Component {
    state = {
        modalShown: false,
    }

    showModal = () => {
        this.setState({
            modalShown: true,
        })
    }


    hideModal = () => {
        this.setState({
            modalShown: false,
        })
    }

    render = () =>
        <Dialog
            title={this.props.title}
            actions={this.props.actions}
            modal={true}
            open={this.props.open}
            onRequestClose={this.hideModal}
            paperClassName="modal-body"
            titleClassName="modal-title"
            autoScrollBodyContent={true}
        ></Dialog>

}
