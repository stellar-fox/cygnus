import React, { Fragment } from "react"
import { connect } from "react-redux"
import { appName } from "../StellarFox/env"

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from "material-ui/Table"
import {
    pubKeyAbbr,
} from "../../lib/utils"

// ...
export default connect(
    // map state to props.
    (state) => ({ Balances: state.Balances, })
)(
    ({ Balances, }) =>
        <Fragment>
            <div className="p-t p-b">
                Funds have arrived to the destination account.
            </div>

            <Table style={{
                backgroundColor: "rgb(244,176,4)",
            }} selectable={false}>
                <TableBody displayRowCheckbox={false}>
                    <TableRow className="table-row-primary">
                        <TableRowColumn className="text-normal text-primary">
                            Payee Address:
                        </TableRowColumn>
                        <TableRowColumn className="text-normal fade">
                            {Balances.payeeAddress}
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn className="text-normal text-primary">
                            Payee Account:
                        </TableRowColumn>
                        <TableRowColumn className="text-normal fade">
                            {pubKeyAbbr(Balances.payee)}
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn className="text-normal text-primary">
                            Transaction ID:
                        </TableRowColumn>
                        <TableRowColumn className="text-normal fade">
                            {Balances.paymentId}
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn className="text-normal text-primary">
                            Ledger Number:
                        </TableRowColumn>
                        <TableRowColumn className="text-normal fade">
                            {Balances.ledgerId}
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>

            <div className="p-t fade small">
                Thank you for using {appName}.
            </div>
        </Fragment>
)