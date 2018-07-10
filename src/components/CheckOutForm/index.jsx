import React, { Component } from "react"
import Button from "../../lib/mui-v1/Button"
import "./index.css"

import { CardElement, injectStripe } from "react-stripe-elements"

class CheckoutForm extends Component {

    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
    }

    async submit (_ev) {
        let { token, } = await this.props.stripe.createToken({ name: "Name", })
        // eslint-disable-next-line no-console
        console.log(token)
    }

    render = () =>
        <div className="f-b-c">
            <div className="stripe-checkout">
                <CardElement />
            </div>
            <div>
                <Button color="primary" onClick={this.submit}>
                    Charge
                </Button>
            </div>
        </div>

}

export default injectStripe(CheckoutForm)
