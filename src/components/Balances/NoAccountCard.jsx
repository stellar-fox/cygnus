import React, { Component } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withAssetManager } from "../AssetManager"
import { notImplementedText } from "../StellarFox/env"
import {
    Card,
    CardActions,
    CardHeader,
    CardText,
} from "material-ui/Card"
import Button from "../../lib/mui-v1/Button"
import { action as AlertAction } from "../../redux/Alert"



// <NoAccountCard> component
class NoAccountCard extends Component {

    // ...
    showNotImplementedModal = () =>
        this.props.showAlert(notImplementedText, "Not Yet Implemented")


    // ...
    render = () => <Card className='account'>
        <CardHeader
            title={
                <span>
                    <span>Current Balance&nbsp;</span>
                    <i className="material-icons">hearing</i>
                </span>
            }
            subtitle={
                <span>
                    <span>
                        {this.props.assetManager.getAssetDescription(
                            this.props.Account.currency
                        )}
                    </span>
                    <span className="fade currency-iso p-l-small">
                        ({this.props.Account.currency.toUpperCase()})
                    </span>
                </span>
            }
            actAsExpander={false}
            showExpandableButton={false}
        />

        <CardText>
            <div className='flex-row'>
                <div>
                    <div className='balance'>
                        <span className="fade currency-glyph">
                            {
                                this.props.assetManager.getAssetGlyph(
                                    this.props.Account.currency
                                )
                            }
                        </span> 0.00
                    </div>
                    <div className="fade-extreme micro">
                        0.0000000 XLM
                    </div>
                </div>
                <div></div>
            </div>
        </CardText>

        <CardActions>
            <Button
                onClick={this.showNotImplementedModal}
                color="success"
            >Fund</Button>
            <Button
                onClick={this.showNotImplementedModal}
                color="warning"
            >Request</Button>
        </CardActions>
    </Card>

}


// ...
export default compose(
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({ Account: state.Account, }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            showAlert: AlertAction.showAlert,
        }, dispatch)
    )
)(NoAccountCard)
