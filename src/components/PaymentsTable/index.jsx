import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Typography,
} from "@material-ui/core"

import TableFooter from "@material-ui/core/TableFooter"
import TablePagination from "@material-ui/core/TablePagination"


import PaginatorActions from "./PaginatorActions"
import { action as PaymentsActions } from "../../redux/Payments"

import { getAmountWithSign, getPayments } from "../../lib/stellar/payments"
import { asyncMap } from "@xcmats/js-toolbox"
import { utcToLocaleDateTime } from "../../lib/utils"

// let id = 0
// function createData (name, calories, fat, carbs, protein) {
//     id += 1
//     return { id, name, calories, fat, carbs, protein }
// }

// const rows = [
//     createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//     createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//     createData("Eclair", 262, 16.0, 24, 6.0),
//     createData("Cupcake", 305, 3.7, 67, 4.3),
//     createData("Gingerbread", 356, 16.0, 49, 3.9),
//     createData("Grzybnia", 3536, 116.0, 429, 35.9),
// ]



// ...
const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.fade}`,
        fontSize: "1rem",
    },
    body: {
        fontSize: "0.9rem",
        borderBottom: "none",
        color: theme.palette.primary.main,
    },
}))(TableCell)




// <PaymentsTable> component
export default compose(
    withStyles((theme) => ({
        root: {
            width: "100%",
            marginTop: theme.spacing.unit * 3,
            overflowX: "auto",
            borderRadiusTop: "3px",
            borderRadiusBottom: "0px",
        },
        table: {
            minWidth: 700,
        },
        row: {
            "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.secondary.light,
            },
        },
        selectIcon: {
            color: theme.palette.primary.main,
        },
        select: {
            color: theme.palette.primary.main,
        },
        selectRoot: {
            color: theme.palette.primary.main,
        },
        caption: {
            color: theme.palette.primary.fade,
        },
    }), { withTheme: true }),
    connect(
        (state) => ({
            cursorRight: state.Payments.cursorRight,
            page: state.Payments.page,
            horizon: state.StellarAccount.horizon,
            publicKey: state.StellarAccount.accountId,
        }),
        (dispatch) => bindActionCreators({
            setCursorRight: PaymentsActions.setCursorRight,
            setPage: PaymentsActions.setPage,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            rows: [],
            rowsPerPage: 5,
            loading: false,
            error: false,
            lastPageFetched: 0,
        }


        // ...
        componentDidMount = () =>
            getPayments(this.props.publicKey, {
                horizon: this.props.horizon,
            }).then((dataPage) => {
                asyncMap(dataPage.records, (record) =>
                    getAmountWithSign(record, this.props.publicKey)
                        .then((amount) => ({
                            dateTime: utcToLocaleDateTime(record.created_at),
                            type: record.type,
                            amount,
                            pagingToken: record.paging_token,
                        }))
                ).then((rows) => {
                    this.setState({
                        rows,
                        loading: false,
                    })
                    this.props.setCursorRight(rows[rows.length - 1].pagingToken)
                    if (rows.length >= 5) {
                        this.fetchNextRecords(rows[rows.length - 1].pagingToken)
                    }
                })

            })


        // ...
        fetchNextRecords = (cursor) => {

            getPayments(this.props.publicKey, {
                horizon: this.props.horizon,
                cursor,
            }).then((dataPage) => {
                asyncMap(dataPage.records, (record) =>
                    getAmountWithSign(record, this.props.publicKey)
                        .then((amount) => ({
                            dateTime: utcToLocaleDateTime(record.created_at),
                            type: record.type,
                            amount,
                            pagingToken: record.paging_token,
                        }))
                ).then((rows) => {
                    this.setState({
                        rows: this.state.rows.concat(rows),
                        loading: false,
                        lastPageFetched: this.props.page + 1,
                    })
                    this.props.setCursorRight(rows[rows.length - 1].pagingToken)

                })

            })
        }


        // ...
        handleChangePage = (_event, page) => {
            this.props.setPage(page)
            if (this.state.rows.length % this.state.rowsPerPage === 0 &&
                this.state.lastPageFetched === page) {
                this.fetchNextRecords(this.props.cursorRight)
            }
        }


        // ...
        handleChangeRowsPerPage = (event) =>
            this.setState({ rowsPerPage: event.target.value })


        // ...
        render = () => (
            ({ classes, page }, { rows, rowsPerPage }) => {

                let emptyRows = rowsPerPage - Math.min(
                    rowsPerPage, rows.length - page * rowsPerPage)

                return <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Date</CustomTableCell>
                                <CustomTableCell>Transaction Details</CustomTableCell>
                                <CustomTableCell numeric>Amount</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                                return (
                                    <TableRow className={classes.row} key={row.pagingToken}>
                                        <CustomTableCell>{row.dateTime}</CustomTableCell>
                                        <CustomTableCell>{row.type}</CustomTableCell>
                                        <CustomTableCell numeric>{row.amount.sign}{row.amount.value}</CustomTableCell>
                                    </TableRow>
                                )
                            })}
                            {emptyRows > 0 && (
                                <TableRow className={classes.row}
                                    style={{ height: 48 * emptyRows }}
                                >
                                    <CustomTableCell colSpan={3}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignContent: "flex-start",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        >
                                            {this.state.loading &&
                                                <CircularProgress className={classes.progress}
                                                    thickness={4} size={40}
                                                />
                                            }
                                            {this.state.error &&
                                                (<Fragment>
                                                    <Typography color="primary" variant="h6">
                                                        <span className="fade-extreme">
                                                            Hmm. We're having trouble fetching this data.
                                                        </span>
                                                    </Typography>
                                                    <Typography color="primary" variant="caption">
                                                        <span className="fade-extreme">
                                                            {this.state.errorMessage}
                                                        </span>
                                                    </Typography>
                                                </Fragment>)
                                            }
                                        </div>
                                    </CustomTableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={PaginatorActions}
                                    labelDisplayedRows={
                                        ({ from, to, count }) =>
                                            `Showing: ${from}-${to} of ${count}`
                                    }
                                    classes={{
                                        selectIcon: classes.selectIcon,
                                        caption: classes.caption,
                                        select: classes.pagination,
                                        selectRoot: classes.selectRoot,
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
            }
        )(this.props, this.state)

    }
)
