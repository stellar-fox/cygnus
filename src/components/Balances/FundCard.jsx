import React from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { action as BalancesAction } from "../../redux/Balances"
import {
    Card,
    CardActions,
    CardContent,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"




// ...
const FundCard = (props) => {
    const { classes } = props,
        toggleFundCard = () =>
            props.setState({
                fundCardVisible: !props.fundCardVisible,
            })

    return <Card classes={{ root: classes.root }} className="account">
        <CardContent>
            <Typography variant="body1" color="primary" gutterBottom>
                Fund this account with Stellar Lumens
            </Typography>

            <Typography style={{ marginTop: "2rem" }}
                variant="body2" color="inherit"
            >
                Send Stellar Lumens to the following Account ID:
            </Typography>

            <div className="badge badge-primary-light">
                {props.publicKey}
            </div>

            <Typography style={{ marginTop: "3rem" }}
                variant="body2" color="inherit"
            >
                Funds should show up within 5 seconds.
                If sending from an exchange, please mind longer transfer times.
            </Typography>
        </CardContent>
        <CardActions classes={{ root: classes.actionsRoot }}>
            <Button color="primary" onClick={toggleFundCard}>
                Done
            </Button>
        </CardActions>
    </Card>
}

FundCard.propTypes = {
    classes: PropTypes.object.isRequired,
}




// ...
export default compose(
    withStyles({
        actionsRoot: {
            marginLeft: "4px",
        },
        cardActions: {
            padding: "1rem",
        },
        root: {
            borderRadius: "2px",
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
)(FundCard)
