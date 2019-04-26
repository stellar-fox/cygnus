import React, { memo } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { rgb } from "../../lib/utils"
import { withStyles } from "@material-ui/core/styles"
import { fade } from "@material-ui/core/styles/colorManipulator"
import { Typography } from "@material-ui/core"
import {
    appCodeName,
    testNetAddr,
} from "../StellarFox/env"
import cygnusBlue from "../StellarFox/static/cygnusBlue.svg"




// <BankAppBarTitle> component
export default memo(compose(
    withStyles((theme) => ({

        appBarTitle: {
            color: rgb(15, 46, 83),
            fontWeight: "normal",
        },

        barTitle: {
            color: theme.palette.primary.other,
        },

        barSubtitle: {
            position: "relative",
            top: 3,
            left: 50,
            lineHeight: "5px",
            fontSize: "12px",
            color: fade(theme.palette.primary.other, 0.8),
        },

    })),
    connect(
        // map state to props.
        (state) => ({
            ledgerConnected: state.LedgerHQ.connected,
            horizon: state.StellarAccount.horizon,
        })
    )
)(
    ({ classes, horizon, ledgerConnected, viewName }) =>
        <div className="flex-box-row items-centered">
            <div className="flex-box-col">
                <div className={`flex-box-row ${classes.barTitle}`}>
                    <Typography variant="h3" color="inherit">
                        {appCodeName}
                    </Typography>
                    <img
                        src={cygnusBlue}
                        width="25px"
                        height="25px"
                        alt="Cygnus"
                        style={{ position: "relative", top: -7, left: -2 }}
                    />
                </div>
                <div className={classes.barSubtitle}>{viewName}</div>
            </div>

            { ledgerConnected &&
                <div style={{ marginLeft: "10px"}} className="ledger-nano-s">
                </div>
            }

            { horizon === testNetAddr &&
            <div
                style= {{ marginLeft: "10px" }}
                className={"border-error glass-error glass-error-text"}
            >
                Test Net
            </div>
            }

        </div>
))
