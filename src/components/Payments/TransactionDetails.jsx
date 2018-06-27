import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Paper, Typography,
} from "@material-ui/core"
import { htmlEntities as he } from "../../lib/utils"
import classNames from "classnames"




// <TransactionDetails> component
export default compose(
    withStyles({
        nodata: {
            display: "flex",
            flexDirection: "column",
            alignContent: "flex-start",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
        },
        withdata: {
            minHeight: 200,
        },
    }),
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
            ({ classes, data, }) =>
                <Fragment>
                    <div className="p-t-large p-b">
                        <Typography color="secondary" variant="title">
                            Transaction Details
                        </Typography>
                        <Typography color="secondary" variant="subheading">
                            Additional information about selected transaction.
                        </Typography>
                    </div>
                    <Paper>
                        {data.length === 0 ?
                            <div className={classes.nodata}>
                                <Typography align="center" color="primary"
                                    variant="body1"
                                >
                                    Select transaction to view details here.
                                </Typography>
                            </div> :
                            <div
                                className={
                                    classNames(classes.withdata, "p-t p-l p-b")
                                }
                            >
                                <Typography color="primary"
                                    variant="body2"
                                >
                                    <span className="fade-strong">
                                        Transaction ID:
                                    </span>
                                    <he.Nbsp /><he.Nbsp />
                                    <span className="smaller">
                                        {data.r.id}
                                    </span>
                                </Typography>

                                <Typography color="primary"
                                    variant="body2"
                                >
                                    <span className="fade-strong">
                                        From:
                                    </span>
                                    <he.Nbsp /><he.Nbsp />
                                    <span className="smaller">
                                        {data.r.source_account}
                                    </span>
                                </Typography>

                                {data.operations.map((operation, index) =>
                                    <Fragment>
                                        <Typography key={index} color="primary"
                                            variant="body2"
                                        >
                                            <span className="fade-strong">
                                                Type:
                                            </span>
                                            <he.Nbsp /><he.Nbsp />
                                            <span className="smaller">
                                                {operation.type}
                                            </span>
                                        </Typography>
                                        <Typography key={index} color="primary"
                                            variant="body2"
                                        >
                                            <span className="fade-strong">
                                                Destination:
                                            </span>
                                            <he.Nbsp /><he.Nbsp />
                                            <span className="smaller">
                                                {operation.destination}
                                            </span>
                                        </Typography>
                                        <Typography key={index} color="primary"
                                            variant="body2"
                                        >
                                            <span className="fade-strong">
                                                Amount:
                                            </span>
                                            <he.Nbsp /><he.Nbsp />
                                            <span className="smaller">
                                                {operation.amount}
                                            </span>
                                        </Typography>
                                    </Fragment>
                                )}
                            </div>
                        }
                    </Paper>
                </Fragment>
        )(this.props)

    }
)
