import React, { Fragment } from "react"
import { connect } from "react-redux"
import { appName } from "../StellarFox/env"
import { handleException, shorten } from "@xcmats/js-toolbox"
import NumberFormat from "react-number-format"
import {
    htmlEntities as he,
    pubKeyAbbr,
    rgb,
} from "../../lib/utils"
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from "material-ui/Table"
import { Typography } from "@material-ui/core"



// ...
export default connect(
    // map state to props.
    (state) => ({ balances: state.Balances, account: state.Account, })
)(
    ({ balances, account, assetManager, }) =>
        <Fragment>
            <Table
                style={{
                    backgroundColor: rgb(244,176,4),
                    marginTop: "0.3rem",
                    marginBottom: "0.5rem",
                }}
                selectable={false}
            >
                <TableBody displayRowCheckbox={false}>
                    <TableRow className="table-row-primary">
                        <TableRowColumn>
                            <Typography variant="body1" color="primary">
                                Amount Sent:
                            </Typography>
                        </TableRowColumn>
                        <TableRowColumn>
                            <div className="flex-box-row items-flex-end">
                                <Typography style={{ lineHeight: "1rem", }}
                                    variant="body2" color="primary"
                                >
                                    <span className="small">
                                        {assetManager.getAssetGlyph(account.currency)}
                                    </span>
                                    <he.Nbsp />
                                    <NumberFormat
                                        value={balances.amount}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                    <he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    <span className="fade-extreme">
                                        <NumberFormat
                                            value={balances.amountNative}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            decimalScale={7}
                                            fixedDecimalScale={true}
                                        /> XLM
                                    </span>
                                </Typography>
                            </div>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn>
                            <Typography variant="body1" color="primary">
                                Payee Address:
                            </Typography>
                        </TableRowColumn>
                        <TableRowColumn>
                            <Typography variant="body2" color="primary">
                                {shorten(balances.payeeAddress, 35)}
                            </Typography>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn>
                            <Typography variant="body1" color="primary">
                                Payee Account:
                            </Typography>
                        </TableRowColumn>
                        <TableRowColumn>
                            <Typography variant="body2" color="primary">
                                {handleException(
                                    () => pubKeyAbbr(balances.payee),
                                    () => "Not Available")
                                }
                            </Typography>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn>
                            <Typography variant="body1" color="primary">
                                Memo Text:
                            </Typography>
                        </TableRowColumn>
                        <TableRowColumn>
                            <Typography variant="body2" color="primary">
                                {balances.memoText}
                            </Typography>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow className="table-row-primary">
                        <TableRowColumn>
                            <Typography variant="body1" color="primary">
                                Transaction ID:
                            </Typography>
                        </TableRowColumn>
                        <TableRowColumn>
                            <Typography variant="caption" color="primary">
                                {balances.paymentId}
                            </Typography>
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>

            <div className="flex-box-row space-around">
                <div className="border-primary glass glass-text">
                    <Typography variant="body1" color="primary" align="center">
                        Funds have arrived to the destination account.
                    </Typography>
                    <Typography variant="caption" color="primary" align="center">
                        Thank you for using {appName}.
                    </Typography>
                </div>
            </div>
        </Fragment>
)
