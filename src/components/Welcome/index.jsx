import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "material-ui-next/styles"
import Grid from "material-ui-next/Grid"
import Paper from "material-ui-next/Paper"

import Heading from "./Heading"
import PanelLedger from "./PanelLedger"
import PanelLogin from "./PanelLogin"
import PanelExplorer from "./PanelExplorer"
import Footer from "../Layout/Footer"

import "./index.css"




// <Welcome> component
export default withStyles({

    considerFooter: { paddingBottom: 26, },

    noScrollBarFix: { padding: 16, },

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
            this.setState({ modalButtonText: text, })


        // ...
        handleSignup = () =>
            this.setState({
                modalButtonText: "CANCEL",
                modalShown: true,
            })


        // ...
        render = () => (
            ({ classes, }) =>
                <div className={classes.considerFooter}>
                    <Heading />
                    <div className={classes.noScrollBarFix}>
                        <Grid container spacing={16}>
                            <Grid item xs>
                                <Paper className={classes.paper}>
                                    <PanelLedger />
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper className={classes.paper}>
                                    <PanelLogin />
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper className={classes.paper}>
                                    <PanelExplorer />
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Footer />
                </div>
        )(this.props)

    }
)
