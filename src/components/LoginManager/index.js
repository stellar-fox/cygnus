import { Component, } from "react"
import { ActionConstants } from "../../actions"
import { authenticate } from "./api"

export default class LoginManager extends Component {


    // ...
    componentDidMount = () => window.lm = this


    // ...
    attemptLogin = (email, password) => {
        const that = this
        return async function _attemptLogin () {
            that.props.changeLoginState({
                loginState: ActionConstants.LOGGING_IN,
                publicKey: null,
                userId: null,
                token: null,
            })
            const auth = await authenticate(email, password)

            // NOT AUTHENTICATED
            if (!auth.authenticated) {
                that.props.changeLoginState({
                    loginState: ActionConstants.LOGGING_IN,
                    publicKey: null,
                    userId: null,
                    token: null,
                })
            } else {
                that.props.changeLoginState({
                    loginState: ActionConstants.LOGGED_IN,
                    publicKey: auth.pubkey,
                    userId: auth.user_id,
                    token: auth.token,
                })
            }
            return auth
        }()
    }


    // ...
    render () {
        return null
    }
}

