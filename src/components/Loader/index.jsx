/**
 * Cygnus.
 *
 * Full-screen loader.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




import React from "react"
import PropTypes from "prop-types"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    Fade,
    Typography,
} from "@material-ui/core"
import cygnusYellow from "../StellarFox/static/cygnusYellow.svg"




/**
 * `<Loader>` component.
 *
 * @function Loader
 * @param {Object} props
 * @returns {React.ReactElement}
 */
const Loader = ({
    classes,
    infoMessage,
}) =>
    <Fade in>
        <div>
            <main className={classes.layout}>
                <div className={classes.rect}>
                    <img
                        style={{ opacity: "0.9", marginBottom: "0.5rem" }}
                        src={cygnusYellow}
                        width="60px"
                        alt="Cygnus"
                    />
                    <Typography className={classes.infoMessage}>
                        {infoMessage}
                    </Typography>
                </div>
            </main>
        </div>
    </Fade>




// ...
Loader.propTypes = {
    classes: PropTypes.object.isRequired,
    infoMessage: PropTypes.string.isRequired,
}




// ...
export default func.compose(
    withStyles((theme) => ({
        circle: {
            color: theme.palette.primary.main,
        },
        circularProgress: {
            opacity: "0.95",
        },
        layout: {
            position: "absolute",
            width: theme.spacing(32),
            height: theme.spacing(16),
            left: "50%",
            top: "50%",
            marginLeft: -1 * theme.spacing(16),
            marginTop: -1 * theme.spacing(8),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
        },

        rect: { padding: 2 * theme.spacing(1) },

        infoMessage: {
            textAlign: "center",
            color: theme.palette.secondary.main,
        },
    })),
)(Loader)
