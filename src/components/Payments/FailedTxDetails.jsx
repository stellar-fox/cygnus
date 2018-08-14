import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import classNames from "classnames"
import { connect } from "react-redux"
import { emptyString } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Paper, Typography,
} from "@material-ui/core"
import {
    utcToLocaleDateTime,
} from "../../lib/utils"
import Button from "../../lib/mui-v1/Button"
import { resubmitFundingTx } from "../../lib/utils"
import { action as PaymentsAction } from "../../redux/Payments"




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
            paddingBottom: "1rem",
        },
    }),
    connect(
        (state) => ({
            txDetails: state.Payments.savedTxDetails,
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
            publicKey: state.LedgerHQ.publicKey,
            currency: state.Account.currency,
            contacts: state.Contacts.internal.concat(state.Contacts.external),
            firstName: state.Account.firstName,
            lastName: state.Account.lastName,
            paymentAddress: state.Account.paymentAddress,
            gravatarHash: state.Account.gravatar,
        }),
        (dispatch) => bindActionCreators({
            setState: PaymentsAction.setState,
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
            error: false,
            errorMessage: emptyString(),
            inProgress: false,
            statusMessage: emptyString(),
        }


        // ...
        formatTxFailReasons = (reasons) => (decoder => {
            if (reasons) {
                return reasons.map((r, index) =>
                    <div key={index}
                        className="f-b-c p-l-small"
                    >
                        <Typography color="primary"
                            variant="body2"
                        >
                            <span aria-label="cross" role="img">•</span> {decoder[r]}
                        </Typography>
                    </div>
                )
            }
        })({
            "op_no_trust" : "No Trustline",
            "op_no_issuer" : "Invalid Issuer",
        })


        // ...
        submitTransaction = async (data) => {

            this.setState({
                inProgress: true,
                statusMessage: "Re-submitting transaction ...",
            })

            try {
                await resubmitFundingTx(
                    this.props.userId, this.props.token, data
                )
                this.setState({
                    inProgress: false,
                    statusMessage: emptyString(),
                })
                this.props.setState({
                    savedTxDetails: null,
                })
            } catch (error) {
                this.setState({
                    inProgress: false,
                    statusMessage: error.message,
                })
            }
        }


        // ...
        render = () => (
            ({ classes, txDetails, }) =>
                <Paper>
                    {txDetails ?
                        <div className={
                            classNames(classes.withdata, "p-t p-l")
                        }
                        >
                            <Typography color="primary" variant="body1">
                                Attempted: {utcToLocaleDateTime(
                                    txDetails.lastAttempt
                                )}
                            </Typography>
                            <br />
                            <Typography color="primary" variant="body1">
                                Reasons: {this.formatTxFailReasons(
                                    txDetails.reason.operations
                                )}
                            </Typography>
                            <br />
                            <Button color="primary"
                                onClick={this.submitTransaction.bind(this, txDetails)}
                                disabled={this.props.inProgress || !this.props.txDetails}
                            >
                                {this.state.inProgress ? <CircularProgress
                                    color="secondary" thickness={4} size={20}
                                /> : "Retry Now"}
                            </Button>
                        </div> :
                        <div className={classes.nodata}>
                            <Typography align="center" color="primary"
                                variant="body1"
                            >
                                Select pending transaction to view details here.
                            </Typography>
                        </div>
                    }
                </Paper>
        )(this.props)

    }
)
