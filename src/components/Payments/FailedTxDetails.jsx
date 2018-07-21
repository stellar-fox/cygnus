import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import classNames from "classnames"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Paper, Typography,
} from "@material-ui/core"




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
        (state) => ({
            publicKey: state.LedgerHQ.publicKey,
            currency: state.Account.currency,
            contacts: state.Contacts.internal.concat(state.Contacts.external),
            firstName: state.Account.firstName,
            lastName: state.Account.lastName,
            paymentAddress: state.Account.paymentAddress,
            gravatarHash: state.Account.gravatar,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }



        // ...
        render = () => (
            ({ classes, data, }) =>
                <Fragment>
                    <div className="p-t-large p-b">
                        <Typography color="secondary" variant="title">
                            Failed Transaction Details
                        </Typography>
                        <Typography color="secondary" variant="subheading">
                            Manage transactions here.
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
                            </div> : <div className={classNames(classes.withdata, "p-t p-l p-b")}></div>
                        }
                    </Paper>
                </Fragment>
        )(this.props)

    }
)
