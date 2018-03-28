import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withLoginManager } from "../LoginManager"

import { utcToLocaleDateTime } from "../../lib/utils"
import { gravatarLink } from "../../lib/deneb"


import { setAccountPayments } from "../../redux/actions"
import { action as PaymentsAction } from "../../redux/Payments"

import { ListItem } from "material-ui/List"
import Avatar from "material-ui/Avatar"
import IconButton from "material-ui/IconButton"
import SelectableList from "../../lib/common/SelectableList"




// ...
const styles = {
    tooltip: {
        backgroundColor: "rgba(244,176,4,0.8)",
        fontSize: "0.9rem",
    },
}




// <PaymentsHistory> component
class PaymentsHistory extends Component {

    // ...
    static propTypes = {
        stellarServer: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired,
        accountInfo: PropTypes.object.isRequired,
        loginManager: PropTypes.object.isRequired,
        appAuth: PropTypes.object.isRequired,
        paymentDetails: PropTypes.object.isRequired,
        handlePaymentClick: PropTypes.func.isRequired,
        determineLeftIcon: PropTypes.func.isRequired,
        determinePrimaryText: PropTypes.func.isRequired,
        nextDisabled: PropTypes.bool.isRequired,
        prevDisabled: PropTypes.bool.isRequired,
        decodeEffectType: PropTypes.func.isRequired,
        setAccountPayments: PropTypes.func.isRequired,
        updateCursors: PropTypes.func.isRequired,
    }


    // ...
    getNextPaymentsPage = () =>
        this.props.stellarServer
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("desc")
            .cursor(this.props.state.cursorRight)
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises =
                    paymentsResult.records.map((r) => {
                        let link = ""
                        switch (r.type) {
                            case "create_account":
                                if (
                                    r.funder ===
                                        this.props.appAuth.publicKey
                                ) {
                                    link = gravatarLink(r.account)
                                } else {
                                    link = gravatarLink(r.funder)
                                }
                                break

                            // payment
                            default:
                                if (r.to === this.props.appAuth.publicKey) {
                                    link = gravatarLink(r.from)
                                } else {
                                    link = gravatarLink(r.to)
                                }
                                break
                        }
                        return link
                    })

                Promise.all(gravatarLinkPromises).then((links) => {
                    links.forEach((link, index) => {
                        paymentsResult.records[index].gravatar = link.link
                        paymentsResult.records[index].firstName = link.firstName
                        paymentsResult.records[index].lastName = link.lastName
                        paymentsResult.records[index].email = link.email
                        paymentsResult.records[index].alias = link.alias
                        paymentsResult.records[index].domain = link.domain
                    })
                    if (paymentsResult.records.length > 0) {
                        this.props.setState({
                            prevDisabled: false,
                        })
                        this.props.setAccountPayments(paymentsResult)
                        this.props.updateCursors(paymentsResult.records)
                    } else {
                        this.noMorePayments({ nextDisabled: true, })
                    }
                })
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })


    // ...
    getPrevPaymentsPage = () =>
        this.props.stellarServer
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("asc")
            .cursor(this.props.state.cursorLeft)
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises =
                    paymentsResult.records.map((r) => {
                        let link = ""
                        switch (r.type) {
                            case "create_account":
                                if (
                                    r.funder ===
                                        this.props.appAuth.publicKey
                                ) {
                                    link = gravatarLink(r.account)
                                } else {
                                    link = gravatarLink(r.funder)
                                }
                                break

                            // payment
                            default:
                                if (r.to === this.props.appAuth.publicKey) {
                                    link = gravatarLink(r.from)
                                } else {
                                    link = gravatarLink(r.to)
                                }
                                break
                        }
                        return link
                    })

                Promise.all(gravatarLinkPromises).then((links) => {

                    links.forEach((link, index) => {
                        paymentsResult.records[index].gravatar = link.link
                        paymentsResult.records[index].firstName = link.firstName
                        paymentsResult.records[index].lastName = link.lastName
                        paymentsResult.records[index].email = link.email
                        paymentsResult.records[index].alias = link.alias
                        paymentsResult.records[index].domain = link.domain
                    })
                    if (paymentsResult.records.length > 0) {
                        this.props.setState({
                            nextDisabled: false,
                        })
                        paymentsResult.records.reverse()
                        this.props.setAccountPayments(paymentsResult)
                        this.props.updateCursors(paymentsResult.records)
                    } else {
                        this.noMorePayments({ prevDisabled: true, })
                    }
                })
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })


    // ...
    noMorePayments = (state) =>
        this.props.setState({
            sbNoMorePayments: true,
            ...state,
        })


    // ...
    render = () =>
        <Fragment>
            <div className="account-title">Payments History</div>
            <div className="account-subtitle">Newest payments shown as first.</div>
            <div className="flex-row-space-between">
                <div className="flex-row-column">
                    {
                        this.props.accountInfo.payments ?
                            <SelectableList defaultValue={1}>
                                {
                                    this.props.accountInfo.payments.records.map(
                                        (payment, index) =>
                                            <div
                                                key={payment.id}
                                                className={
                                                    this
                                                        .props
                                                        .paymentDetails
                                                        .selectedPaymentId ===
                                                        payment.id ?
                                                        "payment-item-active" :
                                                        "payment-item"
                                                }
                                            >
                                                <ListItem
                                                    value={index + 1}
                                                    onClick={this.props.handlePaymentClick.bind(this, payment, payment.id)}
                                                    leftIcon={this.props.determineLeftIcon.call(this, payment)}
                                                    hoverColor="rgba(244,176,4,0.95)"
                                                    secondaryText={
                                                        <Fragment>
                                                            <div className="tiny fade-strong">
                                                                {utcToLocaleDateTime(payment.created_at)}
                                                            </div>
                                                            {
                                                                this.props.loginManager.isAuthenticated() ?
                                                                    <div className="small fade">
                                                                        {payment.firstName ? payment.firstName : "Unknown"}
                                                                        {" "}
                                                                        {payment.lastName ? payment.lastName : "Payee"}
                                                                        {
                                                                            payment.alias && payment.domain ?
                                                                                <span className="p-l-small micro">[{payment.alias}*{payment.domain}]</span> :
                                                                                <span className="p-l-small micro">&#x0205F;</span>
                                                                        }
                                                                    </div> :
                                                                    null
                                                            }
                                                        </Fragment>
                                                    }
                                                    primaryText={this.props.determinePrimaryText.call(this, payment)}
                                                    rightAvatar={
                                                        this.props.loginManager.isAuthenticated() ?
                                                            <Avatar
                                                                className="square-avatar"
                                                                backgroundColor="rgba(244,176,4,1)"
                                                                size={70}
                                                                src={payment.gravatar}
                                                            /> :
                                                            null
                                                    }
                                                />
                                            </div>
                                    )
                                }
                            </SelectableList> :
                            null
                    }
                    <div>
                        <div className="flex-row-space-between p-t">
                            <IconButton
                                className="paging-icon"
                                tooltip="Previous Payments"
                                tooltipStyles={styles.tooltip}
                                tooltipPosition="top-right"
                                onClick={this.getPrevPaymentsPage}
                                disabled={this.props.prevDisabled}
                            >
                                <i className="material-icons">
                                    fast_rewind
                                </i>
                            </IconButton>

                            <IconButton
                                className="paging-icon"
                                tooltip="Next Payments"
                                tooltipStyles={styles.tooltip}
                                tooltipPosition="top-left"
                                onClick={this.getNextPaymentsPage}
                                disabled={this.props.nextDisabled}
                            >
                                <i className="material-icons">
                                    fast_forward
                                </i>
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className="flex-row-column">
                    <div>
                        <div className="transaction-details-header">
                            <div className="flex-row">
                                <div>
                                    Payment ID:
                                    {" "}
                                    {this.props.paymentDetails.txid}
                                </div>
                                <div>
                                    {utcToLocaleDateTime(this.props.paymentDetails.created_at)}
                                </div>
                            </div>
                        </div>
                        <div className="transaction-details-body">
                            {
                                this.props.paymentDetails.effects.map(
                                    (effect, index) =>
                                        <div
                                            key={index}
                                            className="payment-details-item"
                                        >
                                            <span className="effect-title">
                                                {this.props.decodeEffectType(effect, index)}
                                            </span>
                                        </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>

}


// ...
export default withLoginManager(connect(
    // map state to props.
    (state) => ({
        state: state.Payments,
        accountInfo: state.accountInfo,
        appAuth: state.appAuth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setState: PaymentsAction.setState,
        setAccountPayments,
    }, dispatch)
)(PaymentsHistory))
