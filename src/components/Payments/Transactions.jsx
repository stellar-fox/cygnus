import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import {
    pubKeyAbbr,
    utcToLocaleDateTime,
} from "../../lib/utils"

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
        backgroundColor: "rgb(15,46,83)",
    },
    tableRow: {},
    tooltip: {
        backgroundColor: "rgba(244,176,4,0.8)",
        fontSize: "0.9rem",
    },
}




// <Transactions> component
class Transactions extends Component {

    // ...
    static propTypes = {
        accountInfo: PropTypes.object.isRequired,
        getPrevTransactionsPage: PropTypes.func.isRequired,
        getNextTransactionsPage: PropTypes.func.isRequired,
        txNextDisabled: PropTypes.bool.isRequired,
        txPrevDisabled: PropTypes.bool.isRequired,
    }


    // ...
    render = () =>
        <div className="flex-row">
            <div>
                <div className="account-title">Account Transactions</div>
                <div className="account-subtitle">Newest transactions shown as first.</div>
                <div className="p-t" />
                {
                    this.props.accountInfo.transactions ?
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
                                    this.props.accountInfo.transactions.records.map(
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
                                                        <span>
                                                            {pubKeyAbbr(tx.source_account)}
                                                        </span>
                                                        <span className="account-direction">
                                                            {
                                                                tx.source_account ===
                                                                    this
                                                                        .props
                                                                        .accountInfo
                                                                        .pubKey ?
                                                                    "Yours" :
                                                                    "Theirs"
                                                            }
                                                        </span>
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
                        onClick={this.props.getPrevTransactionsPage}
                        disabled={this.props.txPrevDisabled}
                    >
                        <i className="material-icons">fast_rewind</i>
                    </IconButton>

                    <IconButton
                        className="paging-icon"
                        tooltip="Next Transactions"
                        tooltipStyles={styles.tooltip}
                        tooltipPosition="top-left"
                        onClick={this.props.getNextTransactionsPage}
                        disabled={this.props.txNextDisabled}
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
        accountInfo: state.accountInfo,
    })
)(Transactions)
