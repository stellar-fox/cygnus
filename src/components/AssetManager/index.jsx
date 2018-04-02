import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Axios from "axios"
import hoistStatics from "hoist-non-react-statics"

import { setExchangeRate } from "../../redux/actions"
import { action as AssetManagerAction } from "../../redux/AssetManager"

import { defaultCurrencyRateUpdateTime } from "../StellarFox/env"
import { config } from "../../config"




class AssetManager extends Component {

    // ...
    static childContextTypes = {
        assetManager: PropTypes.object,
    }


    // ...
    getChildContext = () => ({ assetManager: this, })


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
    render = () => this.props.children
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        state: state.Assets,
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
            static contextTypes = {
                assetManager: PropTypes.object.isRequired,
            }

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
                    React.createElement(WrappedComponent, {
                        ...restOfTheProps,
                        ref: wrappedComponentRef,
                        assetManager: this.context.assetManager,
                    })
            )(this.props)

        },
        WrappedComponent
    )
