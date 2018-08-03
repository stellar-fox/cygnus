import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { emptyString } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    utcToLocaleDateTime,
    StellarSdk,
} from "../../lib/utils"
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    Typography,
} from "@material-ui/core"
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from "@material-ui/icons"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import LastPageIcon from "@material-ui/icons/LastPage"
import FailedTxDetails from "./FailedTxDetails"
import { transactionFetchLimit } from "../../components/StellarFox/env"
import { firebaseApp } from "../StellarFox"
import NumberFormat from "react-number-format"
import { withAssetManager } from "../AssetManager"
import { action as PaymentsAction } from "../../redux/Payments"




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
        const { classes, count, page, rowsPerPage, theme, } = this.props

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
    { withTheme: true, }
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
    ({ classes, }) =>
        <CircularProgress className={classes.progress}
            thickness={4} size={40}
        />
)




// <UserGroupList> component
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
            "&:focus": {
                color: theme.palette.secondary.main,
                backgroundColor: theme.palette.primary.main,
            },
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
            horizon: state.StellarAccount.horizon,
            publicKey: state.StellarAccount.accountId,
            savedTx: state.Payments.savedTxDetails,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            setState: PaymentsAction.setState,
        }, dispatch)
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
        errorMessage: emptyString(),
        data: [],
        cursorRight: "0",
        highestFetched: transactionFetchLimit,
        failedTxs: [],
    }


    // ...
    componentDidMount = () => {

        firebaseApp.database().ref(`failedTxs/${this.props.publicKey}`)
            .on("value", txs => {
                this.setState({
                    data: txs.val() ? Object.keys(txs.val()).map(
                        (k) => { return { ...txs.val()[k], id: k, } }
                    ) : [],
                    loading: false,
                })
            })
    }


    // ...
    handleChangePage = (_event, page) => {
        if ((page * this.state.rowsPerPage + this.state.rowsPerPage) %
            this.state.highestFetched === 0) {
            this.setState({ loading: true, })
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

                    return { key, transaction, operations, meta, txresult, r, }
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
        this.setState({ page, })
    }


    // ...
    handleChangeRowsPerPage = (event) =>
        this.setState({ rowsPerPage: event.target.value, })


    // ...
    handleRowClick = (detailsData) => {
        this.props.setState({
            savedTxDetails: detailsData,
        })
    }


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
    render = () => (
        ({ classes, }) => {
            const { rowsPerPage, page, data, } = this.state
            const emptyRows = rowsPerPage - Math.min(
                rowsPerPage, data.length - page * rowsPerPage)



            return <Fragment><div className={classes.tableWrapper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Last Attempted</TableHeaderCell>
                            <TableHeaderCell>Amount</TableHeaderCell>
                            <TableHeaderCell>Currency</TableHeaderCell>
                            <TableHeaderCell>Submitted</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(
                            page * rowsPerPage, page * rowsPerPage +
                            rowsPerPage).map(n =>
                            <TableRow
                                classes={{
                                    root: classes.row,
                                    selected: classes.selectedRow,
                                }}
                                onClick={this.handleRowClick.bind(
                                    this, n
                                )}
                                key={n.id}
                                selected={
                                    this.props.savedTx ?
                                        this.props.savedTx.id === n.id :
                                        false
                                }
                            >
                                <TableCell
                                    classes={{ root: classes.cell, }}
                                >
                                    {utcToLocaleDateTime(n.lastAttempt)}
                                </TableCell>
                                <TableCell
                                    classes={{ root: classes.cell, }}
                                >
                                    <NumberFormat
                                        value={n.amount}
                                        displayType={"text"}
                                        thousandSeparator
                                        decimalScale={2}
                                        fixedDecimalScale
                                    />
                                </TableCell>
                                <TableCell
                                    classes={{ root: classes.cell, }}
                                >
                                    {n.currency.toUpperCase()}
                                </TableCell>
                                <TableCell
                                    classes={{ root: classes.cell, }}
                                >
                                    {n.submitted ? "Yes" : "No"}
                                </TableCell>
                            </TableRow>
                        )}

                        <TableRow className={classes.row}
                            style={{ height: 48 * emptyRows, }}
                        >
                            <TableCell className={classes.cell} colSpan={4}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignContent: "flex-start",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                >
                                    {this.state.loading ?
                                        <RequestProgress /> :
                                        data.length === 0 &&
                                            <Fragment>
                                                <Typography variant="subheading">
                                                    There are no saved transactions at the moment.
                                                </Typography>
                                            </Fragment>
                                    }

                                    {this.state.error &&
                                        <Fragment>
                                            <Typography variant="subheading">
                                                Hmm. We're having trouble fetching this data.
                                            </Typography>
                                            <Typography variant="caption">
                                                {this.state.errorMessage}
                                            </Typography>
                                        </Fragment>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                    {data.length > 0 &&
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
                                    rowsPerPageOptions={[5, 10, 15,]}
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
                    }
                </Table>
            </div>
            {data.length > 0 && <FailedTxDetails />}
            </Fragment>
        }
    )(this.props)

})
