import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import debounce from "lodash/debounce"
import { emptyString, shorten } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { action as BalancesAction } from "../../redux/Balances"
import { action as ContactsAction } from "../../redux/Contacts"

import {
    federationAddressValid, formatFullName, formatPaymentAddress,
    getFederationRecord, htmlEntities as he, invalidPaymentAddressMessage,
    paymentAddress, pubKeyAbbr, publicKeyValid, signatureValid,
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
import CheckCircle from "@material-ui/icons/CheckCircle"
import { Divider } from "@material-ui/core"
import HighlightOff from "@material-ui/icons/HighlightOff"
import InputAdornment from "@material-ui/core/InputAdornment"
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { withAssetManager } from "../AssetManager"
import md5 from "../../lib/md5"



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
    inputTag: {
        marginTop: "-8px",
        width: "400px",
        color: theme.palette.secondary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.secondary.main} !important`,
            borderBottomWidth: "0px !important",
        },
        "&:before": {
            borderBottomColor: theme.palette.secondary.main,
            borderBottomWidth: "0px !important",
        },
        "&:after": {
            borderBottomColor: theme.palette.secondary.main,
            borderBottomWidth: "0px !important",
        },
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
        boxShadow: theme.shadows[4],
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
        "&:focus": {
            backgroundColor: theme.palette.grey[300],
        },
    },
    avatarDisabled: {
        opacity: "0.6",
    },
    label: {
        color: theme.palette.primary.main,
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
                            return part.highlight ?
                                <span key={String(index)}
                                    style={{ fontWeight: 600, }}
                                >
                                    {shorten(part.text, 15)}
                                </span> :
                                <span key={String(index)}
                                    style={{ fontWeight: 400, }}
                                >
                                    {shorten(part.text, 15, shorten.END)}
                                </span>

                        })}
                    </div>
                    <div className="f-b micro text-primary fade-strong">
                        {suggestion.alias && suggestion.domain ?
                            paymentAddress(
                                suggestion.alias, suggestion.domain
                            ) : pubKeyAbbr(suggestion.publicKey)
                        }
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
        value: emptyString(),
        suggestions: [],
        error: false,
        errorMessage: emptyString(),
        paymentAddress: emptyString(),
        label: emptyString(),
        emailMD5: emptyString(),
        loading: false,
    }


    // ...
    onSuggestionSelected = (_event, suggestion) => {
        this.validatePaymentDestination(suggestion.suggestionValue)
        this.setState({
            value: suggestion.suggestionValue,
        })

        suggestion && this.setState({
            label: emptyString(),
            paymentAddress: emptyString(),
            emailMD5: emptyString(),
            error: false,
            errorMessage: emptyString(),
        })
    }


    // ...
    getSuggestionValue = (suggestion) => {
        return (!suggestion.alias || !suggestion.domain) ?
            suggestion.publicKey :
            paymentAddress(suggestion.alias, suggestion.domain)
    }


    // ...
    setTransactionType = (tt) =>
        this.props.setBalancesState({ newAccount: tt === "NEW_ACCOUNT", })


    // ...
    fuzzySearchForContact = (value) => {
        let results = new Fuse(
            this.props.Contacts.internal.concat(this.props.Contacts.external), {
                keys: [
                    "first_name",
                    "last_name",
                    "alias",
                    "domain",
                    "email",
                    "pubkey",],
            }).search(value)

        return results.map((c) => ({
            label: [c.first_name, c.last_name,].join(" "),
            publicKey: c.pubkey,
            alias: c.alias,
            domain: c.domain,
            email: c.email,
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
        this.setState({ value: newValue, }, () => {
            if (!invalidPaymentAddressMessage(newValue)) {
                this.validatePaymentDestination(newValue)
            }
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
                paymentAddress: emptyString(),
                label: emptyString(),
                emailMD5: emptyString(),
            })

            this.props.setBalancesState({ payee: null, })
            return false
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

                memo = federationRecord.memo ? federationRecord.memo : emptyString()

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
                            payeeMemoText: emptyString(),
                        })
                    }
                /**
                 * Signature could not be verified.
                 */
                } else {
                    this.setTransactionType("EXISTING_ACCOUNT")
                    this.updateIndicatorMessage("Payee Unverified", "yellow")
                }

                publicKey = federationRecord.account_id

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
                this.props.setBalancesState({
                    payee: null,
                    payeeAddress: null,
                    indicatorMessage: securityMsgPlaceholder,
                    indicatorStyle: "fade-extreme",
                    sendEnabled: false,
                    memoRequired: false,
                    memoText: emptyString(),
                    payeeCurrency: "eur",
                    payeeCurrencyAmount: emptyString(),
                    payeeMemoText: emptyString(),
                    payeeStellarAccount: null,
                })
                this.setState({
                    label: emptyString(),
                    paymentAddress: emptyString(),
                    emailMD5: emptyString(),
                })
                return false
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
                if (error.response.status === 404) {
                    this.setTransactionType("NEW_ACCOUNT")
                    this.updateIndicatorMessage("New Account", "yellow")
                }
            }
        }


        let contact = this.searchForContact(publicKey),
            extContact = null,
            displayName = null,
            displayPaymentAddress = null

        /**
         * If interal contact was found above then show contact's full name in
         * "Pay to the order of" <Chip/> component.
         */
        contact ?
            (() => {
                this.props.setBalancesState({
                    contactType: "internal",
                    contactId: contact.contact_id,
                })
                displayName = formatFullName(
                    contact.first_name, contact.last_name
                )
                displayPaymentAddress = formatPaymentAddress(
                    contact.alias, contact.domain
                )
            })() : (
                extContact = this.searchForExtContact(publicKey)
            )


        /**
         * After the search for internal contact yielded no results, we try to
         * search for external contact and decided what should be shown in
         * <Chip/> component.
         */
        extContact ?
            (() => {
                this.props.setBalancesState({
                    contactType: "external",
                    contactId: extContact.id,
                })
                displayName = formatFullName(
                    extContact.first_name, extContact.last_name
                )
                displayPaymentAddress = formatPaymentAddress(
                    extContact.alias, extContact.domain
                )

                /**
                 * If external contact has custom memo then fill it into the
                 * memo field on the pay check.
                 */
                if (extContact.memo) {
                    this.props.setBalancesState({
                        memoRequired: true,
                        payeeMemoText: extContact.memo,
                    })
                } else {
                    this.props.setBalancesState({
                        memoRequired: false,
                        payeeMemoText: emptyString(),
                    })
                }

            })() :
            /**
             * No matching internal or external contact was found so try to
             * enter most meaningful available info into the <Chip/> component.
             */
            !contact && ((content) => {
                displayName = formatFullName(null, null)
                displayPaymentAddress = content
            }
            )(pubKeyAbbr(publicKey))


        /**
         * At this point we have a valid and verified Stellar public key
         * that we can set as payment destination.
         */
        if (publicKey) {
            this.props.setBalancesState({
                payee: publicKey,
                payeeAddress: input,
            })

            /**
             * Either use original memo (returned by federation service) or
             * contact defined memo (in case of external contacts) or leave it
             * blank.
             */
            this.props.setBalancesState({
                memoText: memo ? memo : this.props.payeeMemoText ?
                    this.props.payeeMemoText : emptyString(),
                payeeCurrency: contact ?
                    contact.currency : extContact ?
                        extContact.currency : this.props.payeeCurrency,
            })

        }

        this.setState({
            loading: false,
            error: false,
            errorMessage: emptyString(),
            emailMD5: contact ? contact.email_md5 : md5(publicKey),
            label: displayName,
            paymentAddress: displayPaymentAddress.props &&
                displayPaymentAddress.props.children === "−" ?
                pubKeyAbbr(input) : displayPaymentAddress,
        })

        /**
         * In case the selected contact has a different currency than then
         * sender, update the receiver currency and display appropriate rate.
         */
        if (this.props.currency !== this.props.payeeCurrency) {
            this.props.assetManager.updateExchangeRate(
                this.props.payeeCurrency
            ).then(() => {
                this.props.setBalancesState({
                    payeeCurrencyAmount:
                        this.props.assetManager.convertToPayeeCurrency(
                            this.props.amountNative
                        ),
                })
            })
        }

        this.toggleSignButton()
        return true
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
            memoRequired: false,
            memoText: emptyString(),
            payeeCurrency: "eur",
            payeeCurrencyAmount: emptyString(),
            payeeMemoText: emptyString(),
            payeeStellarAccount: null,
            transactionAsset: null,
        })
        this.setState({
            label: emptyString(),
            paymentAddress: emptyString(),
            emailMD5: emptyString(),
            value: emptyString(),
        })
    }


    // ...
    shouldRenderSuggestions = () => this.state.value.length >= 1 ? true : false


    // this is due to the specificity of the Chip component
    doNothing = () => false


    // ...
    render = () => {
        const { classes, } = this.props

        return (
            <div className="f-b-col">
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
                    }}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                    focusInputOnSuggestionClick={false}
                    onSuggestionSelected={this.onSuggestionSelected}
                />
                <he.Nbsp />
                <TextField
                    InputProps={{
                        disabled: true,
                        classes: {
                            input: classes.inputTag,
                            underline: classes.inputTag,
                        },
                        startAdornment: <InputAdornment position="start"
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
                                        label={
                                            <Typography variant="body1">
                                                <span>
                                                    {shorten(
                                                        this.state.label,
                                                        24,
                                                        shorten.END
                                                    )}
                                                </span>
                                                <he.Nbsp /><he.Nbsp /><he.Nbsp />
                                                <span className="tiny fade-strong">
                                                    {shorten(
                                                        this.state.paymentAddress,
                                                        30,
                                                        shorten.END
                                                    )}
                                                </span><he.Nbsp /><he.Nbsp />
                                            </Typography>
                                        }
                                        onDelete={this.props.cancelEnabled ?
                                            this.deletePayee : this.doNothing}
                                        deleteIcon={this.props.cancelEnabled ?
                                            <HighlightOff /> : <CheckCircle />}
                                        classes={{
                                            root: this.props.cancelEnabled ?
                                                classes.chip : classes.chipDisabled,
                                            label: classes.label,
                                        }}
                                    /> : this.state.loading ?
                                        <div className="small text-primary fade">
                                            Loading...
                                        </div> : <he.Nbsp />
                            }
                        />,
                    }}
                />
            </div>
        )
    }

}


// ...
export default compose(
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({
            currency: state.Account.currency,
            amountNative: state.Balances.amountNative,
            contacts: state.Contacts,
            payee: state.Balances.payee,
            payeeCurrency: state.Balances.payeeCurrency,
            payeeMemoText: state.Balances.payeeMemoText,
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
