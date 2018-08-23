import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    Card,
    CardActions,
    CardText,
} from "material-ui/Card"
import Button from "../../lib/mui-v1/Button"
import { action as ModalAction } from "../../redux/Modal"
import { Typography } from "@material-ui/core"




// <RegisterCard> component
class RegisterCard extends Component {

    // ...
    showSignupModal = () => this.props.showModal("signup")


    // ...
    render = () =>
        <Card className="welcome-card">
            <CardText>
                <div className="flex-box-col">
                    <Typography variant="headline" color="primary">
                        Hi there,
                    </Typography>
                    <br />
                    <Typography variant="body1" color="primary">
                        <span className="fade">
                        Welcome to your bank! It looks like this account has
                        not been registered with our service yet. Although,
                        it is possible to use the service now, plase consider
                        registering this account in order to take the advantage
                        of many security features that we have to offer and
                        find yourself on the safe side of transacting.
                        </span>
                    </Typography>


                </div>
            </CardText>
            <CardActions>
                <div className="flex-box-row space-between items-flex-end">
                    <Button
                        onClick={this.showSignupModal}
                        color="primary"
                    >Register</Button>
                    <Typography variant="caption" color="primary">
                        <span className="fade-extreme">
                            Registering with our service is free.
                        </span>
                    </Typography>
                </div>
            </CardActions>
        </Card>

}


// ...
export default connect(
    // map state to props.
    (_state) => ({}),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        showModal: ModalAction.showModal,
    }, dispatch)
)(RegisterCard)
