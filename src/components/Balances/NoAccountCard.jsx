import React, { Component } from "react"
import { compose } from "redux"
import { connect } from "react-redux"
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




// <NoAccountCard> component
class NoAccountCard extends Component {

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
                            {currencyGlyph(
                                this.props.Account.currency
                            )}
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
                onClick={this.handleOpen}
                backgroundColor="rgb(15,46,83)"
                labelColor="#228B22"
                label="Fund" />
            <Button
                backgroundColor="rgb(15,46,83)"
                labelColor="rgb(244,176,4)"
                label="Request"
                onClick={this.handleOpen}
            />
        </CardActions>
    </Card>
}


// ...
export default compose(
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({ Account: state.Account, }),
    )
)(NoAccountCard)
