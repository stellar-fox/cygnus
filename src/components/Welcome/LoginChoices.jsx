import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import {
    AppBar,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core"
import theme from "../../lib/sfox-mui-theme"
import PanelExplorer from "./PanelExplorer"
import PanelLedger from "./PanelLedger"
import PanelLogin from "./PanelLogin"
import ledgerhqlogo from "./static/ledgerhqlogo.svg"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"




const TabContainer = (props) =>
    <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
    </Typography>


TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
}


const useStyles = makeStyles(() => ({
    root: {  
        flexGrow: 1,
        backgroundColor: theme.palette.primary.light,
        borderRadius: "3px",
        maxWidth: "485px",
        minWidth: "485px",
    },

    rootMobile: {
        flexGrow: 2,
        margin: "0  0.5rem",
        backgroundColor: theme.palette.primary.light,
        borderRadius: "3px",
    },

    label: {
        fontSize: "0.8rem",
    },

    labelSmall: {
        fontSize: "0.65rem",
        padding: "0 0.5rem",
    },
}))


const LoginChoices = () => {
    const classes = useStyles(),
        [value, setValue] = React.useState(0),
        isMobile = useMediaQuery("(max-width:960px)")

    const handleChange = (_event, newValue) => {
        setValue(newValue)
    }

    return (
        <div style={{ paddingBottom: "3rem" }} className="flex-box-col content-centered items-centered">
            <div className="flex-box-col content-centered items-centered m-t-large m-b-large">
                <Typography variant="h4" color="secondary">
                    Log in and bank!
                </Typography>
                <Typography variant="h5" color="secondary">
                    Plase choose one of available login methods:
                </Typography>
            </div>
            <div className={isMobile ? classes.rootMobile : classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange}>
                        <Tab
                            classes={{
                                root: isMobile ? classes.labelSmall :
                                    classes.label,
                            }}
                            label="Email/Password"
                        />
                        <Tab style={{ padding: "0 0.5rem" }} icon={<img
                            className="img-logo"
                            src={ledgerhqlogo}
                            width="72px"
                            alt="LedgerHQ"
                        />}
                        />
                        <Tab
                            classes={{
                                root: isMobile ? classes.labelSmall :
                                    classes.label,
                            }}
                            label="View Only"
                        />
                    </Tabs>
                </AppBar>
                {value === 0 && <TabContainer>
                    <PanelLogin />
                </TabContainer>}
                {value === 1 && <TabContainer>
                    <PanelLedger />
                </TabContainer>}
                {value === 2 && <TabContainer>
                    <PanelExplorer />
                </TabContainer>}
            </div>
        </div>
    )
}

export default LoginChoices
