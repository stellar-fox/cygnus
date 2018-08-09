import React from "react"
import { config } from "../../config"
import { Elements, StripeProvider } from "react-stripe-elements"
import CheckOutForm from "../CheckOutForm"



// <StripeCheckout> component
export default () =>
    <StripeProvider apiKey={config.stripe.apiKey}>
        <Elements>
            <CheckOutForm />
        </Elements>
    </StripeProvider>
