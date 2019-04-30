import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { action as BankAction } from "../../redux/Bank"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
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
    operationsStreamer,
    paymentsStreamer
} from "../Streamers"
import {
    setSocket,
    updateExchangeRate,
} from "../../thunks/assets"
import {
    blinkOperationStreamerLed,
    blinkPayentStreamerLed,
    streamerOperationConnected,
    streamerPaymentConnected,
    surfaceSnacky,
} from "../../thunks/main"




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
            horizon: state.StellarAccount.horizon,
            publicKey: state.LedgerHQ.publicKey,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            blinkOperationStreamerLed,
            blinkPayentStreamerLed,
            setSocket,
            streamerOperationConnected,
            streamerPaymentConnected,
            surfaceSnacky,
            toggleDrawer: BankAction.toggleDrawer,
            updateAccountTree: StellarAccountAction.updateAccountAttributes,
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
            paymentsStreamer: null,
            operationsStreamer: null,
        }


        // ...
        componentDidMount = () => {
            const fnModule = {
                updateExchangeRate: this.props.updateExchangeRate,
                setSocket: this.props.setSocket,
            }

            this.setState({
                socket: krakenSocket(this.props.currency, fnModule),
                paymentsStreamer: paymentsStreamer(
                    this.props.blinkPayentStreamerLed,
                    this.props.streamerPaymentConnected,
                    this.props.surfaceSnacky,
                    this.props.publicKey,
                    this.props.horizon,
                    this.updateAccountTree,
                ),
                operationsStreamer: operationsStreamer(
                    this.props.blinkOperationStreamerLed,
                    this.props.streamerOperationConnected,
                    this.props.surfaceSnacky,
                    this.props.publicKey,
                    this.props.horizon,
                    this.updateAccountTree,
                ),
            })
        }


        // ...
        componentWillUnmount = () => {
            this.state.socket.close()
            this.state.paymentsStreamer.call(this)
            this.props.streamerPaymentConnected(false)
            this.state.operationsStreamer.call(this)
            this.props.streamerOperationConnected(false)
            this.setState({
                socket: null,
                paymentsStreamer: null,
                operationsStreamer: null,
            })
        }


        // ...
        updateAccountTree = (account) => this.props.updateAccountTree(account)


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
