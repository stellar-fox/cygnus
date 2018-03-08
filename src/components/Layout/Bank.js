import React, { Fragment } from "react"
import {
    WalletAppBar,
    WalletDrawer,
} from "./Header"
import Content from "./Content"
import Footer from "./Footer"




// Bank component
export default () =>
    <Fragment>
        <WalletAppBar />
        <WalletDrawer />
        <Content />
        <Footer />
    </Fragment>
