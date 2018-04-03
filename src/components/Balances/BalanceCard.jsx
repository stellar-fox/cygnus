import React, { Component } from "react"
import { connect } from "react-redux"
import { BigNumber } from "bignumber.js"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import {
    Card,
    CardActions,
    CardHeader,
    CardText,
} from "material-ui/Card"
import {
    currencyGlyph,
} from "../../lib/utils"
import Button from "../../lib/common/Button"


class BalanceCard extends Component {

    constructor (props) {
        super(props)
        this.otherBalances = this.getOtherBalances(this.props.strAccount)
        this.props.assetManager.updateExchangeRate(this.props.Account.currency)
    }


    // ...
    getCurrencyLongText = (currency) => (
        (c) => c[Object.keys(c).filter((key) => key === currency)]
    )({
        eur: "European Union Euro",
        usd: "United States Dollar",
        aud: "Australian Dollar",
        nzd: "New Zealand Dollar",
        thb: "Thai Baht",
        pln: "Polish Złoty",
    })


    // ...
    exchangeRateFetched = () => (
        this.props.Assets[this.props.Account.currency]
    )


    // ...
    getNativeBalance = (account) => {
        let nativeBalance = 0

        account.balances.forEach((balance) => {
            if (balance.asset_type === "native") {
                nativeBalance = balance.balance
            }
        })

        return nativeBalance
    }


    // ...
    getOtherBalances = (account) =>
        account.balances.map((balance, index) => {
            if (balance.asset_type !== "native") {
                return (
                    <p className="other-assets" key={`${index}-${balance.asset_code}`}>
                        <span className="other-asset-balance">
                            {balance.balance
                                // Number.parseFloat(balance.balance)
                                //     .toFixed(
                                //         this.props.accountInfo.precision
                                //     )
                            }
                        </span>
                        <span className="other-asset-code">
                            {balance.asset_code}
                        </span>
                    </p>
                )
            }
            return null
        })


    // ...
    convertToFiat = (amount) => {
        BigNumber.config({ DECIMAL_PLACES: 2, })
        const nativeAmount = new BigNumber(amount)

        if (this.props.Assets[this.props.Account.currency]) {
            return nativeAmount.multipliedBy(
                this.props.Assets[this.props.Account.currency].rate
            ).toFixed(2)
        } else {
            return "0"
        }
    }


    // ...
    render = () => <Card className="account">
        <CardHeader
            title={
                <span>
                    <span>Current Balance </span>
                    <i className="material-icons">hearing</i>
                </span>
            }
            subtitle={
                <span>
                    <span>
                        {this.getCurrencyLongText(this.props.Account.currency)}
                    </span>
                    <span className="fade currency-iso p-l-small">
                        ({this.props.Account.currency.toUpperCase()})
                    </span>
                </span>
            }
            actAsExpander={true}
            showExpandableButton={true}
        />


        <CardText>
            <div className="flex-row">
                <div>
                    <div className="balance">
                        <span className="fade currency-glyph">
                            {currencyGlyph(this.props.Account.currency)}
                        </span>
                        <span className="p-l-small">
                            {this.exchangeRateFetched() &&
                                this.convertToFiat(
                                    this.getNativeBalance(
                                        this.props.strAccount))
                            }
                        </span>
                    </div>
                    <div className="fade-extreme micro">
                        {this.getNativeBalance(this.props.strAccount)} XLM
                    </div>
                </div>
                <div></div>
            </div>
        </CardText>


        <CardActions>
            <Button
                backgroundColor="rgb(15,46,83)"
                labelColor="#228B22"
                label="Fund"
                onClick={this.handleOpen}
            />
            <Button
                backgroundColor="rgb(15,46,83)"
                labelColor="rgb(244,176,4)"
                label="Request"
                onClick={this.handleOpen}
            />
            {this.props.loginManager.isPayEnabled() ||
                this.props.loginManager.isAuthenticated() ?
                <Button
                    backgroundColor="rgb(15,46,83)"
                    labelColor="#d32f2f"
                    label="Pay"
                    onClick={this.showPaymentCard}
                /> : null
            }
        </CardActions>
        <CardText expandable={true}>
            <div>
                <div>Other Assets</div>
                <div>
                    {this.otherBalances && this.otherBalances[0] ?
                        this.otherBalances :
                        <div className='faded'>
                            You currently do not own any other assets.
                        </div>
                    }
                </div>
            </div>
        </CardText>
    </Card>
}

// ...
export default withLoginManager(withAssetManager(connect(
    // map state to props.
    (state) => ({
        Account: state.Account,
        Assets: state.Assets,
        strAccount: state.accountInfo.account.account,
    }),

    // // map dispatch to props.
    // (dispatch) => bindActionCreators({
    //     changeLoginState,
    //     changeModalState,
    //     setAccountRegistered,
    // }, dispatch)
)(BalanceCard)))