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
    withStyles((theme) => ({
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
        avatar: {
            border: `1px solid ${theme.palette.secondary.dark}`,
            background: "linear-gradient(90deg, rgb(244, 176, 4) 0%, rgb(138, 151, 175) 100%)",
        },
    })),
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
                                    <i className={`${iconClass} p-l p-r fade-extreme`}>
                                        forward
                                    </i>
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
                                <i className={`${iconClass} p-l p-r fade-extreme`}>
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
                                <i className={`${iconClass} p-l p-r fade-extreme`}>
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

        feeAmount = (fee) => {
            BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4, })
            return new BigNumber(fee).dividedBy(10000000).toFixed(7)
        }


        // ...
        opAssetSymbol = (operation) => choose(
            operation.type,
            {
                "createAccount": () => <span className="nano">XLM</span>,
            },
            () => <span className="nano">{operation.asset.code}</span>
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
                            <Avatar className={this.props.classes.avatar}
                                src={`${gravatar}${this.props.gravatarHash}?${
                                    gravatarSize48}&d=robohash`}
                            />
                        </span>
                        <div className="compact">
                            <div className="text-primary you-badge">
                                {formatFullName(
                                    this.props.firstName,
                                    this.props.lastName
                                )}
                            </div>
                            <div>
                                {this.props.paymentAddress ?
                                    <span className="micro fade-strong">
                                        {this.props.paymentAddress}
                                    </span> :
                                    <span className="micro fade-strong">
                                        {pubKeyAbbr(this.props.publicKey)}
                                    </span>
                                }
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
                            <Avatar className={this.props.classes.avatar}
                                src={`${gravatar}${contact.email_md5}?${
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
                        <Avatar className={this.props.classes.avatar}
                            src={`${gravatar}${md5(publicKey)}?${
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
            <div className="p-t">

                <div className="micro text-primary fade-strong no-margin">
                    Account operations performed in this transaction:
                </div>


                {operations.map((operation, index) =>
                    <div className="p-l paper" key={index}>

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
                            <Typography color="primary" variant="body1">
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
                                    <span className="tiny fade-extreme">
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
            ({ assetManager, classes, data, publicKey, }) =>
                <Fragment>
                    <Paper>
                        {data.length === 0 ?
                            <div className={classes.nodata}>
                                <Typography align="center" color="primary"
                                    variant="subheading"
                                >
                                    <span className="fade-extreme">
                                        Select transaction above to view details here.
                                    </span>
                                </Typography>
                            </div> :


                            <div
                                className={
                                    classNames(classes.withdata, "p-t p-l p-b")
                                }
                            >
                                <div className="flex-box-row space-between p-r">
                                    <Typography color="primary"
                                        variant="body2" noWrap
                                    >
                                        <span className="tiny fade-extreme">
                                            Transaction:
                                        </span>
                                        <he.Nbsp /><he.Nbsp />
                                        <span className="tiny fade-strong">
                                            {data.r.id}
                                        </span>
                                    </Typography>
                                    {data.r.memo_type !== "none" &&
                                    <Typography color="primary"
                                        variant="body2" noWrap
                                    >
                                        <span className="tiny fade-extreme">
                                            Memo:
                                        </span>
                                        <he.Nbsp /><he.Nbsp />
                                        <span className="tiny fade-strong">
                                            {data.r.memo}
                                        </span>
                                    </Typography>
                                    }
                                </div>

                                <div className="p-t flex-box-row items-centered">
                                    <Typography color="primary"
                                        variant="body1"
                                    >
                                        <span className="fade-strong">
                                            From:
                                        </span>
                                    </Typography><he.Nbsp /><he.Nbsp /><he.Nbsp />
                                    <Typography color="primary"
                                        variant="body2"
                                    >
                                        {this.accountInfo(
                                            data.r.source_account
                                        )}
                                    </Typography>
                                </div>

                                <div className="p-t">
                                    <Typography color="primary"
                                        variant="body1"
                                    >
                                        <span className="fade-strong">
                                            Fee Paid:
                                        </span>
                                        <he.Nbsp />
                                        {this.props.assetManager.getAssetGlyph(
                                            this.props.currency
                                        )} {assetManager.convertToAsset(
                                            this.feeAmount(data.r.fee_paid)
                                        )}
                                        <he.Nbsp /><he.Nbsp />
                                        <span className="tiny fade-extreme">
                                            {this.feeAmount(data.r.fee_paid)}
                                            <he.Nbsp />
                                            <span className="nano">XLM</span>
                                        </span>
                                    </Typography>
                                </div>

                                {this.listOperations(data.operations.filter(
                                    (op) => (op.destination === publicKey ||
                                        (!op.source))
                                ))}

                            </div>
                        }
                    </Paper>
                </Fragment>
        )(this.props)

    }
)
