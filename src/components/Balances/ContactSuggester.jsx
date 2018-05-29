import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import debounce from "lodash/debounce"
import { withStyles } from "@material-ui/core/styles"
import { action as BalancesAction } from "../../redux/Balances"
import { action as ContactsAction } from "../../redux/Contacts"

import {
    federationAddressValid, getFederationRecord, htmlEntities as he,
    invalidPaymentAddressMessage, pubKeyAbbr, publicKeyValid, signatureValid,
} from "../../lib/utils"

import {
    gravatar, gravatarSize48, securityMsgPlaceholder
} from "../StellarFox/env"

import { loadAccount } from "../../lib/stellar-tx"

import Autosuggest from "react-autosuggest"
import Fuse from "fuse.js"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

import Avatar from "@material-ui/core/Avatar"
import Chip from "@material-ui/core/Chip"
import { Divider } from "@material-ui/core"
import CheckCircle from "@material-ui/icons/CheckCircle"
import InputAdornment from "@material-ui/core/InputAdornment"
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
import HighlightOff from "@material-ui/icons/HighlightOff"
import TextField from "@material-ui/core/TextField"




// ...
const styles = (theme) => ({
    container: {
        flexGrow: 1,
        position: "relative",
        marginTop: "32px",
    },
    suggestionsContainerOpen: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: "3px",
    },
    suggestion: {
        display: "block",
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: "none",
    },
    input: {
        width: "400px",
        color: theme.palette.primary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main, },
        "&:after": { borderBottomColor: theme.palette.primary.main, },
    },
    inputDisabled: {
        width: "400px",
        color: theme.palette.primary.fade,
    },
    error: {
        color: theme.palette.error.dark,
    },
    chip: {
        backgroundColor: theme.palette.secondary.light,
        border: `1px solid ${theme.palette.secondary.fade}`,
        color: theme.palette.primary.light,
        marginBottom: "8px",
        boxShadow: theme.shadows[1],
        fontWeight: 400,
        fontSize: "0.85rem",
        "&:focus" : {
            backgroundColor: theme.palette.secondary.light,
        },
    },
    chipDisabled: {
        backgroundColor: theme.palette.grey[300],
        border: `1px solid ${theme.palette.grey[400]}`,
        color: theme.palette.grey[600],
        marginBottom: "8px",
        boxShadow: theme.shadows[0],
        fontWeight: 400,
        fontSize: "0.85rem",
        "&:focus": {
            backgroundColor: theme.palette.grey[300],
        },
    },
    avatarDisabled: {
        opacity: "0.6",
    },
})



// ...
const renderInput = (inputProps) => {
    const {
        classes, helperText, endAdornment, disabled, ref, ...other
    } = inputProps

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    input: disabled ? classes.inputDisabled : classes.input,
                    underline: disabled ? classes.inputDisabled : classes.input,
                },
                endAdornment,
                ...other,
            }}
            helperText={helperText}
            FormHelperTextProps={{
                classes: {
                    root: classes.error,
                },
            }}
            disabled={disabled}
        />
    )
}


// ...
const renderSuggestion = (suggestion, { query, isHighlighted, }) => {
    const matches = match(suggestion.label, query)
    const parts = parse(suggestion.label, matches)

    return (
        <Fragment>
            <MenuItem selected={isHighlighted} component="div">
                <div className="f-b-col">
                    <div className="text-primary">
                        {parts.map((part, index) => {
                            return part.highlight ? (
                                <span key={String(index)}
                                    style={{ fontWeight: 400, }}
                                >
                                    {part.text}
                                </span>
                            ) : (
                                <span key={String(index)}
                                    style={{ fontWeight: 100, }}
                                >
                                    {part.text}
                                </span>
                            )
                        })}
                    </div>
                    <div className="micro text-primary fade-strong">
                        {suggestion.paymentAddress}
                    </div>
                </div>
            </MenuItem>
            <Divider />
        </Fragment>
    )
}


// ...
const renderSuggestionsContainer = (options) => {
    const { containerProps, children, } = options

    return (
        <Paper {...containerProps}>
            {children}
        </Paper>
    )
}


// ...
class ContactSuggester extends Component {


    state = {
        value: "",
        suggestions: [],
        error: false,
        errorMessage: "",
        paymentAddress: "",
        label: "",
        emailMD5: "",
        loading: false,
    }


    // ...
    getSuggestionValue = (suggestion) => {

        this.validatePaymentDestination(suggestion.paymentAddress)

        this.setState({
            label: suggestion.label,
            paymentAddress: suggestion.paymentAddress,
            emailMD5: suggestion.emailMD5,
        })

        return suggestion.paymentAddress
    }


    // ...
    setTransactionType = (tt) =>
        this.props.setBalancesState({ newAccount: tt === "NEW_ACCOUNT", })


    // ...
    fuzzySearchForContact = (value) => {
        let results = new Fuse(
            this.props.Contacts.internal.concat(this.props.Contacts.external), {
                keys: ["first_name", "last_name", "alias", "domain", "pubkey",],
            }).search(value)

        return results.map((c) => ({
            label: [c.first_name, c.last_name,].join(" "),
            publicKey: c.pubkey,
            paymentAddress: [c.alias, c.domain,].join("*"),
            emailMD5: c.email_md5,
        }))
    }


    // ...
    handleSuggestionsFetchRequested = ({ value, }) => {
        this.setState({
            suggestions: this.fuzzySearchForContact(value),
        })
    }


    // ...
    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }


    // ...
    handleChange = (_event, { newValue, }) => {

        this.validatePaymentDestination(newValue)
        this.setState({
            value: newValue,
        })

        newValue && this.setState({
            label: "",
            paymentAddress: "",
            emailMD5: "",
            error: false,
            errorMessage: "",
        })

    }


    // ...
    searchForContact = (publicKey) => this.props.Contacts.internal.find(
        (c) => c.pubkey === publicKey
    )


    // ...
    searchForExtContact = (publicKey) => this.props.Contacts.external.find(
        (c) => c.pubkey === publicKey
    )


    // ...
    updateIndicatorMessage = (message, style) =>
        this.props.setBalancesState({
            indicatorMessage: message,
            indicatorStyle: style,
        })


    // ...
    validatePaymentDestination = async (input) => {
        let errorMessage = invalidPaymentAddressMessage(input),
            publicKey = null,
            memo = null

        if (errorMessage) {

            this.setState({
                error: true,
                errorMessage,
                paymentAddress: "",
                label: "",
                emailMD5: "",
            })

            this.props.setBalancesState({ payee: null, })
            return
        }

        this.setState({ loading: true, })

        /**
         * Differentiate between a valid federation address or a valid
         * public key since both constitute a valid input at this point.
         */
        if (federationAddressValid(input)) {
            try {
                /**
                 * public key returned by federation service that allegedly
                 * maps to the given federation address
                 */
                const federationRecord = await getFederationRecord(input)

                memo = federationRecord.memo ? federationRecord.memo : ""

                /**
                 * stellar account corresponding to the public key that is
                 * currently mapped in to the federation address input
                 */
                const payeeStellarAccount = await loadAccount(
                    federationRecord.account_id,
                    this.props.StellarAccount.horizon
                )

                /**
                 * Update redux
                 */
                this.props.setBalancesState({
                    payeeStellarAccount,
                })

                /**
                 * The following is a verification procedure for making sure
                 * that the recipient's info (the mapping of federation address
                 * to Stellar public key) is authentic.
                 */
                const paySig = payeeStellarAccount.data_attr ?
                    (payeeStellarAccount.data_attr.paySig ?
                        payeeStellarAccount.data_attr.paySig : null) : null


                /**
                 * Signature verified successfully.
                 */
                if (paySig) {
                    if (signatureValid({
                        paymentAddress: federationRecord.stellar_address,
                        memo,
                    }, paySig)) {
                        this.setTransactionType("EXISTING_ACCOUNT")
                        this.updateIndicatorMessage(
                            "Payee Verified", "green"
                        )
                        memo.length > 0 &&
                            this.props.setBalancesState({
                                memoRequired: true,
                                payeeMemoText: memo,
                            })
                    } else {
                        this.setTransactionType("EXISTING_ACCOUNT")
                        this.updateIndicatorMessage(
                            "Wrong Signature", "red"
                        )
                        this.props.setBalancesState({
                            memoRequired: false,
                            payeeMemoText: "",
                        })
                    }
                /**
                 * Signature could not be verified.
                 */
                } else {
                    this.setTransactionType("EXISTING_ACCOUNT")
                    this.updateIndicatorMessage("Payee Unverified", "yellow")
                    this.props.setBalancesState({
                        memoRequired: false,
                        payeeMemoText: "",
                    })
                }

                publicKey = federationRecord.account_id

                /**
                 * Map any possible contact to the Chip label
                 */
                let contact = this.searchForContact(publicKey)
                if (!contact) {
                    contact = this.searchForExtContact(publicKey)
                }

                this.setState({
                    error: false,
                    errorMessage: "",
                    emailMD5: contact ? contact.email_md5 : "",
                    label: contact ?
                        [contact.first_name, contact.last_name,].join(" ") :
                        pubKeyAbbr(publicKey),
                })

            } catch (ex) {
                this.setState({ loading: false, })

                if (!ex.response) {
                    this.setState({
                        error: true,
                        errorMessage: "Service not found at this domain.",
                    })
                } else if (ex.response.status === 404) {
                    this.setState({
                        error: true,
                        errorMessage: "Recipient not found.",
                    })
                } else {
                    this.setState({
                        error: true,
                        errorMessage: ex.message,
                    })
                }
            }
        // user did not enter a valid federation address but we also accept
        // a valid public key at this time
        } else if (publicKeyValid(input)) {
            publicKey = input

            try {
                const payeeStellarAccount = await loadAccount(
                    publicKey,
                    this.props.StellarAccount.horizon
                )
                if (payeeStellarAccount.account_id === publicKey) {
                    this.setTransactionType("EXISTING_ACCOUNT")
                    this.updateIndicatorMessage("Existing Account", "green")
                }

            } catch (error) {
                if (error.name === "NotFoundError") {
                    this.setTransactionType("NEW_ACCOUNT")
                    this.updateIndicatorMessage("New Account", "yellow")
                }
            }
        }

        /**
         * Map a matching contact to the public key entered and display Chip.
         */
        let contact = this.searchForContact(publicKey)
        if (!contact) {
            contact = this.searchForExtContact(publicKey)
        }

        this.setState({
            loading: false,
            error: false,
            errorMessage: "",
            emailMD5: contact ? contact.email_md5 : "",
            label: contact ?
                [contact.first_name, contact.last_name,].join(" ") :
                pubKeyAbbr(publicKey),
        })


        /**
         * At this point we have a valid and verified Stellar public key
         * that we can set as payment destination.
         */
        if (publicKey) {
            this.props.setBalancesState({
                payee: publicKey,
                payeeAddress: input,
            })

            this.props.setBalancesState({
                memoText: memo ? memo : "",
            })

        }
        this.toggleSignButton()
    }

    // ...
    paymentValid = () =>
        this.props.payee &&
        this.props.amountIsValid


    // ...
    toggleSignButton = () => {
        return this.paymentValid() ?
            this.enableSignButton() : this.disableSignButton()
    }


    // ...
    enableSignButton = () =>
        this.props.setBalancesState({ sendEnabled: true, })


    // ...
    disableSignButton = () =>
        this.props.setBalancesState({ sendEnabled: false, })

    // ...
    deletePayee = () => {
        this.props.setBalancesState({
            payee: null,
            payeeAddress: null,
            indicatorMessage: securityMsgPlaceholder,
            indicatorStyle: "fade-extreme",
            sendEnabled: false,
        })
        this.setState({
            label: "",
            paymentAddress: "",
            emailMD5: "",
            value: "",
        })
    }


    // this is due to the specificity of the Chip component
    doNothing = () => false


    // ...
    render = () => {
        const { classes, } = this.props



        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={
                    debounce(this.handleSuggestionsFetchRequested, 300)
                }
                onSuggestionsClearRequested={
                    debounce(this.handleSuggestionsClearRequested, 200)
                }
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    classes,
                    value: this.state.value,
                    onChange: this.handleChange,
                    error: this.state.error,
                    helperText: this.state.errorMessage,
                    disabled: this.props.cancelEnabled ? false: true,
                    endAdornment: <InputAdornment position="end"
                        children={
                            this.props.payee ?
                                <Chip
                                    avatar={<Avatar
                                        className={this.props.cancelEnabled ?
                                            classes.avatar :
                                            classes.avatarDisabled}
                                        src={`${gravatar}${
                                            this.state.emailMD5}?${
                                            gravatarSize48}&d=robohash`}
                                    />}
                                    label={this.state.label}
                                    onDelete={this.props.cancelEnabled ?
                                        this.deletePayee : this.doNothing}
                                    deleteIcon={this.props.cancelEnabled ?
                                        <HighlightOff /> : <CheckCircle />}
                                    classes={{ root: this.props.cancelEnabled ?
                                        classes.chip : classes.chipDisabled, }}
                                /> : this.state.loading ?
                                    <div className="small text-primary fade">
                                        Loading...
                                    </div> : <he.Nbsp />
                        }
                    />,
                }}
            />
        )
    }

}


// ...
export default compose(
    connect(
        // map state to props.
        (state) => ({
            contacts: state.Contacts,
            payee: state.Balances.payee,
            amountIsValid: state.Balances.amountIsValid,
            cancelEnabled: state.Balances.cancelEnabled,
            StellarAccount: state.StellarAccount,
            Contacts: state.Contacts,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: ContactsAction.setState,
            setBalancesState: BalancesAction.setState,
        }, dispatch),
    ),
    withStyles(styles),
)(ContactSuggester)