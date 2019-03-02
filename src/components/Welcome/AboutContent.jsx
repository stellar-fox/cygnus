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
import sflogo from "../StellarFox/static/sf-logo.svg"




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
        {!isMobile && <div className={`p-t p-b ${classes.bg}`}>
            <div className={`flex-box-row content-centered items-centered ${classes.hr}`}></div>
        </div>}
        <div className={
            isMobile ?
                `flex-box-col content-centered items-centered container ${classes.bg} ${classes.considerFooter}` :
                `flex-box-row space-around container ${classes.bg}`}
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


            <div className={`flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <img
                    className="footnote-logo"
                    src={sflogo}
                    alt="Stellar Fox"
                />
                <Typography color="secondary" className={classes.disclaimer}>
                    <i>Stellar Fox</i> is an independent company not affiliated with
                    Stellar Development Foundation. We build on top
                    of Stellar™ protocol and are using their platform SDK's.
                </Typography> 
                <Typography color="secondary" noWrap className={classes.disclaimer}>
                    <i>Stellar Fox</i> 2017-2019. All rights reserved.
                </Typography>
            </div>
        </div>

        <div className={`flex-box-row items-centered content-centered ${classes.bg} p-b-large`}>
            <a href="https://www.youtube.com/channel/UCaSPZyrynD3Jww80VSfMKFw/" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGUvPgogPGRlc2MvPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMGYyZTUzIiBpZD0iRmlsbC0xOTUiIGQ9Im00OC43OTE1OTIsMjIuNzYxNjFjMCwwIC0wLjM3NDk2MiwtMi42NDI2NDEgLTEuNTI0OTksLTMuODA2NzIxYy0xLjQ1NzY3MiwtMS41MjcxMTkgLTMuMDkyNTksLTEuNTM0MzY5IC0zLjg0MjA5MSwtMS42MjM4NWMtNS4zNjYyMjIsLTAuMzg4MTcgLTEzLjQxNTk5MSwtMC4zODgxNyAtMTMuNDE1OTkxLC0wLjM4ODE3bC0wLjAxNzA0LDBjMCwwIC04LjA0OTM0MSwwIC0xMy40MTU5OTEsMC4zODgxN2MtMC43NDk0OTgsMC4wODk0ODEgLTIuMzgzNTcsMC4wOTY3MzEgLTMuODQyMDg5LDEuNjIzODVjLTEuMTUwMDMsMS4xNjQwOCAtMS41MjQxNCwzLjgwNjcyMSAtMS41MjQxNCwzLjgwNjcyMWMwLDAgLTAuMzgzNDgsMy4xMDMyMzkgLTAuMzgzNDgsNi4yMDY0OGwwLDIuOTA5OGMwLDMuMTAyODA4IDAuMzgzNDgsNi4yMDYwNDkgMC4zODM0OCw2LjIwNjA0OWMwLDAgMC4zNzQxMSwyLjY0MjYzOSAxLjUyNDE0LDMuODA2NzMyYzEuNDU4NTE5LDEuNTI3NTM4IDMuMzc0NjU5LDEuNDc4NTM5IDQuMjI4MTMsMS42Mzg3NDhjMy4wNjgzLDAuMjk0NDM0IDEzLjAzODQ2OSwwLjM4NTYyIDEzLjAzODQ2OSwwLjM4NTYyYzAsMCA4LjA1ODI4OSwtMC4wMTIzNiAxMy40MjQ1MTEsLTAuNDAwMTAxYzAuNzQ5NSwtMC4wODk0NzggMi4zODQ0MTgsLTAuMDk2NzI5IDMuODQyMDkxLC0xLjYyNDI2OGMxLjE1MDAyOCwtMS4xNjQwOTMgMS41MjQ5OSwtMy44MDY3MzIgMS41MjQ5OSwtMy44MDY3MzJjMCwwIDAuMzgyNjI5LC0zLjEwMzI0MSAwLjM4MjYyOSwtNi4yMDYwNDlsMCwtMi45MDk4YzAsLTMuMTAzMjQxIC0wLjM4MjYyOSwtNi4yMDY0OCAtMC4zODI2MjksLTYuMjA2NDh6bS0yMi43NTA0MzEsMTIuNjQxMzUybC0wLjAwMTcwMSwtMTAuNzc0NjMybDEwLjM2MTc1Miw1LjQwNTg0OWwtMTAuMzYwMDUsNS4zNjg3ODJ6Ii8+CiA8L2c+Cjwvc3ZnPg=="
                    width="40" height="40"
                    alt="YouTube Logo"
                />
            </a>
            <a href="https://github.com/stellar-fox" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGUvPgogPGRlc2MvPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMGYyZTUzIiBpZD0ic3ZnXzEiIGQ9Im0yNS40MjUyNyw0Ny41MTY4OTFjMCwtMC40NDk3MjIgLTAuMDE1ODYsLTEuNjM5NjYgLTAuMDI0OTI5LC0zLjIyMDA2MmMtNS4xMzUxNjIsMS4xNDM0NTkgLTYuMjE4NjMyLC0yLjUzNzkzIC02LjIxODYzMiwtMi41Mzc5M2MtMC44Mzk4MDksLTIuMTg2OTg5IC0yLjA1MDIxOSwtMi43NjkxOCAtMi4wNTAyMTksLTIuNzY5MThjLTEuNjc2MjEsLTEuMTc0ODM5IDAuMTI2OTQsLTEuMTUwNDQgMC4xMjY5NCwtMS4xNTA0NGMxLjg1MzAwOCwwLjEzMzY0IDIuODI3Njc5LDEuOTUxMTAzIDIuODI3Njc5LDEuOTUxMTAzYzEuNjQ2NzQsMi44OTIzNDkgNC4zMjAyOSwyLjA1Nzk5OSA1LjM3MzE2MSwxLjU3MzQxOGMwLjE2Nzc0LC0xLjIyMzY0IDAuNjQ0ODcxLC0yLjA1Nzk5OSAxLjE3MTg3OSwtMi41MzA5NmMtNC4wOTkyODksLTAuNDc3NiAtOC40MDkzOCwtMi4xMDIxNTggLTguNDA5MzgsLTkuMzU1NzA5YzAsLTIuMDY2MTQxIDAuNzE5NjcxLC0zLjc1NTc3MiAxLjkwMDYxLC01LjA3OTM1Yy0wLjE4OTI3LC0wLjQ3ODc3MSAtMC44MjM5NCwtMi40MDMxMzEgMC4xODEzMzIsLTUuMDA5NjMyYzAsMCAxLjU1MDQwOSwtMC41MDg5OCA1LjA3NjIyOSwxLjk0MDYzOWMxLjQ3MjIxLC0wLjQxOTUxIDMuMDUyMDgsLTAuNjMwOTk5IDQuNjIyODksLTAuNjM3OTdjMS41Njc0MSwwLjAwNjk3MSAzLjE0NjE0OSwwLjIxODQ2IDQuNjIxNzU4LDAuNjM3OTdjMy41MjM1NiwtMi40NDk2MTkgNS4wNzE3MDEsLTEuOTQwNjM5IDUuMDcxNzAxLC0xLjk0MDYzOWMxLjAwNzU0MiwyLjYwNTMzMSAwLjM3NDAwMSw0LjUyOTcwMSAwLjE4MzYwMSw1LjAwOTYzMmMxLjE4MzIxMiwxLjMyMzU3OCAxLjg5NzIwOSwzLjAxMzIwOCAxLjg5NzIwOSw1LjA3OTM1YzAsNy4yNzIxNTIgLTQuMzE2ODg3LDguODcyMjk5IC04LjQyOTc3OSw5LjM0MDU5OWMwLjY2NDEzOSwwLjU4NDUyMiAxLjI1MzQ3MSwxLjczOTU5NyAxLjI1MzQ3MSwzLjUwNTkzMmMwLDIuNTMwOTYgLTAuMDIzODA0LDQuNTcyNjg5IC0wLjAyMzgwNCw1LjE5MzIzYzAsMC41MDY2NDkgMC4zMzMyMDIsMS4wOTQ2NTggMS4yNzA0ODEsMC45MDk4ODljNy4zMjkzMTEsLTIuNTA3NzIxIDEyLjYxNDA3MSwtOS41OTg1OTEgMTIuNjE0MDcxLC0xNy45NTg0MmMwLC0xMC40NTUwMjEgLTguMjY2NTc5LC0xOC45Mjk5MDEgLTE4LjQ2MjExMSwtMTguOTI5OTAxYy0xMC4xOTQzODksMCAtMTguNDYwOTcsOC40NzQ4OCAtMTguNDYwOTcsMTguOTI5OTAxYzAuMDAxMTMsOC4zNjIxNiA1LjI5MDQzLDE1LjQ1NzY2OCAxMi42MjY1NDEsMTcuOTYwNzM5YzAuOTIyNTM5LDAuMTczMTQ5IDEuMjYwMjY5LC0wLjQxMTM2OSAxLjI2MDI2OSwtMC45MTIyMDl6Ii8+CiA8L2c+Cjwvc3ZnPg=="
                    width="40" height="40"
                    alt="Github Logo"
                />
            </a>
            <a href="https://twitter.com/StellarFoxNet/" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkuOTk5OTk5OTk5OTk5OTkiIGhlaWdodD0iNTkuOTk5OTk5OTk5OTk5OTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGUvPgogPGRlc2MvPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMGYyZTUzIiBpZD0ic3ZnXzEiIGQ9Im00MS4wNTIxMzksMTguNDM2Njg5Yy0xLjIwODk1LC0xLjM3NDQ4OSAtMi45MzE1OTksLTIuMjUwMjI5IC00LjgzODA4MSwtMi4yODE5NmMtMy42NjA0NTgsLTAuMDYwOTMgLTYuNjI4NDA4LDMuMDMyMTkgLTYuNjI4NDA4LDYuOTA4MzljMCwwLjU1MDExOSAwLjA1ODY0MSwxLjA4NjU2OSAwLjE3MTcyMSwxLjYwMTU0OWMtNS41MDg3ODksLTAuMzU3MzE5IC0xMC4zOTI5LC0zLjIyNTg5OSAtMTMuNjYxOTQ5LC03LjU0OTk1Yy0wLjU3MDU2LDEuMDM2MTQgLTAuODk3NTExLDIuMjQ3MTYgLTAuODk3NTExLDMuNTQ0NDNjMCwyLjQ1NTg0MSAxLjE3MDE3OSw0LjYzNTM4IDIuOTQ4NzE5LDUuOTIyMjcyYy0xLjA4NjUxLC0wLjA0Nzk3IC0yLjEwODU1OSwtMC4zNzY4ODEgLTMuMDAyMTksLTAuOTE2NDdjLTAuMDAwNjQ5LDAuMDI5NDg4IC0wLjAwMDY0OSwwLjA1ODk4OSAtMC4wMDA2NDksMC4wODkwMDhjMCwzLjQyOTU5IDIuMjg0Nzk5LDYuMzA2NzUxIDUuMzE3MDQsNi45NzY5ODJjLTAuNTU2MTgxLDAuMTU3NiAtMS4xNDE3NSwwLjI0MDA3OCAtMS43NDYyMzEsMC4yMzYwNjljLTAuNDI3MTA5LC0wLjAwMjgzMSAtMC44NDI0MTksLTAuMDUwMjAxIC0xLjI0NzA4LC0wLjEzNTIzOWMwLjg0MzQwMSwyLjgxMjYwNyAzLjI5MTE4OSw0Ljg2NDk5OCA2LjE5MTc3MSw0LjkzMjg1OGMtMi4yNjg0OCwxLjg4MzA2OCAtNS4xMjY0MjEsMy4wMDQ1NTkgLTguMjMyLDIuOTk4MTYxYy0wLjUzNTAxLC0wLjAwMTExIC0xLjA2MjYsLTAuMDM1Njc5IC0xLjU4MTE0LC0wLjEwMjE5MmMyLjkzMzM3OSwyLjAxMjcxMSA2LjQxNzQzOSwzLjE4NDU3IDEwLjE2MDYwOSwzLjE4NTU1MWMxMi4xOTE3ODgsMC4wMDMyMDEgMTguODU4OTcxLC0xMC42MDY2NCAxOC44NTg5NzEsLTE5LjgwOTM4YzAsLTAuMzAxOTI5IC0wLjAwNjYyMiwtMC42MDIyNDkgLTAuMDE5MjE4LC0wLjkwMTExOWMxLjI5NTA0OCwtMC45NjQ5ODEgMi40MTg3MDksLTIuMTc0ODYgMy4zMDczMzksLTMuNTU2NDMxYy0xLjE4ODYwMiwwLjUzNTgwMSAtMi40NjYyMTMsMC44OTE2NTEgLTMuODA2ODIsMS4wNDA5MmMxLjM2ODM4OSwtMC44NDIxNzEgMi40MTk1MTgsLTIuMTkwMDQxIDIuOTE0MzEsLTMuODA2Mzc5Yy0xLjI4MDgzLDAuNzc2NzMgLTIuNjk5Mjk5LDEuMzMzNzUgLTQuMjA5MjAyLDEuNjIyOTI5eiIvPgogPC9nPgo8L3N2Zz4="
                    width="40" height="40"
                    alt="Twitter Logo"
                />
            </a>
        </div>
    </Fragment>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        considerFooter: {
            paddingBottom: 26,
        },
        bg: {
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
            padding: "0 5%",
        },
        
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(AboutContent)
