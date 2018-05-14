import React from "react"
import { connect } from "react-redux"
import { compose } from "redux"

import { withStyles } from "@material-ui/core/styles"

import {
    pubKeyAbbr,
    handleException,
} from "../../lib/utils"
import { unknownPubKeyAbbr } from "../StellarFox/env"




// <BankAppBarItems> component
export default compose(
    withStyles({

        accountHomeDomain: { fontVariant: "small-caps", },

        appBarItems: {
            display: "block",
            color: "rgb(15,46,83)",
            fontWeight: "normal",
            "&:before": {
                content: "''",
                display: "inline-block",
                verticalAlign: "middle",
                height: "100%",
            },
        },

        appBarTitle: {
            display: "inline-block",
            verticalAlign: "middle",
        },

        barTitleAccount: {
            fontSize: "1rem",
        },

        barSubtitleAccount: {
            textAlign: "center",
            fontSize: "0.8rem",
        },

    }),
    connect(
        // map state to props.
        (state) => ({
            StellarAccount: state.StellarAccount,
            publicKey: state.LedgerHQ.publicKey,
        })
    )
)(
    ({
        classes, publicKey, StellarAccount,
    }) =>
        <div className={classes.appBarItems}>
            <div className={classes.appBarTitle}>
                <div className={classes.barTitleAccount}>
                    {
                        StellarAccount.accountId && StellarAccount.homeDomain ?
                            <div className={classes.accountHomeDomain}>
                                { StellarAccount.homeDomain }
                            </div> :
                            <div>Account Number</div>
                    }
                </div>
                <div className={classes.barSubtitleAccount}>
                    {
                        handleException(
                            () => pubKeyAbbr(publicKey),
                            () => unknownPubKeyAbbr
                        )
                    }
                </div>
            </div>
        </div>
)
