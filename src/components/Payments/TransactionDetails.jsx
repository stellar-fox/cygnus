import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Avatar, Paper, Typography,
} from "@material-ui/core"
import {
    htmlEntities as he, findContactByPublicKey, formatFullName,
    formatPaymentAddress, pubKeyAbbr,
} from "../../lib/utils"
import classNames from "classnames"
import { choose } from "@xcmats/js-toolbox"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import { gravatar, gravatarSize48 } from "../../components/StellarFox/env"
import md5 from "../../lib/md5"
import NumberFormat from "react-number-format"
import BigNumber from "bignumber.js"



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
        operationType = (operation) => (
            (iconClass) =>
                choose(
                    operation.type,
                    {
                        "createAccount": () =>
                            operation.funder === this.props.publicKey ?
                                <i className={iconClass}>card_giftcard</i> :
                                <div className="f-b-c">
                                    <i className={iconClass}>
                                        account_balance
                                    </i>
                                    <Typography variant="subheading"
                                        color="primary"
                                    >
                                        Account Opened
                                    </Typography>
                                </div>,
                        "accountMerge": () =>
                            <i className={iconClass}>merge_type</i>,
                    },
                    () =>
                        operation.destination === this.props.publicKey ?
                            <div className="f-b-c">
                                <i className={iconClass}>
                                    account_balance_wallet
                                </i>
                                <Typography variant="subheading"
                                    color="primary"
                                >
                                    Credit
                                </Typography>
                                <i className={`${iconClass} p-l p-r`}>
                                    forward
                                </i>
                            </div> :
                            <div className="f-b-c">
                                <i className={iconClass}>payment</i>
                                <Typography variant="subheading"
                                    color="primary"
                                >
                                    Debit
                                </Typography>
                                <i className={`${iconClass} p-l p-r`}>
                                    forward
                                </i>
                            </div>
                )
        )("material-icons badge")


        // ...
        isNative = (operation) =>
            (operation.asset && operation.asset.code === "XLM")
                || operation.startingBalance


        // ...
        opAmount = (operation) => choose(
            operation.type,
            {
                // createAccount is always in native currency
                "createAccount": () => this.opNativeAmount(operation),

                // payment can be in any asset
                "payment": () => operation.asset ?
                    operation.amount :
                    this.props.assetManager.convertToAsset(operation.amount),
            }
        )


        // ...
        opNativeAmount = (operation) => {
            BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4, })
            return choose(
                operation.type,
                {
                    "createAccount": () => new BigNumber(
                        operation.startingBalance
                    ).toFixed(7),
                },
                () => this.isNative(operation) ?
                    new BigNumber(operation.amount).toFixed(7) :
                    new BigNumber(operation.amount).toString()
            )
        }


        // ...
        opAssetSymbol = (operation) => choose(
            operation.type,
            {
                "createAccount": () => "XLM",
            },
            () => operation.asset.code
        )


        // ...
        displayAmount = (operation) =>
            this.isNative(operation) ?
                this.props.assetManager.convertToAsset(
                    this.opNativeAmount(operation)
                ) : this.opNativeAmount(operation)


        // ...
        accountInfo = (publicKey) => {
            if (publicKey === this.props.publicKey) {
                return (
                    <div className="f-b-c">
                        <span className="p-r-small">
                            <Avatar src={`${gravatar}${this.props.gravatarHash}?${
                                gravatarSize48}&d=robohash`}
                            />
                        </span>
                        <div className="compact">
                            <div className="text-primary">
                                {formatFullName(
                                    this.props.firstName,
                                    this.props.lastName
                                )}
                            </div>
                            <div>
                                <span className="micro fade-strong">
                                    {this.props.paymentAddress}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }

            const contact = findContactByPublicKey(
                this.props.contacts, publicKey
            )

            if (contact) {
                return (
                    <div className="f-b-c">
                        <span className="p-r-small">
                            <Avatar src={`${gravatar}${contact.email_md5}?${
                                gravatarSize48}&d=robohash`}
                            />
                        </span>
                        <div className="compact">
                            <div className="text-primary">
                                {formatFullName(contact.first_name,
                                    contact.last_name)}
                            </div>
                            <div>
                                <span className="micro fade-strong">
                                    {formatPaymentAddress(
                                        contact.alias, contact.domain
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                <div className="f-b-c">
                    <span className="p-r-small">
                        <Avatar src={`${gravatar}${md5(publicKey)}?${
                            gravatarSize48}&d=robohash`}
                        />
                    </span>
                    <Typography variant="body2" color="primary">
                        {pubKeyAbbr(publicKey)}
                    </Typography>
                </div>
            )
        }


        // ...
        listOperations = (operations) =>
            <div className="p-t-medium">
                <Typography color="primary" variant="subheading">
                    Operations
                </Typography>

                {operations.map((operation, index) =>
                    <div className="p-t-medium p-l paper" key={index}>

                        <div className="f-b-c">
                            <Typography color="primary" variant="body2">
                                <span className="smaller">
                                    {this.operationType(operation)}
                                </span>
                            </Typography><he.Nbsp />
                            <Typography color="primary"
                                variant="body2"
                            >
                                {this.accountInfo(operation.destination)}
                            </Typography>
                        </div>

                        <div className="p-t">
                            <Typography color="primary" variant="subheading">
                                <span className="fade-strong">
                                    Amount:
                                </span>
                                <he.Nbsp /><he.Nbsp />

                                {this.isNative(operation) ?
                                    this.props.assetManager.getAssetGlyph(
                                        this.props.currency
                                    ) : operation.asset.code
                                }
                                <he.Nbsp />
                                <NumberFormat
                                    value={this.displayAmount(operation)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimals={2}
                                />
                                <he.Nbsp /><he.Nbsp />
                                {this.isNative(operation) ?
                                    <span className="tiny fade-strong">
                                        <NumberFormat
                                            value={this.opAmount(operation)}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimals={7}
                                        />
                                        <he.Nbsp />
                                        {this.opAssetSymbol(operation)}
                                        <he.Nbsp /><he.Nbsp />
                                        (Native Payment)
                                    </span> :
                                    <span className="tiny fade-strong">
                                        (Currency/Asset Payment)
                                    </span>
                                }

                            </Typography>
                        </div>

                    </div>
                )}
            </div>



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
                                    <span className="tiny fade-extreme">
                                        Transaction:
                                    </span>
                                    <he.Nbsp /><he.Nbsp />
                                    <span className="tiny fade-extreme">
                                        {data.r.id}
                                    </span>
                                </Typography>


                                <div className="p-t">
                                    <Typography color="primary"
                                        variant="body2"
                                    >
                                        <span className="fade-strong">
                                            From:
                                        </span>
                                    </Typography>
                                </div>

                                <div className="p-t p-l">
                                    <Typography color="primary"
                                        variant="body2"
                                    >
                                        {this.accountInfo(
                                            data.r.source_account
                                        )}
                                    </Typography>
                                </div>

                                {data.r.memo_type !== "none" &&
                                    <div className="p-t">
                                        <Typography color="primary"
                                            variant="body2"
                                        >
                                            <span className="fade-strong">
                                                Purpose: <he.Nbsp />{data.r.memo}
                                            </span>
                                        </Typography>
                                    </div>
                                }

                                <div className="p-t">
                                    <Typography color="primary"
                                        variant="body2"
                                    >
                                        <span className="fade-strong">
                                            Fee Paid: <he.Nbsp />{data.r.fee_paid}
                                        </span>
                                    </Typography>
                                </div>

                                {this.listOperations(data.operations)}

                            </div>
                        }
                    </Paper>
                </Fragment>
        )(this.props)

    }
)
