import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { TopBarSecurityMessage } from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import { getExchangeRate } from "../../thunks/assets"
import BottomHeadingContent from "./BottomHeadingContent"
import TopHeadingContent from "./TopHeadingContent"
import { Link } from "react-router-dom"




// <Heading> component
class Heading extends Component {

    // ...
    state = {
        loginButtonDisabled: true,
        loginObj: null,
    }


    // ...
    componentDidMount = () => this.props.getExchangeRate("usd")


    // ...
    render = () =>
        <Fragment>

            <TopBarSecurityMessage />

            <div className="faded-image cash">
                <TopHeadingContent />

                <div className="m-t-large hero">
                    <Typography variant="h1" color="secondary">
                        This is Cygnus.
                    </Typography>
                    <div className="title">
                        Welcome to the financial inclusion.
                    </div>
                    <div className="subtitle">
                        Open your <b>own</b> bank today and
                        reserve secure and personalized payment address.
                    </div>
                </div>

                <div className="flex-row-centered">
                    <Button
                        color="awesome"
                        component={Link}
                        to="/signup"
                    >
                        Open Free Account
                    </Button>
                </div>

                <div className="container m-t-large m-b">
                    <BottomHeadingContent />
                </div>
            </div>
        </Fragment>
}


// ...
export default connect(
    // map state to props.
    (_state) => ({}),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        getExchangeRate,
    }, dispatch)
)(Heading)
