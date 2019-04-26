import React, { memo }  from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import {
    handleException,
    shorten,
} from "@xcmats/js-toolbox"
import {
    formatFullName,
    rgb,
    pubKeyAbbr,
} from "../../lib/utils"
import { unknownPubKeyAbbr } from "../StellarFox/env"




// <BankAppBarItems> component
export default memo(compose(
    withStyles({

        accountHomeDomain: { fontVariant: "small-caps" },

        appBarItems: {
            display: "block",
            color: rgb(15,46,83),
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
            marginTop: "5px",
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
            authenticated: state.Auth.authenticated,
            StellarAccount: state.StellarAccount,
            publicKey: state.LedgerHQ.publicKey,
            firstName: state.Account.firstName,
            lastName: state.Account.lastName,
            paymentAddress: state.Account.paymentAddress,
        })
    )
)(
    ({
        authenticated, classes, publicKey, StellarAccount, firstName, lastName,
        paymentAddress,
    }) =>
        <div className={classes.appBarItems}>
            <div className={classes.appBarTitle}>
                <div className={classes.barTitleAccount}>
                    {authenticated ?
                        <Typography align="center" variant="body1"
                            noWrap color="primary"
                        >
                            {formatFullName(firstName, lastName)}
                        </Typography> : <Typography align="center"
                            variant="h5" color="primary"
                        >Account</Typography>
                    }
                </div>
                <div className={classes.barSubtitleAccount}>
                    <div className="flex-box-col content-centered">
                        {
                            StellarAccount.accountId && StellarAccount.homeDomain ?
                                <div className="flex-box-col content-centered">
                                    {authenticated ?
                                        <Typography variant="h5" color="primary">
                                            {paymentAddress ?
                                                shorten(paymentAddress, 50) :
                                                handleException(
                                                    () => pubKeyAbbr(publicKey),
                                                    () => unknownPubKeyAbbr
                                                )}
                                        </Typography> :
                                        <Typography variant="h5" color="primary">
                                            {handleException(
                                                () => pubKeyAbbr(publicKey),
                                                () => unknownPubKeyAbbr
                                            )}
                                        </Typography>}
                                    <Typography variant="h5" color="primary">
                                        <span className="fade-strong">
                                            {StellarAccount.homeDomain}
                                        </span>
                                    </Typography>
                                </div> :
                                <div className="flex-box-col content-centered">
                                    {authenticated ?
                                        <Typography variant="h5" color="primary">
                                            {paymentAddress ?
                                                shorten(paymentAddress, 50) :
                                                handleException(
                                                    () => pubKeyAbbr(publicKey),
                                                    () => unknownPubKeyAbbr
                                                )}
                                        </Typography> :
                                        <Typography variant="h5" color="primary">
                                            {handleException(
                                                () => pubKeyAbbr(publicKey),
                                                () => unknownPubKeyAbbr
                                            )}
                                        </Typography>}
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
))
