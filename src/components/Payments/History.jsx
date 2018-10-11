import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { choose, string } from "@xcmats/js-toolbox"
import { credit, debit, displayCredit, displayDebit } from "../../lib/stellar-tx"
import { htmlEntities as he, StellarSdk, utcToLocaleDateTime } from "../../lib/utils"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead,
    TablePagination, TableRow, IconButton, Typography,
} from "@material-ui/core"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import LastPageIcon from "@material-ui/icons/LastPage"
import TransactionDetails from "./TransactionDetails"
import { transactionFetchLimit } from "../../components/StellarFox/env"
import NumberFormat from "react-number-format"
import BigNumber from "bignumber.js"
import { withAssetManager } from "../AssetManager"


// flying airplane
import { getAmount, getPlusMinus, payments } from "../../lib/stellar/payments"


// ...
const styles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
    progress: {
        color: theme.palette.primary.fade,
        marginRight: theme.spacing.unit,
    },
})




// ...
class TablePaginationActions extends React.Component {

    // ...
    handleFirstPageButtonClick = (event) =>
        this.props.onChangePage(event, 0)


    // ...
    handleBackButtonClick = (event) =>
        this.props.onChangePage(event, this.props.page - 1)


    // ...
    handleNextButtonClick = (event) =>
        this.props.onChangePage(event, this.props.page + 1)


    // ...
    handleLastPageButtonClick = event =>
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(
                this.props.count / this.props.rowsPerPage
            ) - 1),
        )


    // ...
    render () {
        const { classes, count, page, rowsPerPage, theme } = this.props

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    {theme.direction === "rtl" ?
                        <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === "rtl" ?
                        <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === "rtl" ?
                        <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === "rtl" ?
                        <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        )
    }
}




// ...
TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
}




// ...
const TablePaginationActionsWrapped = withStyles(
    styles,
    { withTheme: true }
)(TablePaginationActions)




// ...
const TableHeaderCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.secondary.main,
        borderBottom: `2px solid ${theme.palette.primary.fade}`,
        color: theme.palette.primary.main,
    },
    root: {
        fontSize: "1rem",
    },
}))(TableCell)




// ...
const RequestProgress = withStyles(styles)(
    ({ classes }) =>
        <CircularProgress className={classes.progress}
            thickness={4} size={40}
        />
)




// <History> component
export default compose(
    withAssetManager,
    withStyles((theme) => ({
        table: {
            minWidth: 500,
            marginTop: theme.spacing.unit * 2,
        },
        tableWrapper: {
            overflowX: "auto",
        },
        row: {
            cursor: "pointer",
            "&:nth-of-type(even)": {
                backgroundColor: theme.palette.secondary.light,
            },
            "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.secondary.main,
            },
        },
        selectedRow: {
            backgroundColor: "rgba(244, 176, 4, 0.9) !important",
            borderTop: "1px solid rgba(15, 46, 83, 0.5)",
            borderBottom: "1px solid rgba(15, 46, 83, 0.5)",
        },
        cell: {
            borderBottom: "none",
            color: theme.palette.primary.main,
        },
        pagination: {
            color: theme.palette.secondary.main,
            fontSize: "0.75rem",
        },
        selectIcon: {
            paddingBottom: "2px",
            color: theme.palette.secondary.main,
        },
        actions: {
            color: theme.palette.secondary.main,
        },
    })),
    connect(
        // map state to props.
        (state) => ({
            authToken: state.Auth.authToken,
            currency: state.Account.currency,
            horizon: state.StellarAccount.horizon,
            publicKey: state.StellarAccount.accountId,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({ /* ... */ }, dispatch)
    )
)(class extends Component {

    // ...
    static propTypes = {
        classes: PropTypes.object.isRequired,
    }


    // ...
    state = {
        page: 0,
        rowsPerPage: 5,
        loading: true,
        error: false,
        errorMessage: string.empty(),
        data: [],
        detailsData: [],
        cursorRight: "0",
        highestFetched: transactionFetchLimit,
        selectedRow: null,
        payments: [],
    }


    // ...
    componentDidMount = () => {

        payments(this.props.publicKey).then((records) => {
            console.log("%c PAYMENTS", "font-weight: bold; color: orange;")
            console.log(records)
            this.setState({ payments: records })
        })

        new StellarSdk.Server(this.props.horizon)
            .transactions()
            .forAccount(this.props.publicKey)
            .order("desc")
            .limit(transactionFetchLimit)
            .call()
            .then((accountResult) => {
                const data = accountResult.records.map((r, key) => {
                    let transaction = StellarSdk.xdr.Transaction.fromXDR(
                        r.envelope_xdr, "base64"
                    )
                    let meta = StellarSdk.xdr.TransactionMeta.fromXDR(
                        r.result_meta_xdr, "base64"
                    )
                    let txresult = StellarSdk.xdr.TransactionResult.fromXDR(
                        r.result_xdr, "base64"
                    )
                    let operations = transaction.operations().map(
                        (op) => StellarSdk.Operation.fromXDRObject(op)
                    )

                    return { key, transaction, operations, meta, txresult, r }
                })

                this.setState({
                    data: data.filter(this.paymentsFilter),
                    cursorRight: data[data.length - 1].r.paging_token,
                    loading: false,
                })

            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorMessage: error.message,
                    loading: false,
                })
            })
    }


    // ...
    handleChangePage = (_event, page) => {
        if ((page * this.state.rowsPerPage + this.state.rowsPerPage) %
            this.state.highestFetched === 0) {
            this.setState({ loading: true })
            this.pageRight().then((accountResult) => {
                const data = accountResult.records.map((r, key) => {
                    let transaction = StellarSdk.xdr.Transaction.fromXDR(
                        r.envelope_xdr, "base64"
                    )
                    let meta = StellarSdk.xdr.TransactionMeta.fromXDR(
                        r.result_meta_xdr, "base64"
                    )
                    let txresult = StellarSdk.xdr.TransactionResult.fromXDR(
                        r.result_xdr, "base64"
                    )
                    let operations = transaction.operations().map(
                        (op) => StellarSdk.Operation.fromXDRObject(op)
                    )

                    return { key, transaction, operations, meta, txresult, r }
                })
                this.setState({
                    loading: false,
                    data: this.state.data.concat(
                        data.filter(this.paymentsFilter)
                    ),
                    cursorRight: data[data.length - 1].r.paging_token,
                    highestFetched: (this.state.highestFetched +
                        transactionFetchLimit),
                })
            })
        }
        this.setState({ page })
    }


    // ...
    handleChangeRowsPerPage = (event) =>
        this.setState({ rowsPerPage: event.target.value })


    // ...
    handleRowClick = (detailsData) =>
        this.setState({ detailsData, selectedRow: detailsData.key })


    // ...
    pageRight = async () => await new StellarSdk.Server(this.props.horizon)
        .transactions()
        .forAccount(this.props.publicKey)
        .cursor(this.props.cursorRight)
        .order("desc")
        .limit(transactionFetchLimit)
        .call()


    // ...
    paymentsFilter = (tx) => tx.operations.every(
        (o) => (o.type === "payment" ||
            o.type === "createAccount" ||
            o.type === "mergeAccount")
    )


    // ...
    isNative = (operation) =>
        (operation.asset && operation.asset.code === "XLM")
            || operation.startingBalance


    // ...
    displayAmount = (operation) =>
        this.isNative(operation) ?
            this.props.assetManager.convertToAsset(
                this.opNativeAmount(operation)
            ) : this.opNativeAmount(operation)


    // ...
    opAssetSymbol = (operation) => choose(
        operation.type,
        {
            "createAccount": () => <span className="nano">XLM</span>,
        },
        () => <span className="nano">{operation.asset.code}</span>
    )


    // ...
    opNativeAmount = (operation) => {
        BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4 })
        return choose(
            operation.type,
            {
                "createAccount": () => new BigNumber(
                    operation.startingBalance
                ).toFixed(7),
            },
            () => this.isNative(operation) ?
                new BigNumber(operation.amount).toFixed(7) :
                new BigNumber(operation.amount).toString()
        )
    }


    // ...
    render = () => (
        ({ classes, publicKey }) => {
            const { rowsPerPage, page, data, payments } = this.state
            const emptyRows = rowsPerPage - Math.min(
                rowsPerPage, data.length - page * rowsPerPage)



            return (<Fragment><div className={classes.tableWrapper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Date</TableHeaderCell>
                            <TableHeaderCell>Type</TableHeaderCell>
                            <TableHeaderCell>Total</TableHeaderCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {payments.records && payments.records.map((record) =>
                            <TableRow classes={{
                                root: classes.row,
                                selected: classes.selectedRow,
                            }}
                            >
                                <TableCell classes={{ root: classes.cell }}>
                                    {utcToLocaleDateTime(record.created_at)}
                                </TableCell>
                                <TableCell classes={{ root: classes.cell }}>
                                    {record.type}
                                </TableCell>
                                <TableCell classes={{ root: classes.cell }}>
                                    {getPlusMinus(record, publicKey)}
                                    <he.Nbsp />
                                    {getAmount(record)}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {/* <TableBody>
                        {data.slice(
                            page * rowsPerPage, page * rowsPerPage +
                            rowsPerPage).map(n => {

                            let myOperations = n.operations
                                    .filter(
                                        (op) => (op.destination === publicKey ||
                                            !op.source || op.source === publicKey)
                                    ),
                                debitVal = debit(
                                    myOperations, this.props.publicKey
                                ),
                                creditVal = credit(
                                    myOperations, this.props.publicKey
                                )

                            return (
                                <TableRow classes={{root: classes.row, selected: classes.selectedRow}}
                                    onClick={this.handleRowClick.bind(
                                        this, n
                                    )}
                                    key={n.key}
                                    selected={this.state.selectedRow === n.key}
                                >
                                    <TableCell
                                        classes={{ root: classes.cell }}
                                    >
                                        <span className="fade-strong">
                                            {utcToLocaleDateTime(n.r.created_at)}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        classes={{ root: classes.cell }}
                                    >
                                        {n.r.memo}
                                    </TableCell>
                                    <TableCell
                                        classes={{ root: classes.cell }}
                                    >
                                        <div className="flex-box-col">
                                            <Typography variant="body1">
                                                {displayDebit(debitVal) ?
                                                    <Fragment>
                                                        {this.isNative(myOperations[0]) ?
                                                            <span className="red">
                                                                {this.props.assetManager.getAssetGlyph(
                                                                    this.props.currency
                                                                )}
                                                            </span> :
                                                            <span className="red">
                                                                {this.opAssetSymbol(myOperations[0])}
                                                            </span>
                                                        }
                                                        <he.Nbsp />
                                                        <span className="red">
                                                            <NumberFormat
                                                                value={this.props.assetManager.convertToAsset(debitVal)}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                                fixedDecimalScale={true}
                                                                decimals={2}
                                                            />
                                                        </span>
                                                    </Fragment> :
                                                    <Fragment>
                                                        {this.isNative(myOperations[0]) ?
                                                            <span className="green">
                                                                {this.props.assetManager.getAssetGlyph(
                                                                    this.props.currency
                                                                )}
                                                            </span> :
                                                            <span className="green">
                                                                {this.opAssetSymbol(myOperations[0])}
                                                            </span>
                                                        }
                                                        <he.Nbsp />
                                                        <span className="green">
                                                            <NumberFormat
                                                                value={this.props.assetManager.convertToAsset(creditVal)}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                                fixedDecimalScale={true}
                                                                decimals={2}
                                                            />
                                                        </span>
                                                    </Fragment>}
                                            </Typography>
                                            {this.isNative(myOperations[0]) &&
                                            <div>{displayDebit(debitVal) ?
                                                <span className="tiny fade-extreme">
                                                    <NumberFormat
                                                        value={displayDebit(debitVal)}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        fixedDecimalScale={true}
                                                    /> XLM
                                                </span> :
                                                <span className="tiny fade-extreme">
                                                    <NumberFormat
                                                        value={displayCredit(creditVal)}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        fixedDecimalScale={true}
                                                    /> XLM
                                                </span>}
                                            </div>
                                            }
                                        </div>

                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {emptyRows > 0 && (
                            <TableRow className={classes.row}
                                style={{ height: 48 * emptyRows }}
                            >
                                <TableCell className={classes.cell} colSpan={5}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignContent: "flex-start",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    >
                                        {this.state.loading &&
                                            <RequestProgress />
                                        }
                                        {this.state.error &&
                                            (<Fragment>
                                                <Typography color="primary" variant="title">
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
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody> */}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                classes={{
                                    caption: classes.pagination,
                                    select: classes.pagination,
                                    selectIcon: classes.selectIcon,
                                    toolbar: classes.actions,
                                }}
                                colSpan={5}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[ 5, 10, 15 ]}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={
                                    this.handleChangeRowsPerPage
                                }
                                ActionsComponent={
                                    TablePaginationActionsWrapped
                                }
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
            {!this.state.error &&
                <TransactionDetails data={this.state.detailsData} />
            }
            </Fragment>)
        }
    )(this.props)

})
