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



const TabContainer = (props) =>
    <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
    </Typography>


TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
}


const useStyles = makeStyles(() => ({
    root: {
        padding: "0 0.5rem",
        flexGrow: 0,
        backgroundColor: theme.palette.primary.main,
    },
}))


const LoginChoices = () => {
    const classes = useStyles()
    const [value, setValue] = React.useState(0)

    const handleChange = (_event, newValue) => {
        setValue(newValue)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange}>
                    <Tab icon={<img
                        className="img-logo"
                        src={ledgerhqlogo}
                        width="72px"
                        alt="LedgerHQ"
                    />}
                    />
                    <Tab label="Email/Password" />
                    <Tab label="View Only" />
                </Tabs>
            </AppBar>
            {value === 0 && <TabContainer>
                <PanelLedger />
            </TabContainer>}
            {value === 1 && <TabContainer>
                <PanelLogin />
            </TabContainer>}
            {value === 2 && <TabContainer>
                <PanelExplorer />
            </TabContainer>}
        </div>
    )
}

export default LoginChoices
