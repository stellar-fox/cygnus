import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Grow,
    Icon,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import {
    accountIsLocked,
    currentAccountReserve,
} from "../../lib/utils"
import { stellarLumenSymbol } from "../StellarFox/env"
import NumberFormat from "react-number-format"
import { action as BalancesAction } from "../../redux/Balances"
import {
    assetDescription,
    assetGlyph,
} from "../../lib/asset-utils"
import { nativeToAsset } from "../../logic/assets"




/**
 * Cygnus.
 *
 * Balance summary card.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<BalanceSummary>` component.
 *
 * @function BalanceSummary
 * @returns {React.ReactElement}
 */
const BalanceSummary = ({
    accountId, balance, bip32Path, classes, className, currency,
    fundCardVisible, preferredRate, payCardVisible,
    publicKey, setBalancesState, signers,
    subentryCount,
}) => {

    // ...
    const toggleFundCard = () =>
        setBalancesState({
            fundCardVisible: !fundCardVisible,
        })


    // ...
    const togglePaymentCard = () =>
        setBalancesState({
            payCardVisible: !payCardVisible,
        })


    return <Grow in={true}><Card
        className={className}
        classes={{ root: classes.card }}
    >
        <CardHeader
            title="Current Balance"
            subheader={assetDescription(currency)}
        />
        <CardContent>
            <div className="flex-box-row space-between">

                {/* Left Side Section */}
                <div>
                    <div className="text-primary">
                        <span className="fade currency-glyph">
                            {assetGlyph(currency)}
                        </span>
                        <span className="p-l-medium balance tabular-nums">
                            <NumberFormat
                                value={nativeToAsset(
                                    balance,
                                    preferredRate
                                )}
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        </span>

                        {accountIsLocked(signers, accountId) &&
                            <div className="red"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                <Icon
                                    style={{
                                        marginLeft: "1rem",
                                        marginBottom: "6px",
                                        fontSize: "20px",
                                    }}
                                >
                                lock
                                </Icon>
                                <span style={{
                                    fontSize: "14px",
                                    marginBottom: "3px",
                                    marginLeft: "2px",
                                }}
                                >
                                    Account Locked
                                </span>
                            </div>
                        }

                    </div>
                    <Typography color="primary" variant="h5"
                        className="fade-extreme tabular-nums"
                    >
                        {stellarLumenSymbol} <NumberFormat
                            value={balance}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={7}
                            fixedDecimalScale={true}
                        />
                    </Typography>
                    <Typography color="primary" variant="h5"
                        className="fade-extreme tabular-nums"
                    >{stellarLumenSymbol} 1 ≈ {
                            assetGlyph(currency)
                        } <NumberFormat
                            value={
                                nativeToAsset("1.0000000", preferredRate)
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </Typography>
                </div>


                {/* Right Side Section */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "flex-start",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography variant="caption" color="primary">
                        <span className="fade-strong">Min Balance</span>
                    </Typography>
                    <Typography variant="body1" color="primary">
                        <span
                            style={{ paddingRight: "3px" }}
                            className="fade"
                        >
                            {assetGlyph(currency)}
                        </span>
                        <span className="fade tabular-nums">
                            <NumberFormat
                                value={
                                    nativeToAsset(currentAccountReserve(
                                        subentryCount
                                    ), preferredRate)
                                }
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        </span>
                    </Typography>
                    <Typography variant="h5" color="primary">
                        <span className="fade-extreme tabular-nums">
                            {stellarLumenSymbol} <NumberFormat
                                value={
                                    currentAccountReserve(
                                        subentryCount
                                    )
                                }
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={7}
                                fixedDecimalScale={true}
                            />
                        </span>
                    </Typography>
                </div>
            </div>
            {accountIsLocked(signers, accountId) &&
                <Fragment>
                    <div className="flex-box-row">
                        <div className="m-t-medium badge-error">
                            <Typography variant="h3" color="inherit">
                                Account Locked
                            </Typography>
                        </div>
                    </div>
                    <div className="m-t flex-box-col">
                        <Typography variant="body1" color="textPrimary">
                            Warning!
                        </Typography>
                        <Typography variant="body2" color="primary">
                            This account has been locked and this state cannot
                            be undone. All remaining funds are frozen and final.
                        </Typography>
                        <Typography variant="body2" color="primary">
                            <b>DO NOT</b> deposit
                            anything onto this account as you will never be
                            able to recover or withdraw those funds.
                        </Typography>
                    </div>
                </Fragment>
            }
        </CardContent>
        <CardActions disableActionSpacing>
            {!accountIsLocked(signers, accountId) &&
                <Fragment>

                    <Button
                        color="success"
                        onClick={toggleFundCard}
                    >Fund</Button>

                    {publicKey && bip32Path &&
                    <Button
                        color="danger"
                        onClick={togglePaymentCard}
                    >Pay</Button>
                    }

                </Fragment>
            }
        </CardActions>
    </Card></Grow>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        card: {
            boxSizing: "border-box",
            borderRadius: "2px",
        },
        colorTextPrimary: {
            color: theme.palette.primary.other,
        },
    })),
    connect(
        (state) => ({
            accountId: state.StellarAccount.accountId,
            balance: state.StellarAccount.balance,
            bip32Path: state.LedgerHQ.bip32Path,
            currency: state.Account.currency,
            fundCardVisible: state.Balances.fundCardVisible,
            payCardVisible: state.Balances.payCardVisible,
            publicKey: state.LedgerHQ.publicKey,
            signers: state.StellarAccount.signers,
            subentryCount: state.StellarAccount.subentryCount,
            preferredRate: state.ExchangeRates[state.Account.currency].rate,
        }),
        (dispatch) => bindActionCreators({
            setBalancesState: BalancesAction.setState,
        }, dispatch),
    ),
)(BalanceSummary)
