import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import { Typography, withStyles } from "@material-ui/core"
import { action as BalancesAction } from "../../redux/Balances"
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card"
import Button from "../../lib/mui-v1/Button"
import { withLoginManager } from "../LoginManager"




export default compose(
    withLoginManager,
    withStyles({
        cardActions: {
            padding: "1rem",
        },
    }),
    connect(
        (state) => ({
            fundCardVisible: state.Balances.fundCardVisible,
            horizon: state.StellarAccount.horizon,
            publicKey: state.LedgerHQ.publicKey,
        }),
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
        }, dispatch)
    ),
)(

    class FundCard extends Component {

        // ...
        toggleFundCard = () =>
            this.props.setState({
                fundCardVisible: !this.props.fundCardVisible,
            })

        // ...
        render = () => (
            ({ classes, publicKey }) => <Card className='account'>
                <CardHeader
                    title={
                        <span>
                            <span>Fund your account.</span>
                        </span>
                    }
                    subtitle="Use available methods below to purchase transfer tokens."
                    actAsExpander={false}
                    showExpandableButton={false}
                />

                <CardText>
                    <Typography variant="subtitle1" color="inherit">
                        Fund with Stellar Lumens.
                        <Typography variant="caption" color="inherit">
                            Send any amount of Stellar Lumens to the
                            following address.
                        </Typography>
                    </Typography>
                    <div className="p-l p-t-small bg-green">
                        {publicKey}
                    </div>
                </CardText>

                <CardActions classes={{ root: classes.cardActions }}>
                    <div className="f-e">
                        <Button color="primary" onClick={this.toggleFundCard}>
                            Done
                        </Button>
                    </div>
                </CardActions>
            </Card>)(this.props)
    }
)
