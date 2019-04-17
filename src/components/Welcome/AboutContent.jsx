import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import {
    Link as MuiLink,
    Typography,
} from "@material-ui/core"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"
import ledgerhqlogo from "./static/ledgerhqlogo.svg"
import stellarlogo from "../StellarFox/static/stellar-logo.svg"
import { stellarFoundationLink } from "../StellarFox/env"
import sflogo from "../StellarFox/static/sf-logo.png"
import { Link } from "react-router-dom"
import { env } from "../StellarFox"




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
        <div style={{ paddingTop: isMobile ? "2rem" : "3rem" }} className={
            `flex-box-row container ${classes.bg} ${isMobile && "space-between"}`}
        >
            <div className={`flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <span className="fade about-content-heading">ABOUT US</span>
                <MuiLink component={Link} to="/why" underline="none" color="secondary">
                    <span className="fade-strong about-content-item">Who We Are</span>
                </MuiLink>
                <MuiLink target="_blank" rel="noopener noreferrer" href="/terms" underline="none" color="secondary">
                    <span className="fade-strong about-content-item">Terms of Use</span>
                </MuiLink>
                <MuiLink target="_blank" rel="noopener noreferrer" href="/privacy" underline="none" color="secondary">
                    <span className="fade-strong about-content-item">Privacy Policy</span>
                </MuiLink>
            </div>
            <div className={`flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <span className="fade about-content-heading">HELP</span>
                <MuiLink component={Link} to="/faq" underline="none" color="secondary">
                    <span className="fade-strong about-content-item">FAQ</span>
                </MuiLink>
                <MuiLink component={Link} to="/pgp" underline="none" color="secondary">
                    <span className="fade-strong about-content-item">PGP Key</span>
                </MuiLink>
            </div>
            <div className={`flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <span className="fade about-content-heading">CONTACT US</span>
                <MuiLink target="_blank" rel="noopener noreferrer"
                    href="mailto:contact@stellarfox.net?subject=[WEB:Cygnus]"
                    underline="none" color="secondary"
                >
                    <span
                        style={{ whiteSpace: "nowrap" }}
                        className="fade-strong about-content-item"
                    >
                        Send us an Email
                    </span>
                </MuiLink>
                <MuiLink target="_blank" rel="noopener noreferrer"
                    href="https://twitter.com/StellarFoxNet" underline="none"
                    color="secondary"
                >
                    <span
                        className="fade-strong about-content-item"
                        style={{ whiteSpace: "nowrap" }}
                    >
                        Tweet at us!
                    </span>
                </MuiLink>
            </div>
        </div>

        {!isMobile && <div className={`p-t p-b ${classes.bg}`}>
            <div className={`flex-box-row content-centered items-centered ${classes.hr}`}></div>
        </div>}

        <div className={
            isMobile ?
                `flex-box-col container ${classes.bg} ${classes.considerFooter}` :
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
                    style={{ opacity: 0.65 }}
                    className="footnote-logo"
                    src={ledgerhqlogo}
                    alt="LedgerHQ"
                />
                <Typography color="secondary" className={classes.disclaimer}>
                    Ledger, Ledger Nano S, Ledger Vault, Bolos are registered
                    trademarks of Ledger SAS. All rights reserved.
                </Typography>
            </div>


            <div className={`p-b flex-box-col ${isMobile ? classes.paddingMobile : classes.paddingNormal}`}>
                <img
                    style={{
                        borderRadius: "1px",
                        opacity: 0.65,
                    }}
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
                    <i>Stellar Fox</i> {env.appCopyDates}. All rights reserved.
                </Typography>
            </div>
        </div>

        <div className={`flex-box-row items-centered content-centered ${classes.socialMediaIcons} p-b p-t`}>
            <a href="https://www.facebook.com/stellarfoxnet/" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDxnPiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPiAgPHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjYyIiB3aWR0aD0iNjIiIHk9Ii0xIiB4PSItMSIvPiA8L2c+IDxnPiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPiAgPHBhdGggc3Ryb2tlPSJudWxsIiBmaWxsPSIjMGYyZTUzIiBpZD0iRmFjZWJvb2tfX3gyOF9hbHRfeDI5XyIgZD0ibTQ1LjE0MjU0OSwxOS45MDQ5NjhjMCwtMi42NTgzNTkgLTIuMzg5MTU4LC01LjA0NzUxNiAtNS4wNDc1MTYsLTUuMDQ3NTE2bC0yMC4xOTAwNjUsMGMtMi42NTgzNTksMCAtNS4wNDc1MTYsMi4zODkxNTggLTUuMDQ3NTE2LDUuMDQ3NTE2bDAsMjAuMTkwMDY1YzAsMi42NTgzNTkgMi4zODkxNTgsNS4wNDc1MTYgNS4wNDc1MTYsNS4wNDc1MTZsMTAuMDk1MDMyLDBsMCwtMTEuNDQxMDM3bC0zLjcwMTUxMiwwbDAsLTUuMDQ3NTE2bDMuNzAxNTEyLDBsMCwtMS45NTE3MDZjMCwtMy4zOTg2NjEgMi41NTc0MDgsLTYuNDYwODIxIDUuNjg2ODY4LC02LjQ2MDgyMWw0LjA3MTY2MywwbDAsNS4wNDc1MTZsLTQuMDcxNjYzLDBjLTAuNDM3NDUxLDAgLTAuOTc1ODUzLDAuNTM4NDAyIC0wLjk3NTg1MywxLjM0NjAwNGwwLDIuMDE5MDA2bDUuMDQ3NTE2LDBsMCw1LjA0NzUxNmwtNS4wNDc1MTYsMGwwLDExLjQ0MTAzN2w1LjM4NDAxNywwYzIuNjU4MzU5LDAgNS4wNDc1MTYsLTIuMzg5MTU4IDUuMDQ3NTE2LC01LjA0NzUxNmwwLC0yMC4xOTAwNjV6Ii8+IDwvZz48L3N2Zz4="
                    width="40" height="40"
                    alt="Facebook"
                />
            </a>
            <a href="https://www.youtube.com/channel/UCaSPZyrynD3Jww80VSfMKFw/" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGUvPgogPGRlc2MvPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMGYyZTUzIiBpZD0iRmlsbC0xOTUiIGQ9Im00OC43OTE1OTIsMjIuNzYxNjFjMCwwIC0wLjM3NDk2MiwtMi42NDI2NDEgLTEuNTI0OTksLTMuODA2NzIxYy0xLjQ1NzY3MiwtMS41MjcxMTkgLTMuMDkyNTksLTEuNTM0MzY5IC0zLjg0MjA5MSwtMS42MjM4NWMtNS4zNjYyMjIsLTAuMzg4MTcgLTEzLjQxNTk5MSwtMC4zODgxNyAtMTMuNDE1OTkxLC0wLjM4ODE3bC0wLjAxNzA0LDBjMCwwIC04LjA0OTM0MSwwIC0xMy40MTU5OTEsMC4zODgxN2MtMC43NDk0OTgsMC4wODk0ODEgLTIuMzgzNTcsMC4wOTY3MzEgLTMuODQyMDg5LDEuNjIzODVjLTEuMTUwMDMsMS4xNjQwOCAtMS41MjQxNCwzLjgwNjcyMSAtMS41MjQxNCwzLjgwNjcyMWMwLDAgLTAuMzgzNDgsMy4xMDMyMzkgLTAuMzgzNDgsNi4yMDY0OGwwLDIuOTA5OGMwLDMuMTAyODA4IDAuMzgzNDgsNi4yMDYwNDkgMC4zODM0OCw2LjIwNjA0OWMwLDAgMC4zNzQxMSwyLjY0MjYzOSAxLjUyNDE0LDMuODA2NzMyYzEuNDU4NTE5LDEuNTI3NTM4IDMuMzc0NjU5LDEuNDc4NTM5IDQuMjI4MTMsMS42Mzg3NDhjMy4wNjgzLDAuMjk0NDM0IDEzLjAzODQ2OSwwLjM4NTYyIDEzLjAzODQ2OSwwLjM4NTYyYzAsMCA4LjA1ODI4OSwtMC4wMTIzNiAxMy40MjQ1MTEsLTAuNDAwMTAxYzAuNzQ5NSwtMC4wODk0NzggMi4zODQ0MTgsLTAuMDk2NzI5IDMuODQyMDkxLC0xLjYyNDI2OGMxLjE1MDAyOCwtMS4xNjQwOTMgMS41MjQ5OSwtMy44MDY3MzIgMS41MjQ5OSwtMy44MDY3MzJjMCwwIDAuMzgyNjI5LC0zLjEwMzI0MSAwLjM4MjYyOSwtNi4yMDYwNDlsMCwtMi45MDk4YzAsLTMuMTAzMjQxIC0wLjM4MjYyOSwtNi4yMDY0OCAtMC4zODI2MjksLTYuMjA2NDh6bS0yMi43NTA0MzEsMTIuNjQxMzUybC0wLjAwMTcwMSwtMTAuNzc0NjMybDEwLjM2MTc1Miw1LjQwNTg0OWwtMTAuMzYwMDUsNS4zNjg3ODJ6Ii8+CiA8L2c+Cjwvc3ZnPg=="
                    width="40" height="40"
                    alt="YouTube"
                />
            </a>
            <a href="https://github.com/stellar-fox" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGUvPgogPGRlc2MvPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMGYyZTUzIiBpZD0ic3ZnXzEiIGQ9Im0yNS40MjUyNyw0Ny41MTY4OTFjMCwtMC40NDk3MjIgLTAuMDE1ODYsLTEuNjM5NjYgLTAuMDI0OTI5LC0zLjIyMDA2MmMtNS4xMzUxNjIsMS4xNDM0NTkgLTYuMjE4NjMyLC0yLjUzNzkzIC02LjIxODYzMiwtMi41Mzc5M2MtMC44Mzk4MDksLTIuMTg2OTg5IC0yLjA1MDIxOSwtMi43NjkxOCAtMi4wNTAyMTksLTIuNzY5MThjLTEuNjc2MjEsLTEuMTc0ODM5IDAuMTI2OTQsLTEuMTUwNDQgMC4xMjY5NCwtMS4xNTA0NGMxLjg1MzAwOCwwLjEzMzY0IDIuODI3Njc5LDEuOTUxMTAzIDIuODI3Njc5LDEuOTUxMTAzYzEuNjQ2NzQsMi44OTIzNDkgNC4zMjAyOSwyLjA1Nzk5OSA1LjM3MzE2MSwxLjU3MzQxOGMwLjE2Nzc0LC0xLjIyMzY0IDAuNjQ0ODcxLC0yLjA1Nzk5OSAxLjE3MTg3OSwtMi41MzA5NmMtNC4wOTkyODksLTAuNDc3NiAtOC40MDkzOCwtMi4xMDIxNTggLTguNDA5MzgsLTkuMzU1NzA5YzAsLTIuMDY2MTQxIDAuNzE5NjcxLC0zLjc1NTc3MiAxLjkwMDYxLC01LjA3OTM1Yy0wLjE4OTI3LC0wLjQ3ODc3MSAtMC44MjM5NCwtMi40MDMxMzEgMC4xODEzMzIsLTUuMDA5NjMyYzAsMCAxLjU1MDQwOSwtMC41MDg5OCA1LjA3NjIyOSwxLjk0MDYzOWMxLjQ3MjIxLC0wLjQxOTUxIDMuMDUyMDgsLTAuNjMwOTk5IDQuNjIyODksLTAuNjM3OTdjMS41Njc0MSwwLjAwNjk3MSAzLjE0NjE0OSwwLjIxODQ2IDQuNjIxNzU4LDAuNjM3OTdjMy41MjM1NiwtMi40NDk2MTkgNS4wNzE3MDEsLTEuOTQwNjM5IDUuMDcxNzAxLC0xLjk0MDYzOWMxLjAwNzU0MiwyLjYwNTMzMSAwLjM3NDAwMSw0LjUyOTcwMSAwLjE4MzYwMSw1LjAwOTYzMmMxLjE4MzIxMiwxLjMyMzU3OCAxLjg5NzIwOSwzLjAxMzIwOCAxLjg5NzIwOSw1LjA3OTM1YzAsNy4yNzIxNTIgLTQuMzE2ODg3LDguODcyMjk5IC04LjQyOTc3OSw5LjM0MDU5OWMwLjY2NDEzOSwwLjU4NDUyMiAxLjI1MzQ3MSwxLjczOTU5NyAxLjI1MzQ3MSwzLjUwNTkzMmMwLDIuNTMwOTYgLTAuMDIzODA0LDQuNTcyNjg5IC0wLjAyMzgwNCw1LjE5MzIzYzAsMC41MDY2NDkgMC4zMzMyMDIsMS4wOTQ2NTggMS4yNzA0ODEsMC45MDk4ODljNy4zMjkzMTEsLTIuNTA3NzIxIDEyLjYxNDA3MSwtOS41OTg1OTEgMTIuNjE0MDcxLC0xNy45NTg0MmMwLC0xMC40NTUwMjEgLTguMjY2NTc5LC0xOC45Mjk5MDEgLTE4LjQ2MjExMSwtMTguOTI5OTAxYy0xMC4xOTQzODksMCAtMTguNDYwOTcsOC40NzQ4OCAtMTguNDYwOTcsMTguOTI5OTAxYzAuMDAxMTMsOC4zNjIxNiA1LjI5MDQzLDE1LjQ1NzY2OCAxMi42MjY1NDEsMTcuOTYwNzM5YzAuOTIyNTM5LDAuMTczMTQ5IDEuMjYwMjY5LC0wLjQxMTM2OSAxLjI2MDI2OSwtMC45MTIyMDl6Ii8+CiA8L2c+Cjwvc3ZnPg=="
                    width="40" height="40"
                    alt="Github"
                />
            </a>
            <a href="https://twitter.com/StellarFoxNet/" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkuOTk5OTk5OTk5OTk5OTkiIGhlaWdodD0iNTkuOTk5OTk5OTk5OTk5OTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGUvPgogPGRlc2MvPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMGYyZTUzIiBpZD0ic3ZnXzEiIGQ9Im00MS4wNTIxMzksMTguNDM2Njg5Yy0xLjIwODk1LC0xLjM3NDQ4OSAtMi45MzE1OTksLTIuMjUwMjI5IC00LjgzODA4MSwtMi4yODE5NmMtMy42NjA0NTgsLTAuMDYwOTMgLTYuNjI4NDA4LDMuMDMyMTkgLTYuNjI4NDA4LDYuOTA4MzljMCwwLjU1MDExOSAwLjA1ODY0MSwxLjA4NjU2OSAwLjE3MTcyMSwxLjYwMTU0OWMtNS41MDg3ODksLTAuMzU3MzE5IC0xMC4zOTI5LC0zLjIyNTg5OSAtMTMuNjYxOTQ5LC03LjU0OTk1Yy0wLjU3MDU2LDEuMDM2MTQgLTAuODk3NTExLDIuMjQ3MTYgLTAuODk3NTExLDMuNTQ0NDNjMCwyLjQ1NTg0MSAxLjE3MDE3OSw0LjYzNTM4IDIuOTQ4NzE5LDUuOTIyMjcyYy0xLjA4NjUxLC0wLjA0Nzk3IC0yLjEwODU1OSwtMC4zNzY4ODEgLTMuMDAyMTksLTAuOTE2NDdjLTAuMDAwNjQ5LDAuMDI5NDg4IC0wLjAwMDY0OSwwLjA1ODk4OSAtMC4wMDA2NDksMC4wODkwMDhjMCwzLjQyOTU5IDIuMjg0Nzk5LDYuMzA2NzUxIDUuMzE3MDQsNi45NzY5ODJjLTAuNTU2MTgxLDAuMTU3NiAtMS4xNDE3NSwwLjI0MDA3OCAtMS43NDYyMzEsMC4yMzYwNjljLTAuNDI3MTA5LC0wLjAwMjgzMSAtMC44NDI0MTksLTAuMDUwMjAxIC0xLjI0NzA4LC0wLjEzNTIzOWMwLjg0MzQwMSwyLjgxMjYwNyAzLjI5MTE4OSw0Ljg2NDk5OCA2LjE5MTc3MSw0LjkzMjg1OGMtMi4yNjg0OCwxLjg4MzA2OCAtNS4xMjY0MjEsMy4wMDQ1NTkgLTguMjMyLDIuOTk4MTYxYy0wLjUzNTAxLC0wLjAwMTExIC0xLjA2MjYsLTAuMDM1Njc5IC0xLjU4MTE0LC0wLjEwMjE5MmMyLjkzMzM3OSwyLjAxMjcxMSA2LjQxNzQzOSwzLjE4NDU3IDEwLjE2MDYwOSwzLjE4NTU1MWMxMi4xOTE3ODgsMC4wMDMyMDEgMTguODU4OTcxLC0xMC42MDY2NCAxOC44NTg5NzEsLTE5LjgwOTM4YzAsLTAuMzAxOTI5IC0wLjAwNjYyMiwtMC42MDIyNDkgLTAuMDE5MjE4LC0wLjkwMTExOWMxLjI5NTA0OCwtMC45NjQ5ODEgMi40MTg3MDksLTIuMTc0ODYgMy4zMDczMzksLTMuNTU2NDMxYy0xLjE4ODYwMiwwLjUzNTgwMSAtMi40NjYyMTMsMC44OTE2NTEgLTMuODA2ODIsMS4wNDA5MmMxLjM2ODM4OSwtMC44NDIxNzEgMi40MTk1MTgsLTIuMTkwMDQxIDIuOTE0MzEsLTMuODA2Mzc5Yy0xLjI4MDgzLDAuNzc2NzMgLTIuNjk5Mjk5LDEuMzMzNzUgLTQuMjA5MjAyLDEuNjIyOTI5eiIvPgogPC9nPgo8L3N2Zz4="
                    width="40" height="40"
                    alt="Twitter"
                />
            </a>
            <a href="https://linkedin.com/company/stellar-fox-net/" target="_blank" rel="noopener noreferrer">
                <img
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgd2lkdGg9IjU2LjY5MyIgICBoZWlnaHQ9IjU2LjY5MyIgICB2ZXJzaW9uPSIxLjEiICAgaWQ9InN2ZzEzIiAgIHNvZGlwb2RpOmRvY25hbWU9ImxpbmtlZGluLnN2ZyIgICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKHVua25vd24pIj4gIDxtZXRhZGF0YSAgICAgaWQ9Im1ldGFkYXRhMTkiPiAgICA8cmRmOlJERj4gICAgICA8Y2M6V29yayAgICAgICAgIHJkZjphYm91dD0iIj4gICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PiAgICAgICAgPGRjOnR5cGUgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+ICAgICAgPC9jYzpXb3JrPiAgICA8L3JkZjpSREY+ICA8L21ldGFkYXRhPiAgPGRlZnMgICAgIGlkPSJkZWZzMTciIC8+ICA8c29kaXBvZGk6bmFtZWR2aWV3ICAgICBwYWdlY29sb3I9IiNmZmZmZmYiICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgICAgIGJvcmRlcm9wYWNpdHk9IjEiICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiICAgICBndWlkZXRvbGVyYW5jZT0iMTAiICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIgICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMjAwIiAgICAgaWQ9Im5hbWVkdmlldzE1IiAgICAgc2hvd2dyaWQ9ImZhbHNlIiAgICAgaW5rc2NhcGU6em9vbT0iMTEuNzc0MDk1IiAgICAgaW5rc2NhcGU6Y3g9IjEwLjU5Mzk1MiIgICAgIGlua3NjYXBlOmN5PSIyOS43OTMyMDQiICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIgICAgIGlua3NjYXBlOndpbmRvdy15PSIwIiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIgICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEzIiAvPiAgPGcgICAgIGlkPSJnNSI+ICAgIDx0aXRsZSAgICAgICBpZD0idGl0bGUyIj5iYWNrZ3JvdW5kPC90aXRsZT4gICAgPHJlY3QgICAgICAgZmlsbD0ibm9uZSIgICAgICAgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiAgICAgICBoZWlnaHQ9IjQwMiIgICAgICAgd2lkdGg9IjU4MiIgICAgICAgeT0iLTEiICAgICAgIHg9Ii0xIiAvPiAgPC9nPiAgPGcgICAgIGlkPSJnMTEiICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjYzMTE5MzE1LDAsMCwwLjYzMTE5MzE1LDEwLjQ1NDM4MywxMC40NTQzODQpIj4gICAgPHRpdGxlICAgICAgIGlkPSJ0aXRsZTciPkxheWVyIDE8L3RpdGxlPiAgICA8cGF0aCAgICAgICBpZD0ic3ZnXzIiICAgICAgIGQ9Im0gMzAuMDcxLDI3LjEwMSB2IC0wLjA3NyBjIC0wLjAxNiwwLjAyNiAtMC4wMzMsMC4wNTIgLTAuMDUsMC4wNzcgeiIgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4gICAgPHBhdGggICAgICAgc3Ryb2tlPSJudWxsIiAgICAgICBpZD0ic3ZnXzMiICAgICAgIGQ9Ik0gNDguNTU5MDY1LDQuNDc2NTA1IEggOC4xMzEwNTQgYyAtMS45MzUwMTYsMCAtMy41MDQzMzcsMS41MzE4ODggLTMuNTA0MzM3LDMuNDE5ODcyIHYgNDAuOTAxMjA3IGMgMCwxLjg4NzAyNCAxLjU2OTMyMSwzLjQxODkxMiAzLjUwNDMzNywzLjQxODkxMiBoIDQwLjQyODAxMSBjIDEuOTM3ODk1LDAgMy41MDcyMTYsLTEuNTMyODQ3IDMuNTA3MjE2LC0zLjQxODkxMiBWIDcuODk2Mzc3IGMgMCwtMS44ODg5NDQgLTEuNTcwMjgxLC0zLjQxOTg3MiAtMy41MDcyMTYsLTMuNDE5ODcyIHogTSAxOS4wMDU5Miw0NC40NDA5MTkgSCAxMS44NDA3OTQgViAyMi44ODQxMTIgSCAxOS4wMDU5MiBaIE0gMTUuNDIzODM3LDE5LjkzOTM1NiBoIC0wLjA0Nzk5IGMgLTIuNDAzNDEzLDAgLTMuOTU4MzM2LC0xLjY1NTcwNiAtMy45NTgzMzYsLTMuNzI0MTM4IDAsLTIuMTE0NTA0IDEuNjAyOTE1LC0zLjcyNDEzOCA0LjA1MzM1OSwtMy43MjQxMzggMi40NTE0MDQsMCAzLjk1OTI5NiwxLjYwOTYzNCA0LjAwNzI4NywzLjcyNDEzOCAwLDIuMDY4NDMyIC0xLjU1Njg0MywzLjcyNDEzOCAtNC4wNTQzMTksMy43MjQxMzggeiBNIDQ0Ljg0MzU2Niw0NC40NDA5MTkgSCAzNy42Nzg0NCBWIDMyLjkwNTY5IGMgMCwtMi44OTY3NjUgLTEuMDM2NjE2LC00Ljg3NDAxMyAtMy42MjkxMTUsLTQuODc0MDEzIC0xLjk3OTE2OCwwIC0zLjE1NzgzOCwxLjMzMzIwMyAtMy42NzcxMDYsMi42MjEyOTQgLTAuMTg5MDg2LDAuNDU5NzU4IC0wLjIzNTE1OCwxLjEwMjg0NCAtMC4yMzUxNTgsMS43NDc4NDkgdiAxMi4wMzkxMzkgaCAtNy4xNjUxMjYgYyAwLDAgMC4wOTQwNiwtMTkuNTM2MzY2IDAsLTIxLjU1NjgwNyBoIDcuMTY1MTI2IHYgMy4wNTEyOTcgYyAwLjk1MjE1MSwtMS40Njg1MzkgMi42NTQ4ODgsLTMuNTYwMDA3IDYuNDU4NjkyLC0zLjU2MDAwNyA0LjcxMzcyMiwwIDguMjQ4NzczLDMuMDgyMDEyIDguMjQ4NzczLDkuNzAzODc1IHYgMTIuMzYyNjAyIHoiICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiICAgICAgIHN0eWxlPSJmaWxsOiMwZjJlNTMiIC8+ICA8L2c+PC9zdmc+"
                    width="40" height="40"
                    alt="Linkedin"
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
        socialMediaIcons: {
            backgroundColor: theme.palette.secondary.dark,
        },
        disclaimer: {
            padding: "0.2rem 0",
            fontSize: "9px",
            opacity: "0.65",
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
