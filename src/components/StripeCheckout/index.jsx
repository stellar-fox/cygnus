import React, { Component } from "react"
import { config } from "../../config"
import { Elements, StripeProvider } from "react-stripe-elements"
import CheckOutForm from "../CheckOutForm"



// ...
class StripeCheckout extends Component {


    // ...
    render = () =>
        <StripeProvider apiKey={config.stripe.apiKey}>
            <Elements>
                <CheckOutForm />
            </Elements>
        </StripeProvider>

}

export default StripeCheckout
