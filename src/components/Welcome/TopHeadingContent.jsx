import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import {
    Link as MuiLink,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { Link } from "react-router-dom"
import sflogo from "../StellarFox/static/sf.logo.png"
import { withStyles } from "@material-ui/core/styles"




/**
 * Cygnus.
 *
 * Renders top heading content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<TopHeadingContent>` component.
 *
 * @function TopHeadingContent
 * @returns {React.ReactElement}
 */
const TopHeadingContent = ({ classes }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <div className="flex-box-row space-between">
        <div className={isMobile ? "flex-box-col" : "flex-box-row hero"}>
            <MuiLink component={Link} to="/">
                <img
                    style={{ opacity: "0.8", margin: "0 2rem 0 1rem", borderRadius: "2px"}}
                    src={sflogo}
                    width="40px"
                    height="40px"
                    alt="Stellar Fox"
                />
            </MuiLink>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                <MuiLink classes={{ underlineNone: classes.underline }}
                    component={Link} to="/why" underline="none" color="secondary"
                >
                    Why Cygnus
                </MuiLink>
            </Typography>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                <MuiLink classes={{ underlineNone: classes.underline }}
                    component={Link} to="/features" underline="none" color="secondary"
                >
                    Features
                </MuiLink>
            </Typography>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                <MuiLink classes={{ underlineNone: classes.underline }}
                    component={Link} to="/prices" underline="none" color="secondary"
                >
                    Prices
                </MuiLink>
            </Typography>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                <MuiLink classes={{ underlineNone: classes.underline }}
                    component={Link} to="/support" underline="none" color="secondary"
                >
                    Support
                </MuiLink>
            </Typography>
        </div>
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
            <div className="hero-no-shadow">
                <Button
                    size="small"
                    color="primaryLight"
                    component={Link}
                    to="/login"
                >
                    Sign In
                </Button>
            </div>
            <div className="hero-no-shadow">
                <Button
                    size="small"
                    color="secondary"
                    component={Link}
                    to="/signup"
                >
                    Create Account
                </Button>
            </div>
        </div>
    </div>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        underline: {
            borderBottom: "0px solid",
            paddingBottom: "0px",
            transitionProperty: "border-bottom-color padding-bottom",
            transitionDuration: "0.13s",
            transitionTimingFunction: "ease-in-out",
            "&:hover": {
                borderBottom: "2px solid",
                paddingBottom: "3px",
                borderBottomColor: theme.palette.secondary.light,
            },
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(TopHeadingContent)
