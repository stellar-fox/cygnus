import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
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
import {
    togglePaymentCard,
} from "../../redux/actions"


class BalanceCard extends Component {

    constructor (props) {
        super(props)
        this.nativeBalance = this.props.assetManager.getAccountNativeBalance(
            this.props.strAccount)
        this.otherBalances = this.getOtherBalances(this.props.strAccount)
        this.props.assetManager.updateExchangeRate(this.props.Account.currency)
    }


    // ...
    showPaymentCard = () => {
        this.props.togglePaymentCard({
            payment: {
                opened: true,
            },
        })
    }


    // ...
    exchangeRateFetched = () => (
        this.props.Assets[this.props.Account.currency]
    )


    // ...
    getOtherBalances = (account) =>
        account.balances.map((balance, index) => {
            if (balance.asset_type !== "native") {
                return (
                    <p className="other-assets" key={`${index}-${balance.asset_code}`}>
                        <span className="other-asset-balance">
                            {balance.balance}
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
                        {this.props.assetManager.getAssetDescription(
                            this.props.Account.currency)}
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
                            {this.props.assetManager.convertToAsset(
                                this.nativeBalance
                            )}
                        </span>
                    </div>
                    <div className="fade-extreme micro">
                        {this.nativeBalance} XLM
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
        appUi: state.appUi,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        togglePaymentCard,
    }, dispatch)
)(BalanceCard)))