import React from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    func,
    string,
} from "@xcmats/js-toolbox"
import {
    AppBar,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"
import ledgerhqlogo from "../Welcome/static/ledgerhqlogo.svg"
import Panel from "../../lib/mui-v1/Panel"
import LedgerAuthenticator from "../LedgerAuthenticator"
import {
    ledgerDocsInfiniteTreeLink,
    ledgerSupportLink,
} from "../StellarFox/env"
import { LinearProgress } from "@material-ui/core"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import {
    clearInputErrorMessages,
    signUpNewUser,
} from "../../thunks/users"
import StatusMessage from "../StatusMessage"
import { publicKeyValid } from "../../lib/utils"
import { actions as ErrorActions } from "../../redux/Errors"
import CredentialsForm from "../CredentialsForm"




/**
 * Cygnus.
 *
 * Renders signup content content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




// ...
const TabContainer = (props) =>
    <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
    </Typography>




// ...
const ManualEntryForm = func.compose(


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
        (_state) => ({

        }),
        (dispatch) => bindActionCreators({
            clearInputErrorMessages,
            setError: ErrorActions.setOtherError,
            signUpNewUser,
        }, dispatch),
    ),


)((props) => {

    const [accountId, setAccountId] = React.useState(string.empty()),
        [account, setAccount] = React.useState(),
        [visible, setVisible] = React.useState(false),
        [accountIdInputError, setAccountIdInputError] = React.useState(false),
        [accountInputError, setAccountInputError] = React.useState(false),

        updateAccountId = (event) => {
            props.clearInputErrorMessages()
            setAccountId(event.target.value)
            setAccountIdInputError(false)
        },

        updateAccount = (event) => {
            props.clearInputErrorMessages()
            setAccount(event.target.value)
            setAccountInputError(false)
        },

        validateInput = () => {
            if (!publicKeyValid(accountId)) {
                setAccountIdInputError(true)
                props.setError("Invalid Account ID")
                return
            }

            if (isNaN(account)) {
                setAccountInputError(true)
                props.setError("Invalid Account")
                return
            }

            setVisible(true)
        }


    return visible ?
        <CredentialsForm accountId={accountId} account={account} /> :
        <div style={{ minHeight: "350px" }}>
            <div className="m-t-small panel-title">
                Provide your Account ID.
            </div>
            <Typography
                align="center"
                display="block"
                variant="caption"
                color="secondary"
            >
                Your <em>Account ID</em> has 56 characters and
                starts with a letter "G".
            </Typography>
            <Typography
                align="center"
                variant="caption"
                color="secondary"
                display="block"
            >
                <em>Account</em> is the path number for accessing it on your
                Ledger device.
            </Typography>
            <Typography
                align="center"
                variant="caption"
                color="secondary"
                display="block"
            >
                Need help? <a target="_blank"
                    rel="noopener noreferrer"
                    href={ledgerDocsInfiniteTreeLink}
                >Read the Ledger docs</a>.
            </Typography>
            <div className="flex-box-col items-centered content-centered">
                <InputField
                    id="manual-account-id-input"
                    type="text"
                    label="Account ID"
                    color="secondary"
                    error={accountIdInputError}
                    onChange={updateAccountId}
                />
                <InputField
                    id="manual-account-input"
                    type="text"
                    label="Account"
                    color="secondary"
                    error={accountInputError}
                    onChange={updateAccount}
                />
                <div>
                    <Button
                        onClick={validateInput}
                        color="secondary"
                        style={{ marginRight: "0px" }}
                        disabled={props.inProgress}
                    >Go</Button>
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            colorPrimary: props.classes.linearColorPrimary,
                            barColorPrimary: props.classes.linearBarColorPrimary,
                        }}
                        style={{
                            width: "100%",
                            opacity: props.inProgress ? 1 : 0,
                        }}
                    />
                </div>
                <StatusMessage className="m-t" style={{ minHeight: "20px" }} />
            </div>
        </div>

})




// ...
TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
}

CredentialsForm.propTypes = {
    account: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
}




/**
 * `<Signup>` component.
 *
 * @function Signup
 * @returns {React.ReactElement}
 */
const Signup = ({ classes, clearInputErrorMessages }) => {
    clearInputErrorMessages()

    const isMobile = useMediaQuery("(max-width:960px)"),

        [tabValue, setTabValue] = React.useState(0),
        [visible, setVisible] = React.useState(false),
        [accountId, setAccuntId] = React.useState(string.empty()),
        [account, setAccount] = React.useState(string.empty()),

        handleTabChange = (_event, newValue) => {
            setVisible(false)
            setTabValue(newValue)
        },

        authViaLedger = async (ledgerData) => {
            await clearInputErrorMessages()
            if (ledgerData.errorMessage) {
                return false
            }
            if (!ledgerData.errorCode) {
                setVisible(true)
                setAccuntId(ledgerData.publicKey)
                setAccount(ledgerData.bip32Path)
            }
        }



    return <div
        style={{ paddingBottom: "3rem" }}
        className="flex-box-col content-centered items-centered"
    >
        <div className="
            flex-box-col
            content-centered
            items-centered
            m-t-large
            m-b-large"
        >
            <Typography variant="h4" color="secondary">
                Create Account
            </Typography>
            <Typography variant="h5" color="secondary">
                Plase choose one of available sign up methods.
            </Typography>
        </div>
        <div className={isMobile ? classes.rootMobile : classes.root}>
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab
                        style={{ padding: "0 0.5rem" }}
                        icon={<img
                            className="img-logo"
                            src={ledgerhqlogo}
                            width="72px"
                            alt="LedgerHQ"
                        />}
                    />
                    <Tab
                        classes={{
                            root: isMobile ? classes.labelSmall :
                                classes.label,
                        }}
                        label="Manual Input"
                    />
                </Tabs>
            </AppBar>
            {tabValue === 0 && <TabContainer>
                <Panel title="Sign up with Ledger.">
                    {visible ?
                        <CredentialsForm
                            accountId={accountId}
                            account={account}
                        /> :
                        <div style={{ minHeight: "350px" }}>
                            <div className="m-t-small panel-title">
                                Account ID will be provided by your <em>
                                Ledger</em> device.
                            </div>
                            <Typography
                                align="center"
                                display="block"
                                variant="caption"
                                color="secondary"
                            >
                                Connect your Ledger Nano S device and
                                select <i>Stellar</i> application.
                            </Typography>
                            <Typography
                                align="center"
                                display="block"
                                variant="caption"
                                color="secondary"
                            >
                                Need help? Visit <a target="_blank"
                                    rel="noopener noreferrer"
                                    href={ledgerSupportLink}
                                >Ledger Support</a>.
                            </Typography>
                            <LedgerAuthenticator
                                onConnected={authViaLedger}
                                className="welcome-lcars-input"
                            />
                        </div>
                    }
                </Panel>
            </TabContainer>}
            {tabValue === 1 && <TabContainer>
                <Panel title="Sign up by providing account info manually.">
                    <ManualEntryForm />
                </Panel>
            </TabContainer>}
        </div>
    </div>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.primary.light,
            borderRadius: "3px",
            maxWidth: "485px",
            minWidth: "485px",
            minHeight: "495px",
        },
        rootMobile: {
            flexGrow: 2,
            margin: "0  0.5rem",
            backgroundColor: theme.palette.primary.light,
            borderRadius: "3px",
        },
    })),
    connect(
        (_state) => ({
        }),
        (dispatch) => bindActionCreators({
            clearInputErrorMessages,
        }, dispatch),
    ),
)(Signup)
