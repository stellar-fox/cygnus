import React, { Fragment } from "react"
import {
    BankAppBar,
    BankDrawer,
} from "./Header"
import Content from "./Content"
import Footer from "./Footer"




// Bank component
export default () =>
    <Fragment>
        <BankAppBar />
        <BankDrawer />
        <Content />
        <Footer />
    </Fragment>
