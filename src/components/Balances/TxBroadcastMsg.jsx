import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    LinearProgress,
    Typography,
} from "@material-ui/core"




// <TxBroadcastMsg> component
export default compose(
    withStyles(theme => ({
        barRoot: {
            height: "5px",
            borderRadius: "5px",
            border: `1px solid ${theme.palette.secondary.dark}`,
            opacity: "0.8",
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
            title: PropTypes.string.isRequired,
        }


        // ...
        state = {}


        // ...
        render = () => (
            ({ classes, title }) =>
                <Fragment>
                    <div className="p-b flex-box-col items-centered">
                        <Typography
                            variant="h2"
                            style={{ lineHeight: "3rem" }}
                            color="primary"
                            noWrap
                        >
                            {title}
                        </Typography>
                        <Typography variant="body1" color="primary" noWrap>
                            Estimated confirmation time: <b>5 seconds</b>.
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

                    <div className="p-t flex-box-col items-centered">
                        <Typography variant="h6" color="primary" noWrap>
                            Thank you for your patience.
                        </Typography>
                    </div>
                </Fragment>
        )(this.props)

    }
)
