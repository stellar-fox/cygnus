import React, { Fragment, memo } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { CardActions } from "@material-ui/core"
import { accountIsLocked } from "../../lib/utils"
import { action as BalancesAction } from "../../redux/Balances"
import Button from "../../lib/mui-v1/Button"




/**
 * `<BalanceSummaryFooter>` component.
 *
 * @module client-ui-components
 * @license Apache-2.0
 * @returns {React.ReactElement}
 */
const BalanceSummaryFooter = memo(({
    accountId, bip32Path, fundCardVisible, payCardVisible, publicKey,
    setBalancesState, signers,
}) => {

    const toggleFundCard = React.useCallback(() => {
        setBalancesState({
            fundCardVisible: !fundCardVisible,
        })
    }, [fundCardVisible])


    const togglePaymentCard = React.useCallback(() => {
        setBalancesState({
            payCardVisible: !payCardVisible,
        })
    }, [payCardVisible])


    return <CardActions disableActionSpacing>
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
})


export default connect (
    (state) => ({
        accountId: state.StellarAccount.accountId,
        bip32Path: state.LedgerHQ.bip32Path,
        fundCardVisible: state.Balances.fundCardVisible,
        payCardVisible: state.Balances.payCardVisible,
        publicKey: state.LedgerHQ.publicKey,
        signers: state.StellarAccount.signers,
    }),
    (dispatch) => bindActionCreators({
        setBalancesState: BalancesAction.setState,
    }, dispatch),
)(BalanceSummaryFooter)
