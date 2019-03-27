import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    func,
    string,
} from "@xcmats/js-toolbox"
import { action as ModalAction } from "../../redux/Modal"
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import InputField from "../../lib/mui-v1/InputField"
import {
    clearInputErrorMessages,
    implodeAccount,
} from "../../thunks/users"
import StatusMessage from "../StatusMessage"



/**
 * Cygnus.
 *
 * Modal with content for deleting user account and all user data.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */






/**
 * `<ImplodeAccountModal>` component.
 *
 * @function ImplodeAccountModal
 * @returns {React.ReactElement}
 */
const ImplodeAccountModal = ({
    clearInputErrorMessages, hideModal, idSig, implodeAccount,
    modalId, passwordInputError, passwordInputErrorMessage, paySig,
    visible,
}) => {

    const [password, setPassword] = React.useState(),
        [keepEmail, setKeepEmail] = React.useState(false),
        updatePassword = (event) =>
            setPassword({ password: event.target.value }),
        emailOptOut = (event) =>
            setKeepEmail(event.target.checked),
        handleProceed = () => {
            implodeAccount(password, keepEmail)
        },
        handleCancel = () => {
            clearInputErrorMessages()
            setPassword(null)
            setKeepEmail(false)
            hideModal()
        }


    return <Dialog
        aria-labelledby="implode-account-title"
        aria-describedby="implode-account-description"
        open={ modalId === "implodeAccount" && visible }
    >
        <DialogTitle id="implode-account-title">
            <div className="m-t flex-box-row content-centered">
                <Typography color="primary" variant="h2" noWrap>
                    Be well and prosper.
                </Typography>
            </div>
        </DialogTitle>
        <DialogContent id="implode-account-description">

            <div className="flex-box-col">
                <Typography color="primary" variant="h5">
                    Goodbyes are not forever. Even though we will wipe
                    your personal data, all your funds are safe, including the
                    transaction history. You can always restore your account
                    with other similar services or return here.
                </Typography>

                <Typography
                    style={{ marginTop: "2rem" }}
                    color="primary"
                    variant="h5"
                >
                     Here is the summary of what you will lose:
                </Typography>
                <div className="p-l p-t">
                    <Typography color="primary" variant="body2">
                        • Your payment address.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Your contact book.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Preferred currency setting.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Profile signature verification on this account.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Payment address signature verification on this account.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • User configuration on our servers.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Subscribtion to our emails.
                    </Typography>
                </div>

                <Typography
                    style={{ marginTop: "1rem" }}
                    color="primary"
                    variant="h5"
                >
                    What always stays with you:
                </Typography>
                <div className="p-l p-t">
                    <Typography color="primary" variant="body2">
                        • Your account number.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Your unspent funds.
                    </Typography>
                    <Typography color="primary" variant="body2">
                        • Transaction history.
                    </Typography>
                </div>
            </div>

            <div className="flex-box-col">

                { (idSig || paySig) &&
                <Typography
                    style={{ marginTop: "2rem" }}
                    color="primary"
                    variant="h5"
                    align="center"
                >
                    <span className="red-badge">
                        You will need your Ledger device connected before you can proceed.
                    </span>
                </Typography>
                }

                <FormControlLabel
                    style={{ marginTop: "1rem" }}
                    control={
                        <Checkbox onChange={emailOptOut}
                            value="keepEmail" color="primary"
                        />
                    }
                    label={
                        <Typography color="primary" variant="h5">
                            Keep me on the mailing list.
                        </Typography>
                    }
                />


                <Typography
                    style={{ marginTop: "1rem", fontWeight: 600 }}
                    color="primary"
                    variant="h5"
                >
                    Enter your user password to confirm this action.
                </Typography>
                <InputField
                    name="password"
                    type="password"
                    label="Password"
                    color="primary"
                    onChange={updatePassword}
                    error={passwordInputError}
                    errorMessage={passwordInputErrorMessage}
                />

            </div>

        </DialogContent>
        <DialogActions>

            <div className="status-message m-r">
                <StatusMessage color="primary" />
            </div>
            <div>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleProceed}
                    color="danger"
                    style={{ marginRight: "4px"}}
                >
                    Proceed
                </Button>
            </div>

        </DialogActions>
    </Dialog>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        dialogTitle: {
            color: theme.palette.primary.other,
        },
    })),
    connect(
        (state) => ({
            modalId: state.Modal.modalId,
            visible: state.Modal.visible,
            passwordInputError: state.Errors.passwordInputError,
            passwordInputErrorMessage: state.Errors.passwordInputErrorMessage,
            implosionProgress: state.Progress.implosion,
            idSig: state.StellarAccount.data ?
                state.StellarAccount.data.idSig : string.empty(),
            paySig: state.StellarAccount.data ?
                state.StellarAccount.data.paySig : string.empty(),
        }),
        (dispatch) => bindActionCreators({
            clearInputErrorMessages,
            hideModal: ModalAction.hideModal,
            implodeAccount,
        }, dispatch),
    ),
)(ImplodeAccountModal)
