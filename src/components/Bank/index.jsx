import React, { Fragment } from "react"

import BankAppBar from "./BankAppBar"
import BankDrawer from "./BankDrawer"
import BankContent from "./BankContent"
import Footer from "../Layout/Footer"




// <Bank> component
export default () =>
    <Fragment>
        <BankAppBar />
        <BankDrawer />
        <BankContent />
        <Footer />
    </Fragment>
