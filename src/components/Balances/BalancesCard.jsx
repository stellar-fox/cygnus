import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import { notImplementedText } from "../StellarFox/env"
import {
    Card,
    CardActions,
    CardHeader,
    CardText,
} from "material-ui/Card"
import Button from "../../lib/common/Button"
import AssetList from "./AssetList"
import { action as AlertAction } from "../../redux/Alert"
import { action as BalancesAction } from "../../redux/Balances"



// <BalancesCard> component
class BalancesCard extends Component {

    // ...
    componentDidMount = () => {
        this.props.assetManager.updateExchangeRate(this.props.Account.currency)
    }


    // ...
    togglePaymentCard = () =>
        this.props.setState({
            payCardVisible: !this.props.Balances.payCardVisible,
        })


    // ...
    showNotImplementedModal = () =>
        this.props.showAlert(notImplementedText, "Not Yet Implemented")


    // ...
    exchangeRateFetched = () => this.props.Assets[this.props.Account.currency]


    // ...
    render = () =>
        <Card className="account">
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
                            {
                                this.props
                                    .assetManager.getAssetDescription(
                                        this.props.Account.currency
                                    )
                            }
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
                                {
                                    this.props
                                        .assetManager.getAssetGlyph(
                                            this.props.Account.currency
                                        )
                                }
                            </span>
                            <span className="p-l-small">
                                {
                                    this.props
                                        .assetManager.convertToAsset(
                                            this.props.StellarAccount.balance
                                        )
                                }
                            </span>
                        </div>
                        <div className="fade-extreme micro">
                            {this.props.StellarAccount.balance} XLM
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
                    onClick={this.showNotImplementedModal}
                />
                <Button
                    backgroundColor="rgb(15,46,83)"
                    labelColor="rgb(244,176,4)"
                    label="Request"
                    onClick={this.showNotImplementedModal}
                />
                {
                    this.props.loginManager.isPayEnabled() ?
                        <Button
                            backgroundColor="rgb(15,46,83)"
                            labelColor="#d32f2f"
                            label="Pay"
                            onClick={this.togglePaymentCard}
                        /> : null
                }
            </CardActions>

            <CardText expandable={true}>
                <Fragment>
                    {Array.isArray(this.props.StellarAccount.assets)
                        && this.props.StellarAccount.assets.length > 0 ?
                        <Fragment>
                            <div className="assets p-b-small">Other Assets List:</div>
                            <AssetList />
                        </Fragment> : <Fragment>
                            <div className="assets">Other Assets</div>
                            <div className='faded'>
                                You currently do not own any other assets.
                            </div>
                        </Fragment>
                    }
                </Fragment>
            </CardText>
        </Card>

}


// ...
export default compose(
    withLoginManager,
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({
            Balances: state.Balances,
            Account: state.Account,
            Assets: state.Assets,
            StellarAccount: state.StellarAccount,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
            showAlert: AlertAction.showAlert,
        }, dispatch)
    )
)(BalancesCard)
