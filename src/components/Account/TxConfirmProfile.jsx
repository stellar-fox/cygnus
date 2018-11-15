import React, { Fragment } from "react"
import { connect } from "react-redux"
import Divider from "../../lib/mui-v1/Divider"
import {
    calculateTxFee,
    htmlEntities as he,
    nextSequenceNumber,
} from "../../lib/utils"
import { liveNetAddr } from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import {
    handleException,
    string,
} from "@xcmats/js-toolbox"
import CheckIcon from "@material-ui/icons/Check"




// ...
export default connect(
    // map state to props.
    (state) => ({
        fingerprintUserData: state.Account.fingerprintUserData,
        horizon: state.StellarAccount.horizon,
        publicKey: state.StellarAccount.accountId,
        sequence: state.StellarAccount.sequence,
    })
)(
    ({ fingerprintUserData, horizon, publicKey, sequence }) =>
        <Fragment>
            <Typography style={{ paddingTop: "0.5rem" }} variant="body1"
                color="primary" align="center"
            >
                The following fingerprint will be lodged within this account:
            </Typography>
            <Typography variant="caption" color="primary" align="center">
                This fingerprint corresponds to your user profile data and
                ensures that your data is tamper proof.
            </Typography>
            <Typography style={{ paddingTop: "0.5rem" }} align="center">
                <span style={{
                    opacity: "0.8", fontWeight: 600, color: "white",
                    fontSize: "0.7rem",
                }} className="border-primary glass"
                >
                    {btoa(fingerprintUserData)}
                </span>
            </Typography>
            <Divider />
            <Typography variant="body1" color="primary" align="center">
                Please confirm that the following info is the same on your
                device<he.Apos />s screen:
            </Typography>


            <div className="p-t flex-box-row space-around">
                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Set Data</Typography>
                            <Typography align="center">
                                <span className="glass-text">idSig</span>
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Data Value</Typography>
                            <Typography align="center">
                                <span className="glass-text">
                                    {
                                        string.shorten(
                                            btoa(fingerprintUserData),
                                            25
                                        )
                                    }
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Memo</Typography>
                            <Typography align="center">
                                <span className="glass-text">[none]</span>
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Fee</Typography>
                            <Typography align="center">
                                <span className="glass-text">
                                    {calculateTxFee(1)}
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex-box-row space-around p-t p-b">
                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Network</Typography>
                            <Typography align="center">
                                <span className="glass-text">
                                    {horizon === liveNetAddr ?
                                        "Public" : "Test"}
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Transaction Source</Typography>
                            <Typography align="center">
                                <span className="glass-text">
                                    {
                                        handleException(
                                            () => string.shorten(publicKey, 13),
                                            () => "Not Available")
                                    }
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="flex-box-col items-flex-end">
                    <div className="flex-box-row items-centered border-primary glass">
                        <div>
                            <Typography align="center" color="primary"
                                variant="caption"
                            >Sequence Number</Typography>
                            <Typography align="center">
                                <span className="glass-text">
                                    {
                                        string.shorten(
                                            nextSequenceNumber(sequence),
                                            13
                                        )
                                    }
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-t border-error glass-error glass-error-text">
                Action Required
            </div>

            <Typography align="center" color="primary" variant="body1">
                When you are sure the info above is correct press
                <he.Nbsp />
                <CheckIcon
                    style={{
                        fontSize: "1.5rem",
                    }}
                />
                <he.Nbsp />
                on the device to sign and send the transaction.
            </Typography>

        </Fragment>
)
