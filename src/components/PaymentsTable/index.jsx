import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Typography,
} from "@material-ui/core"
import {
    CardGiftcardRounded, MergeTypeRounded, PaymentRounded, TimelineRounded
} from "@material-ui/icons"
import TableFooter from "@material-ui/core/TableFooter"
import TablePagination from "@material-ui/core/TablePagination"
import PaginatorActions from "./PaginatorActions"
import { action as PaymentsActions } from "../../redux/Payments"
import { getAmountWithSign, getPayments } from "../../lib/stellar/payments"
import { asyncMap } from "@xcmats/js-toolbox"
import { utcToLocaleDateTime } from "../../lib/utils"
import { withAssetManager } from "../AssetManager"


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
    withAssetManager,
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
            preferredCurrency: state.Account.currency,
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
            loading: true,
            error: false,
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
                            transactionHash: record.transaction_hash,
                        }))
                ).then((rows) => {
                    this.setState({
                        rows,
                        loading: false,
                        error: false,
                    })
                    this.props.setCursorRight(rows[rows.length - 1].pagingToken)
                    if (rows.length >= this.state.rows.length % this.state.rowsPerPage) {
                        this.fetchNextRecords(rows[rows.length - 1].pagingToken)
                    }
                })

            })


        // ...
        fetchNextRecords = (cursor) => {

            getPayments(this.props.publicKey, {
                horizon: this.props.horizon,
                cursor,
                limit: this.state.rowsPerPage,
            }).then((dataPage) => {
                asyncMap(dataPage.records, (record) =>
                    getAmountWithSign(record, this.props.publicKey)
                        .then((amount) => ({
                            dateTime: utcToLocaleDateTime(record.created_at),
                            type: record.type,
                            amount,
                            pagingToken: record.paging_token,
                            transactionHash: record.transaction_hash,
                        }))
                ).then((rows) => {
                    this.setState({
                        rows: this.state.rows.concat(rows),
                        loading: false,
                        error: false,
                    })
                    this.props.setCursorRight(rows[rows.length - 1].pagingToken)

                })

            })
        }


        // ...
        handleChangePage = async (_event, page) => {
            await this.props.setPage(page)

            if (
                this.state.rows.length <= (
                    page * this.state.rowsPerPage + this.state.rowsPerPage
                )
            ) {
                await this.setState({ loading: true })
                this.fetchNextRecords(this.props.cursorRight)
            }
        }


        // ...
        handleChangeRowsPerPage = async (event) => {
            await this.setState({ rowsPerPage: event.target.value})

            if (
                this.state.rows.length <= (
                    this.props.page * this.state.rowsPerPage +
                    this.state.rowsPerPage
                )
            ) {
                await this.setState({ loading: true })
                this.fetchNextRecords(this.props.cursorRight)
            }
        }


        // ...
        titleizeType = (typeStr) => (
            (t) => t[typeStr]
        )({
            payment: <div className="flex-box-row items-centered">
                <PaymentRounded />
                <div className="p-l-small">Payment</div>
            </div>,
            create_account: <div className="flex-box-row items-centered">
                <CardGiftcardRounded />
                <div className="p-l-small">Create Account</div>
            </div>,
            path_payment: <div className="flex-box-row items-centered">
                <TimelineRounded />
                <div className="p-l-small">Path Payment</div>
            </div>,
            account_merge: <div className="flex-box-row items-centered">
                <MergeTypeRounded />
                <div className="p-l-small">Account Merge</div>
            </div>,
        })


        // ...
        colorize = (amount) =>
            amount.sign === "+" ?
                <span className="green">
                    <span className="p-r-tiny">{amount.sign}</span>
                    {amount.value}
                </span> :
                <span className="red">
                    <span className="p-r-tiny">{amount.sign}</span>
                    {amount.value}
                </span>


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
                                        <CustomTableCell>
                                            {row.dateTime}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            <div className="flex-box-col">
                                                {this.titleizeType(row.type)}
                                                <span className="tiny fade-extreme">
                                                    {row.transactionHash}
                                                </span>
                                            </div>
                                        </CustomTableCell>
                                        <CustomTableCell numeric>
                                            {row.amount.assetCode ?
                                                <div className={row.amount.sign === "+" ? "green" : "red"}>
                                                    {this.colorize(row.amount)}
                                                    <span className="p-l-small">
                                                        {row.amount.assetCode}
                                                    </span>
                                                </div> :
                                                <div className="flex-box-col">
                                                    <div className={row.amount.sign === "+" ? "green" : "red"}>
                                                        <span className="p-r-tiny">
                                                            {row.amount.sign}
                                                        </span>
                                                        {this.props.assetManager.convertToAsset(
                                                            row.amount.value
                                                        )}
                                                        <span className="p-l-small">
                                                            {this.props.preferredCurrency.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="tiny fade-strong">
                                                        {this.colorize(row.amount)}
                                                        <span className="p-l-small">
                                                            XLM
                                                        </span>
                                                    </div>
                                                </div>
                                            }
                                        </CustomTableCell>
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
                                            {!this.state.error && !this.state.loading &&
                                            <Typography color="primary" variant="h6">
                                                <span className="fade-extreme">
                                                    That's it. No more data.
                                                </span>
                                            </Typography>
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
                                    rowsPerPageOptions={[ 5, 10, 15 ]}
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
