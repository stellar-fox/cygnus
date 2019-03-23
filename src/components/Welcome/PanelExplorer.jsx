import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    func,
    string,
} from "@xcmats/js-toolbox"
import {
    LinearProgress,
    Typography,
} from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { actions as ErrorsActions } from "../../redux/Errors"
import Panel from "../../lib/mui-v1/Panel"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import StatusMessage from "../StatusMessage"
import { enterExplorer } from "../../thunks/users"




// <PanelExplorer> component
class PanelExplorer extends Component {

    state = {
        error: false,
        errorMessage: string.empty(),
        inputValue: string.empty(),
    }


    // ...
    updateInputValue = (event) => {
        this.props.setOtherError("")
        this.setState({
            inputValue: event.target.value,
        })
    }


    // ...
    handleButtonClick = () => this.props.enterExplorer(this.state.inputValue)




    // ...
    render = () =>
        <Panel title="View-only access">
            <div style={{ minHeight: "310px" }}>
                <div className="m-t-small panel-title">
                    To view public account record enter <em>
                    Payment Address</em> or <em>Account Number</em>.
                </div>
                <Typography align="center" variant="caption" color="secondary">
                    Account transactions and balances are
                    always publicly visible on the
                    globally distributed ledger.
                </Typography>

                <div className="flex-box-col items-centered content-centered">

                    <InputField
                        id="payment-address-input"
                        type="text"
                        label="Payment Address"
                        color="secondary"
                        error={this.props.otherErrorMessage}
                        onChange={this.updateInputValue}
                    />
                    <Button
                        onClick={this.handleButtonClick}
                        color="secondary"
                        style={{ marginRight: "0px" }}
                    >
                        Check
                    </Button>
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            colorPrimary: this.props.classes.linearColorPrimary,
                            barColorPrimary: this.props.classes.linearBarColorPrimary,
                        }}
                        style={{
                            width: "100%",
                            opacity: this.props.signingIn ? 1 : 0,
                        }}
                    />
                    <StatusMessage className="m-t" style={{ minHeight: "20px" }} />
                </div>

            </div>

        </Panel>

}


// ...
export default func.compose(
    withStyles((theme) => ({
        linearColorPrimary: {
            marginTop: "2px",
            backgroundColor: theme.palette.secondary.light,
            borderRadius: "3px",
        },
        linearBarColorPrimary: {
            backgroundColor: theme.palette.secondary.dark,
            borderRadius: "3px",
        },
    })),
    connect(
        // map state to props.
        (state) => ({
            horizon: state.StellarAccount.horizon,
            otherErrorMessage: state.Errors.otherErrorMessage,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            enterExplorer,
            setOtherError: ErrorsActions.setOtherError,
        }, dispatch)
    ),
)(PanelExplorer)
