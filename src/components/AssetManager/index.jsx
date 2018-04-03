import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Axios from "axios"
import hoistStatics from "hoist-non-react-statics"
import { BigNumber } from "bignumber.js"

import { setExchangeRate } from "../../redux/actions"
import { action as AssetManagerAction } from "../../redux/AssetManager"

import { defaultCurrencyRateUpdateTime } from "../StellarFox/env"
import { config } from "../../config"




// ...
const AssetManagerContext = React.createContext({})




// <AssetManager> component
class AssetManager extends Component {

    // ...
    rateStale = (currency) => (
        !this.props.state[currency]  ||
        this.props.state[currency].lastFetch +
            defaultCurrencyRateUpdateTime < Date.now()
    )


    // ...
    updateExchangeRate = (currency) => {
        if (this.rateStale(currency)) {
            Axios.get(`${config.api}/ticker/latest/${currency}`)
                .then((response) => {
                    this.props.setState({
                        [currency]: {
                            rate: response.data.data[`price_${currency}`],
                            lastFetch: Date.now(),
                        },
                    })
                })
                .catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }
    }


    // ...
    getAccountNativeBalance = (account) =>
        account.balances.find(obj => obj.asset_type === "native").balance


    // ...
    convertToNative = (amount) => {
        BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4, })
        return this.props.state[this.props.Account.currency] ?
            new BigNumber(amount).dividedBy(
                this.props.state[this.props.Account.currency].rate
            ).toString() : "0.0000000"
    }


    // ...
    convertToAsset = (amount) => {
        BigNumber.config({ DECIMAL_PLACES: 4, ROUNDING_MODE: 4, })
        return this.props.state[this.props.Account.currency] ?
            new BigNumber(amount).multipliedBy(
                this.props.state[this.props.Account.currency].rate
            ).toFixed(2) : "0.00"
    }


    // ...
    getAssetDescription = (currency) => (
        (c) => c[currency]
    )({
        eur: "European Union Euro",
        usd: "United States Dollar",
        aud: "Australian Dollar",
        nzd: "New Zealand Dollar",
        thb: "Thai Baht",
        pln: "Polish Złoty",
    })


    // ...
    render = () =>
        <AssetManagerContext.Provider value={this}>
            { this.props.children }
        </AssetManagerContext.Provider>
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        state: state.Assets,
        Account: state.Account,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setState: AssetManagerAction.setState,
        setExchangeRate,
    }, dispatch)
)(AssetManager)




// <withAssetManager(...)> HOC
export const withAssetManager = (WrappedComponent) =>
    hoistStatics(
        class WithAssetManager extends Component {

            // ...
            static propTypes = {
                wrappedComponentRef: PropTypes.func,
            }

            // ...
            static displayName =
                `withAssetManager(${
                    WrappedComponent.displayName || WrappedComponent.name
                })`

            // ...
            static WrappedComponent = WrappedComponent

            // ...
            render = () => (
                ({ wrappedComponentRef, ...restOfTheProps }) =>
                    <AssetManagerContext.Consumer>
                        {
                            (assetManager) =>
                                React.createElement(WrappedComponent, {
                                    ...restOfTheProps,
                                    ref: wrappedComponentRef,
                                    assetManager,
                                })
                        }
                    </AssetManagerContext.Consumer>
            )(this.props)

        },
        WrappedComponent
    )
