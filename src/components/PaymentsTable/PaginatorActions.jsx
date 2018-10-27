import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import { action as PaymentsActions } from "../../redux/Payments"


// <PaginatorActions> component
export default compose(
    withStyles((theme) => ({
        root: {
            flexShrink: 0,
            color: theme.palette.primary.main,
            marginLeft: theme.spacing.unit * 2.5,
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
        handleFirstPageButtonClick = (event) =>
            this.props.onChangePage(event, 0)


        // ...
        handleBackButtonClick = (event) =>
            this.props.onChangePage(event, this.props.page - 1)


        // ...
        handleNextButtonClick = (event) =>
            this.props.onChangePage(event, this.props.page + 1)


        // ...
        handleLastPageButtonClick = (event) =>
            this.props.onChangePage(event,
                Math.max(0, Math.ceil(
                    this.props.count / this.props.rowsPerPage
                ) - 1),
            )


        // ...
        render = () => (
            ({ classes, count, page, rowsPerPage, theme }) => {
                let firstPageIconDisabled = page === 0 ? true : false
                let prevPageIconDisabled = page === 0 ? true : false

                let nextPageIconDisabled = page >= Math.ceil(count / rowsPerPage) - 1 ? true : false
                let lastPageIconDisabled = page >= Math.ceil(count / rowsPerPage) - 1 ? true : false

                return <div className={classes.root}>
                    <IconButton
                        onClick={this.handleFirstPageButtonClick}
                        disabled={firstPageIconDisabled}
                        aria-label="First Page"
                        style={{ color: firstPageIconDisabled ? theme.palette.secondary.dark : theme.palette.primary.main }}
                    >
                        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                    <IconButton
                        onClick={this.handleBackButtonClick}
                        disabled={prevPageIconDisabled}
                        aria-label="Previous Page"
                        style={{ color: prevPageIconDisabled ? theme.palette.secondary.dark : theme.palette.primary.main }}
                    >
                        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <IconButton
                        onClick={this.handleNextButtonClick}
                        disabled={nextPageIconDisabled}
                        aria-label="Next Page"
                        style={{ color: nextPageIconDisabled ? theme.palette.secondary.dark : theme.palette.primary.main }}
                    >
                        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                    <IconButton
                        onClick={this.handleLastPageButtonClick}
                        disabled={lastPageIconDisabled}
                        aria-label="Last Page"
                        style={{ color: lastPageIconDisabled ? theme.palette.secondary.dark : theme.palette.primary.main }}
                    >
                        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
                    </IconButton>
                </div>
            }
        )(this.props)

    }
)
