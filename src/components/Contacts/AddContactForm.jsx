import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { htmlEntities as he } from "../../lib/utils"
import { action as ModalAction } from "../../redux/Modal"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import SwipeableViews from "react-swipeable-views"

import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"




// ...
const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        borderRadius: "3px",
    },

    buttonDone: {
        margin: 0,
        borderRadius: "3px",
    },

    primaryRaised: {
        color: theme.palette.secondary.main,
    },

    textField: {
        width: 300,
    },

    input: {
        color: theme.palette.primary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main, },
        "&:after": { borderBottomColor: theme.palette.primary.main, },
    },

    inputMargin: {
        margin: "0px",
    },

    progress: {
        marginBottom: "0px",
        marginRight: "10px",
    },

})


// ...
const RequestProgress = withStyles(styles)(
    ({ classes, }) =>
        <CircularProgress color="primary" className={classes.progress}
            thickness={3} size={25}
        />
)


// ...
const SearchButton = withStyles(styles)(
    ({ classes, buttonText, color, disabled, onClick, }) =>
        <Button variant="raised" disabled={disabled}
            color={color} onClick={onClick}
            className={classNames(classes.button, classes.primaryRaised)}
        >
            {buttonText}
        </Button>
)


// ...
const DoneButton = withStyles(styles)(
    ({ classes, onClick, }) =>
        <Button variant="raised" color="primary" onClick={onClick}
            className={classNames(classes.buttonDone, classes.primaryRaised)}
        >
            Done
        </Button>
)


// ...
const SearchInput = withStyles(styles)(
    ({ classes, label, onChange, value, }) => <TextField
        id="seach-by"
        label={label}
        value={value}
        type="search"
        className={classes.textField}
        margin="normal"
        onChange={onChange}
        autoFocus
        InputProps={{
            classes: {
                input: classes.input,
                underline: classes.input,
            },
        }}
        InputLabelProps={{
            classes: {
                root: classes.input,
                marginDense: classes.inputMargin,
            },
        }}
    />
)


// ...
const ChoiceTabs = withStyles(styles)(
    ({ onChange, value, }) => <Tabs
        value={ value }
        onChange={ onChange }
        textColor="primary"
        indicatorColor="primary"
        fullWidth
    >
        <Tab disableRipple label="Email Address" />
        <Tab disableRipple label="Payment Address" />
        <Tab disableRipple label="Account Number" />
    </Tabs>
)


// ...
const TabContainer = withStyles(styles)(
    ({ children, dir, }) =>
        <Typography component="div" dir={dir} style={{ paddingTop: "2rem", }}>
            {children}
        </Typography>
)


// ...
class AddContactForm extends Component {

    state = {
        showProgress: false,
        showRequestSent: false,
        value: 0,
        buttonDisabled: false,
        input: "",
        lastInput: "",
    }


    // ...
    onTabChange = (_event, value) =>
        this.setState({ value, showRequestSent: false, })


    // ...
    requestContact = () => {

        this.setState({
            showProgress: true,
            showRequestSent: false,
            buttonDisabled: true,
            lastInput: this.state.input,
        })

        setTimeout(() => {
            this.requestComplete()
        }, 1000)
    }


    // ...
    requestComplete = () =>
        this.setState({
            showProgress: false,
            showRequestSent: true,
            buttonDisabled: false,
            input: "",
        })


    // ...
    hideModal = () => {
        this.setState({
            showProgress: false,
            showRequestSent: false,
            buttonDisabled: false,
            input: "",
            lastInput: "",
        })
        this.props.hideModal()
    }


    // ...
    handleInputChange = (event) =>
        this.setState({
            input: event.target.value,
        })


    // ...
    render = () =>
        <Fragment>
            <div className="f-b center p-t-medium">
                <Typography noWrap variant="body2" color="primary">
                    Request contact using the following categories:
                </Typography>
            </div>
            <div className="f-b center p-t">
                <ChoiceTabs onChange={this.onTabChange}
                    value={this.state.value}
                />
            </div>
            <SwipeableViews
                axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                index={this.state.value}
                onChangeIndex={this.handleChangeIndex}
            >
                <TabContainer dir={this.props.theme.direction}>
                    <Typography align="center" noWrap variant="body1"
                        color="primary"
                    >
                        Enter the email address of the person you want to add
                        to your contact book.
                    </Typography>
                    <div className="m-b" style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                    >
                        <SearchInput label="Email Address"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </TabContainer>
                <TabContainer dir={this.props.theme.direction}>
                    <Typography align="center" noWrap variant="body1"
                        color="primary"
                    >
                        Enter the payment address of the person you want to add
                        to your contact book.
                    </Typography>
                    <div className="m-b" style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                    >
                        <SearchInput label="Payment Address"
                            onChange={this.handleInputChange}
                            value={this.state.input}
                        />
                        <SearchButton buttonText="Request" color="primary"
                            onClick={this.requestContact}
                            disabled={this.state.buttonDisabled}
                        />
                    </div>
                </TabContainer>
                <TabContainer dir={this.props.theme.direction}>
                    <Fragment>
                        <Typography align="center" noWrap variant="body1"
                            color="primary"
                        >
                            If you know the extended account number for
                            your contact, enter it below.
                        </Typography>
                        <div className="m-b" style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "center",
                        }}
                        >
                            <SearchInput label="Extended Account Number."
                                onChange={this.handleInputChange}
                                value={this.state.input}
                            />
                            <SearchButton buttonText="Request" color="primary"
                                onClick={this.requestContact}
                                disabled={this.state.buttonDisabled}
                            />
                        </div>
                    </Fragment>
                </TabContainer>
            </SwipeableViews>


            {!this.state.showProgress && !this.state.showRequestSent &&
                <div className="p-t"
                    style={{ height: "150px", paddingLeft: "20px", }}
                >
                    <div className="f-b center">
                        <Typography noWrap variant="body1" color="primary">
                            Fine Print:
                        </Typography>
                    </div>
                    <div className="f-b p-t">
                        <Typography noWrap variant="caption" color="primary">
                            <he.Minus /> Adding new contact by payment address
                            or account number is only possible if this contact
                            already has an account with Stellar Fox.
                        </Typography>
                    </div>
                    <div className="f-b">
                        <Typography noWrap variant="caption" color="primary">
                            <he.Minus /> When the contact accepts the request,
                            it will appear in your contact list.
                        </Typography>
                    </div>
                    <div className="f-b">
                        <Typography noWrap variant="caption" color="primary">
                            <he.Minus /> Adding contact with payment address
                            other than hosted by Stellar Fox will have limited
                            security features.
                        </Typography>
                    </div>
                </div>
            }


            {this.state.showProgress &&
                <div className="f-b center p-t" style={{ height: "150px", }}>
                    <RequestProgress />
                    <Typography noWrap variant="body2" color="primary">
                        Sending request ...
                    </Typography>
                </div>
            }


            {this.state.showRequestSent &&
                <div className="p-t" style={{ height: "150px", }}>
                    <div className="f-b center">
                        <Typography noWrap variant="body1" color="primary">
                            Request sent to:
                        </Typography>
                    </div>
                    <div className="f-b center">
                        <div className="tag-success">
                            <Typography noWrap variant="body2"
                                color="secondary"
                            >
                                {this.state.lastInput}
                            </Typography>
                        </div>
                    </div>
                    <div className="f-b center p-t">
                        <Typography noWrap variant="body1" color="primary">
                            Go ahead, send another!
                        </Typography>
                    </div>
                </div>
            }

            <div className="f-e">
                <DoneButton onClick={this.hideModal} />
            </div>

        </Fragment>
}


// ...
export default connect(
    // map state to props
    (state, theme) => ({
        Modal: state.Modal,
        theme,
    }),
    (dispatch) => bindActionCreators({
        hideModal: ModalAction.hideModal,
    }, dispatch)
)(AddContactForm)