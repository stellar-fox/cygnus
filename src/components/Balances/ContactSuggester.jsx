import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import debounce from "lodash/debounce"
import { withStyles } from "@material-ui/core/styles"

import Autosuggest from "react-autosuggest"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

import { Divider } from "@material-ui/core"
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
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
        width: "300px",
        color: theme.palette.primary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main, },
        "&:after": { borderBottomColor: theme.palette.primary.main, },
    },
    error: {
        color: theme.palette.error.dark,
    },
})



// ...
const renderInput = (inputProps) => {
    const { classes, helperText, ref, ...other } = inputProps
    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    input: classes.input,
                    underline: classes.input,
                },
                ...other,
            }}
            helperText={helperText}
            FormHelperTextProps={{
                classes: {
                    root: classes.error,
                },
            }}
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
const getSuggestionValue = (suggestion) => {
    return `${suggestion.label} [${suggestion.paymentAddress}]`
}



// ...
const getSuggestions = (value, suggestions, ) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    let count = 0

    return inputLength === 0 ? [] :
        suggestions.filter(suggestion => {

            const keep = count < 5 && suggestion.label.toLowerCase().slice(
                0, inputLength) === inputValue

            if (keep) {
                count += 1
            }

            return keep
        })
}


// ...
class ContactSuggester extends Component {


    state = {
        value: "",
        suggestions: [],
        error: false,
        errorText: "",
    }


    // ...
    combineContacts = () => {
        const internal = this.props.contacts.internal.map((c) => ({
            label: [c.first_name, c.last_name,].join(" "),
            publicKey: c.pubkey,
            paymentAddress: [c.alias, c.domain,].join("*"),
        }))

        const external = this.props.contacts.external.map((c) => ({
            label: [c.first_name, c.last_name,].join(" "),
            publicKey: c.pubkey,
            paymentAddress: [c.alias, c.domain,].join("*"),
        }))

        return internal.concat(external)

    }


    // ...
    handleSuggestionsFetchRequested = ({ value, }) => {
        this.setState({
            suggestions: getSuggestions(value, this.combineContacts()),
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
        this.setState({
            value: newValue,
        })

    }


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
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    classes,
                    value: this.state.value,
                    onChange: this.handleChange,
                    error: this.state.error,
                    helperText: this.state.errorText,
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
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
    withStyles(styles),
)(ContactSuggester)