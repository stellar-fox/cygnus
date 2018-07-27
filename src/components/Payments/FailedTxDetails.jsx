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
import {
    utcToLocaleDateTime,
} from "../../lib/utils"
import Button from "../../lib/mui-v1/Button"
import { StellarSdk } from "../../lib/utils"




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
        formatTxFailReasons = (reasons) => (decoder =>
            reasons.map((r, index) =>
                <div key={index}
                    className="f-b-c p-l-small"
                >
                    <Typography color="primary"
                        variant="body2"
                    >
                        <span aria-label="cross" role="img">
                            ❌
                        </span> {decoder[r]}
                    </Typography>
                </div>
            )
        )({"op_no_trust" : "No Trustline",})


        // ...
        submitTransaction = (xdrBody, _event) => {
            // eslint-disable-next-line no-console
            console.log(xdrBody)
            // eslint-disable-next-line no-console
            console.log(JSON.stringify(StellarSdk.xdr.TransactionEnvelope.fromXDR(xdrBody, "base64")))
        }


        // ...
        render = () => (
            ({ classes, data, }) =>
                <Fragment>
                    <div className="p-t-large p-b">
                        <Typography color="secondary" variant="title">
                            Pending Transaction Details
                        </Typography>
                        <Typography color="secondary" variant="subheading">
                            Manage pending transactions here.
                        </Typography>
                    </div>
                    <Paper>
                        {data.length === 0 ?
                            <div className={classes.nodata}>
                                <Typography align="center" color="primary"
                                    variant="body1"
                                >
                                    Select pending transaction to view details here.
                                </Typography>
                            </div> :
                            <div className={classNames(classes.withdata, "p-t p-l p-b")}>
                                <Typography color="primary"
                                    variant="body1"
                                >
                                    Last Transmit Attempt: {
                                        utcToLocaleDateTime(data.lastAttempt)
                                    }
                                </Typography>
                                <Typography color="primary"
                                    variant="body1"
                                >
                                    Reasons:
                                </Typography>

                                {this.formatTxFailReasons(data.reason.operations)}

                                <Typography color="primary"
                                    variant="body1"
                                >
                                    Retry Attempts: {data.retries}
                                </Typography>
                                <Button color="primary"
                                    onClick={this.submitTransaction.bind(this, data.xdrBody)}
                                >Retry Now</Button>
                            </div>
                        }
                    </Paper>
                </Fragment>
        )(this.props)

    }
)
