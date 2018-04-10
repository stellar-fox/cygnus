import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    Card,
    CardActions,
    CardText,
} from "material-ui/Card"
import { htmlEntities as he } from "../../lib/utils"
import Button from "../../lib/common/Button"
import {
    changeModalState,
} from "../../redux/actions"



// <RegisterCard> component
class RegisterCard extends Component {

    // ...
    showSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: true,
            },
        })


    // ...
    render = () => <Card className="welcome-card">
        <CardText>
            <div className="flex-row">
                <div>
                    <div className="balance">Hi there!</div>
                    <div>
                        <p>
                            It looks like this account is not yet registered with our service.
                            Registered accounts put you in compliance with local and
                            international money transmitting laws. You will also be able
                            to transact easily with anyone and take advantage of
                            some awesome features that we offer!
                        </p>
                        <p> Here are some of them:</p>
                        <ul>
                            <li>One click, pay to contact.</li>
                            <li>Create multiple escrow accounts.</li>
                            <li>Customize your payment address.</li>
                            <li>Create and manage contact book of your payees.</li>
                            <li>Gain access to powerful account settings.</li>
                        </ul>
                        <p>Would you like to open one today?
                            It<he.Apos />s super easy!</p>
                    </div>
                    <div className="fade-extreme small-icon">
                        <i className="material-icons">blur_on</i>
                        Registering with our service is free. Forever.
                        We only charge fractional fees when you choose
                        to use our remittance service.
                    </div>
                </div>
            </div>
        </CardText>
        <CardActions>
            <Button
                onClick={this.showSignupModal}
                backgroundColor="rgb(15,46,83)"
                labelColor="rgb(244,176,4)"
                label="Register"
            />
        </CardActions>
    </Card>
}


// ...
export default connect(
    // map state to props.
    (_state) => ({}),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeModalState,
    }, dispatch)
)(RegisterCard)