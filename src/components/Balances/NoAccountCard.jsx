import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Grow,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
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
 * `<NoAccountCard>` component.
 *
 * @function NoAccountCard
 * @returns {React.ReactElement}
 */
const NoAccountCard = ({
    classes, className, currency,fundCardVisible, preferredRate,
    setBalancesState,
}) => {

    // ...
    const toggleFundCard = () =>
        setBalancesState({
            fundCardVisible: !fundCardVisible,
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
                                value={"0.00"}
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        </span>

                    </div>
                    <Typography color="primary" variant="h5"
                        className="fade-extreme tabular-nums"
                    >
                        {stellarLumenSymbol} <NumberFormat
                            value={"0.0000000"}
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
                            value={nativeToAsset("1.0000000", preferredRate)}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </Typography>
                </div>

            </div>

        </CardContent>
        <CardActions disableActionSpacing>
            <Button
                color="success"
                onClick={toggleFundCard}
            >Fund</Button>
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
            currency: state.Account.currency,
            fundCardVisible: state.Balances.fundCardVisible,
            preferredRate: state.ExchangeRates[state.Account.currency].rate,
        }),
        (dispatch) => bindActionCreators({
            setBalancesState: BalancesAction.setState,
        }, dispatch),
    ),
)(NoAccountCard)
