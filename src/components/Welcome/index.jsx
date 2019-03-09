import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose, bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import AboutContent from "./AboutContent"
import Heading from "./Heading"
import LoginChoices from "./LoginChoices"
import SummaryContent from "./SummaryContent"
import Footer from "../Layout/Footer"
import "./index.css"
import Loader from "../Loader"
import { setLoaded } from "../../thunks/main"
import Snacky from "../../lib/mui-v1/Snacky"




// <Welcome> component
export default compose(
    withStyles({
        considerFooter: { paddingBottom: 26 },

        noScrollBarFix: { padding: 16 },

        paper: {
            background: "linear-gradient(45deg, #091b31 0%, rgb(15, 46, 83) 50%)",
            height: "100%",
        },
    }),
    connect(
        // map state to props.
        (state) => ({
            loading: state.App.loading,
        }),
        // map actions to props.
        (dispatch) => bindActionCreators({
            setLoaded,
        }, dispatch)
    )
)(
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
        componentDidMount = () => setTimeout(this.props.setLoaded, 1000)


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
            ({ classes, loading }) =>
                loading ? <Loader infoMessage="Loading ..." /> :
                    <div className={classes.considerFooter}>
                        <Snacky />
                        <Heading />
                        <LoginChoices />
                        <SummaryContent />
                        <AboutContent />
                        <Footer />
                    </div>
        )(this.props)

    }
)
