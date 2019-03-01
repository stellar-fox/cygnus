import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import AboutContent from "./AboutContent"
import Heading from "./Heading"
import LoginChoices from "./LoginChoices"
import SummaryContent from "./SummaryContent"
import Footer from "../Layout/Footer"
import "./index.css"




// <Welcome> component
export default withStyles({

    considerFooter: { paddingBottom: 26 },

    noScrollBarFix: { padding: 16 },

    paper: {
        background: "linear-gradient(45deg, #091b31 0%, rgb(15, 46, 83) 50%)",
        height: "100%",
    },

})(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            modalShown: false,
            modalButtonText: "CANCEL",
        }


        // ...
        setModalButtonText = (text) =>
            this.setState({ modalButtonText: text })


        // ...
        handleSignup = () =>
            this.setState({
                modalButtonText: "CANCEL",
                modalShown: true,
            })


        // ...
        render = () => (
            ({ classes }) =>
                <div className={classes.considerFooter}>
                    <Heading />
                    <LoginChoices />
                    <SummaryContent />
                    <AboutContent />
                    <Footer />
                </div>
        )(this.props)

    }
)
