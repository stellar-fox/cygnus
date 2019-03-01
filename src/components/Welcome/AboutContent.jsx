import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { Typography } from "@material-ui/core"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"
import ledgerhqlogo from "./static/ledgerhqlogo.svg"
import stellarlogo from "../StellarFox/static/stellar-logo.svg"
import { stellarFoundationLink } from "../StellarFox/env"

/**
 * Cygnus.
 *
 * Renders welcome page about content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<AboutContent>` component.
 *
 * @function AboutContent
 * @returns {React.ReactElement}
 */
const AboutContent = ({ classes }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <Fragment>
        {!isMobile && <div className={`p-t p-b ${classes.bgLight}`}>
            <div className={`flex-box-row content-centered items-centered ${classes.hr}`}></div>
        </div>}
        <div className={
            isMobile ?
                `flex-box-col content-centered items-centered container ${classes.bgLight} ${classes.considerFooter}` :
                `flex-box-row space-around container ${classes.bgLight}`}
        >

            <div className={`flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <img
                    className="footnote-logo"
                    src={stellarlogo}
                    alt="stellar"
                />
                <Typography color="secondary" className={classes.disclaimer}>
                    Stellar™ is a trademark of the <a
                        href={stellarFoundationLink} target="_blank"
                        rel="noopener noreferrer"
                    >
                        Stellar Development Foundation.
                    </a>. All rights reserved.
                </Typography>
                <Typography color="secondary" className={classes.disclaimer}>
                    <i>Stellar Fox</i> is an independent company and not affiliated with
                    Stellar Development Foundation. We do, however, build on top
                    of Stellar™ protocol and are using their platform SDK's.
                </Typography> 
            </div>

            <div className={`flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <img
                    className="footnote-logo"
                    src={ledgerhqlogo}
                    alt="LedgerHQ"
                />
                <Typography color="secondary" className={classes.disclaimer}>
                    Ledger, Ledger Nano S, Ledger Vault, Bolos are registered
                    trademarks of Ledger SAS. All rights reserved.
                </Typography>
            </div>
        </div>
    </Fragment>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        considerFooter: {
            paddingBottom: 26,
        },
        bgLight: {
            backgroundColor: theme.palette.primary.light,
        },
        disclaimer: {
            padding: "0.2rem 0",
            fontSize: "9px",
            opacity: "0.5",
        },
        hr: {
            height: "1px",
            backgroundColor: theme.palette.secondary.dark,
            margin: "auto",
            width: "90%",
        },
        paddingMobile: {
            padding: "0 0.5rem",
        },
        paddingNormal: {
            padding: "0 10%",
        }, 
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(AboutContent)
