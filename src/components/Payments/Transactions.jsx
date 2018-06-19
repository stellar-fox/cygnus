import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import {
    pubKeyAbbr,
    rgb,
    rgba,
    utcToLocaleDateTime,
} from "../../lib/utils"

import { action as PaymentsAction } from "../../redux/Payments"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as StellarAccountAction } from "../../redux/StellarAccount"

import IconButton from "material-ui/IconButton"
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from "material-ui/Table"




// ...
const styles = {
    table: {
        backgroundColor: rgb(15,46,83),
    },
    tableRow: {},
    tooltip: {
        backgroundColor: rgba(244,176,4,0.8),
        fontSize: "0.9rem",
    },
}




// <Transactions> component
class Transactions extends Component {

    // ...
    static propTypes = {
        stellarServer: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired,
        setState: PropTypes.func.isRequired,
        updateTransactionsCursors: PropTypes.func.isRequired,
    }


    // ...
    componentDidMount = () => this.props.getTransactions()


    // ...
    getNextTransactionsPage = () =>
        this.props.stellarServer
            .transactions()
            .forAccount(this.props.publicKey)
            .order("desc")
            .cursor(this.props.state.txCursorRight)
            .limit(5)
            .call()
            .then((transactionsResult) => {
                if (transactionsResult.records.length > 0) {
                    this.props.setState({
                        txPrevDisabled: false,
                    })
                    this.props.setTransactions(transactionsResult.records)
                    this.props.updateTransactionsCursors(
                        transactionsResult.records
                    )
                } else {
                    this.noMoreTransactionsNotice.call(this, {
                        txNextDisabled: true,
                    })
                }
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })


    // ...
    getPrevTransactionsPage = () =>
        this.props.stellarServer
            .transactions()
            .forAccount(this.props.publicKey)
            .order("asc")
            .cursor(this.props.state.txCursorLeft)
            .limit(5)
            .call()
            .then((transactionsResult) => {
                if (transactionsResult.records.length > 0) {
                    this.props.setState({
                        txNextDisabled: false,
                    })
                    transactionsResult.records.reverse()
                    this.props.setTransactions(transactionsResult.records)
                    this.props.updateTransactionsCursors(
                        transactionsResult.records
                    )
                } else {
                    this.noMoreTransactionsNotice.call(this, {
                        txPrevDisabled: true,
                    })
                }
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })


    // ...
    noMoreTransactionsNotice = (state) => {
        this.props.setState({
            ...state,
        })
        this.props.popupSnackbar("No more transactions data.")
    }


    // ...
    render = () =>
        <div className="flex-row">
            <div>
                <div className="account-title">Account Transactions</div>
                <div className="account-subtitle">Newest transactions shown as first.</div>
                <div className="p-t" />
                {
                    this.props.transactions ?
                        <Table style={styles.table}>
                            <TableHeader
                                className="tx-table-header"
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                            >
                                <TableRow
                                    className="tx-table-row"
                                    style={styles.tableRow}
                                >
                                    <TableHeaderColumn className="tx-table-header-column">
                                        Transaction Time
                                    </TableHeaderColumn>
                                    <TableHeaderColumn className="tx-table-header-column">
                                        Account
                                    </TableHeaderColumn>
                                    <TableHeaderColumn className="tx-table-header-column">
                                        Cost Bearer
                                    </TableHeaderColumn>
                                    <TableHeaderColumn className="tx-table-header-column">
                                        Memo
                                    </TableHeaderColumn>
                                    <TableHeaderColumn className="tx-table-header-column">
                                        Fee Paid
                                    </TableHeaderColumn>
                                    <TableHeaderColumn className="tx-table-header-column">
                                        Signature Count
                                    </TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    this.props.transactions.map(
                                        (tx, index) => (
                                            <TableRow
                                                selectable={false}
                                                key={index}
                                                className="tx-table-row"
                                            >
                                                <TableRowColumn className="tx-table-row-column">
                                                    {utcToLocaleDateTime(tx.created_at)}
                                                </TableRowColumn>
                                                <TableRowColumn className="tx-table-row-column">
                                                    <span>
                                                        {pubKeyAbbr(tx.source_account)}
                                                    </span>
                                                </TableRowColumn>
                                                <TableRowColumn className="tx-table-row-column">
                                                    <span className="account-direction">
                                                        {
                                                            tx.source_account ===
                                                                this
                                                                    .props
                                                                    .publicKey ?
                                                                "You" :
                                                                "Them"
                                                        }
                                                    </span>
                                                </TableRowColumn>
                                                <TableRowColumn className="tx-table-row-column">
                                                    {tx.memo}
                                                </TableRowColumn>
                                                <TableRowColumn className="tx-table-row-column">
                                                    {tx.fee_paid}
                                                </TableRowColumn>
                                                <TableRowColumn className="tx-table-row-column">
                                                    {tx.signatures.length}
                                                </TableRowColumn>
                                            </TableRow>
                                        )
                                    )
                                }
                            </TableBody>
                        </Table> :
                        null
                }
                <div className="p-b" />
                <div className="flex-row-space-between p-t">
                    <IconButton
                        className="paging-icon"
                        tooltip="Previous Transactions"
                        tooltipStyles={styles.tooltip}
                        tooltipPosition="top-right"
                        onClick={this.getPrevTransactionsPage}
                        disabled={this.props.state.txPrevDisabled}
                    >
                        <i className="material-icons">fast_rewind</i>
                    </IconButton>

                    <IconButton
                        className="paging-icon"
                        tooltip="Next Transactions"
                        tooltipStyles={styles.tooltip}
                        tooltipPosition="top-left"
                        onClick={this.getNextTransactionsPage}
                        disabled={this.props.state.txNextDisabled}
                    >
                        <i className="material-icons">fast_forward</i>
                    </IconButton>
                </div>
            </div>
        </div>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        state: state.Payments,
        transactions: state.StellarAccount.transactions,
        publicKey: state.LedgerHQ.publicKey,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setState: PaymentsAction.setState,
        setTransactions: StellarAccountAction.setTransactions,
        popupSnackbar: SnackbarAction.popupSnackbar,
    }, dispatch)
)(Transactions)
