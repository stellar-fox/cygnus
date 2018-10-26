import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"

import { withStyles } from "@material-ui/core/styles"
import { LinearProgress, Typography, } from "@material-ui/core"



// <TxBroadcastMsg> component
export default compose(
    withStyles(theme => ({
        barRoot: {
            height: "5px",
            borderRadius: "10px",
            border: `1px solid ${theme.palette.secondary.dark}`,
        },

        colorPrimary: {
            backgroundColor: theme.palette.secondary.light,
        },

        barColorPrimary: {
            backgroundColor: theme.palette.primary.fade,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {}


        // ...
        render = () => (
            ({ classes }) =>
                <Fragment>
                    <div className="p-b flex-box-col items-centered">
                        <Typography variant="body1" color="primary" align="center">
                            Digital fingerprint is being lodged.
                        </Typography>
                        <Typography variant="caption" color="primary" align="center">
                            Estimated time: 5 seconds. Thank you for your patience.
                        </Typography>
                    </div>

                    <LinearProgress
                        color="primary"
                        variant="indeterminate"
                        classes={{
                            root: classes.barRoot,
                            colorPrimary: classes.colorPrimary,
                            barColorPrimary: classes.barColorPrimary,
                        }}
                    />
                </Fragment>
        )(this.props)

    }
)
