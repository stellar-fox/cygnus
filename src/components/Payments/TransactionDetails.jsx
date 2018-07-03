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
import { choose } from "@xcmats/js-toolbox"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"




// <TransactionDetails> component
export default compose(
    withLoginManager,
    withAssetManager,
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
        state = {}


        // ...
        operationType = (operation) => (
            (iconClass) =>
                choose(
                    operation.type,
                    {
                        "createAccount": () =>
                            operation.funder === this.props.publicKey ?
                                <i className={iconClass}>card_giftcard</i> :
                                <i className={iconClass}>account_balance</i>,
                        "accountMerge": () =>
                            <i className={iconClass}>merge_type</i>,
                    },
                    () =>
                        operation.destination === this.props.publicKey ?
                            <i className={iconClass}>
                                account_balance_wallet
                            </i> :
                            <Fragment>
                                <i className={iconClass}>payment</i>
                            </Fragment>
                )
        )(
            this.props.loginManager.isAuthenticated() ?
                "material-icons badge" :
                "material-icons"
        )


        opNativeAmount = (operation) => choose(
            operation.type,
            {
                "createAccount": () => operation.startingBalance,
            },
            () => operation.amount
        )



        opCurrencyAmount = (operation) =>
            this.props.assetManager.convertToAsset(
                this.opNativeAmount(operation)
            )




        // ...
        determinePrimaryText = (payment) => (
            (glyph) =>
                choose(
                    payment.type,
                    {
                        "create_account": () => (
                            (Sign) =>
                                <span>
                                    <Sign /><he.Space />{glyph}<he.Space />
                                    {this.props.assetManager.convertToAsset(
                                        payment.starting_balance)}
                                </span>
                        )(
                            payment.funder === this.props.publicKey ?
                                he.Minus : he.Plus
                        ),
                        "account_merge": () => "Account Merged",
                    },
                    () => (
                        (assetCode, Sign) => assetCode === "XLM" ?
                            <span>
                                <Sign /><he.Space />{glyph}<he.Space />
                                {this.props.assetManager.convertToAsset(
                                    payment.amount)}
                            </span> :
                            <span>
                                <Sign /><he.Space />
                                {payment.amount}<he.Space />{assetCode}
                            </span>
                    )(
                        this.props.assetManager.getAssetCode(payment),
                        payment.to === this.props.publicKey ?
                            he.Plus : he.Minus
                    )
                )
        )(this.props.assetManager.getAssetGlyph(this.props.Account.currency))



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


                                <Typography color="primary"
                                    variant="subheading"
                                >
                                    Operations
                                </Typography>

                                {data.operations.map((operation, index) =>
                                    <div className="p-l-small" key={index}>

                                        <Typography color="primary"
                                            variant="body2"
                                        >
                                            <span className="smaller">
                                                {this.operationType(operation)}
                                            </span>
                                        </Typography>

                                        <Typography color="primary"
                                            variant="body2"
                                        >
                                            <span className="fade-strong">
                                                To:
                                            </span>
                                            <he.Nbsp /><he.Nbsp />
                                            <span className="smaller">
                                                {operation.destination}
                                            </span>
                                        </Typography>

                                        <Typography color="primary"
                                            variant="body2"
                                        >
                                            <span className="fade-strong">
                                                Amount:
                                            </span>
                                            <he.Nbsp /><he.Nbsp />
                                            <span className="smaller">
                                                {this.opCurrencyAmount(operation)}
                                                {this.props.assetManager.getAssetGlyph(this.props.currency)}
                                            </span>
                                            <he.Nbsp /><he.Nbsp />
                                            <span className="micro fade-strong">
                                                {this.opNativeAmount(operation)} XLM
                                            </span>
                                        </Typography>

                                    </div>
                                )}
                            </div>
                        }
                    </Paper>
                </Fragment>
        )(this.props)

    }
)
