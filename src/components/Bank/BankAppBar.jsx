import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { action as BankAction } from "../../redux/Bank"
import { withStyles } from "@material-ui/core/styles"
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import BankAppBarTitle from "./BankAppBarTitle"
import BankAppBarItems from "./BankAppBarItems"
import UserMenu from "../../lib/mui-v1/UserMenu"
import krakenSocket from "../KrakenSocket"
import {
    setSocket,
    updateExchangeRate,
} from "../../thunks/assets"




// <BankAppBar> component
export default compose(
    withStyles({

        appbar: {
            backgroundColor: "#F4B004",
            "@global h1": { color: "#0F2E53" },
            "@global svg": {
                fill: ["rgba(15, 46, 83, 0.45)", "!important"],
            },
        },

        flex: { flex: 1 },

        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },

    }),
    connect(
        // map state to props.
        (state) => ({
            currency: state.Account.currency,
            currentView: state.Router.currentView,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            toggleDrawer: BankAction.toggleDrawer,
            setSocket,
            updateExchangeRate,
        }, dispatch)
    )
)(
    class extends PureComponent {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            currentView: PropTypes.string.isRequired,
            toggleDrawer: PropTypes.func.isRequired,
        }


        // ...
        state = {
            socket: null,
        }


        // ...
        componentDidMount = () => {
            const fnModule = {
                updateExchangeRate: this.props.updateExchangeRate,
                setSocket: this.props.setSocket,
            }
            this.setState({
                socket: krakenSocket(this.props.currency, fnModule),
            })
        }


        // ...
        componentWillUnmount = () => {
            this.state.socket.close()
            this.setState({socket: null})
        }


        // ...
        render = () => (
            ({ classes, currentView, toggleDrawer }) =>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.flex}
                        >
                            <div className="flex-row">
                                <BankAppBarTitle viewName={currentView} />
                                <BankAppBarItems />
                            </div>
                        </Typography>
                        <UserMenu />
                    </Toolbar>
                </AppBar>
        )(this.props)

    }
)
