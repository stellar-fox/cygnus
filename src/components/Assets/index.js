import { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { setExchangeRate } from "../../redux/actions"
import Axios from "axios"
import { config } from "../../config"


// // ...
// export const exchangeRateStale = (currency) => (
//     !this.props.accountInfo.rates ||
//     !this.props.accountInfo.rates[currency] ||
//     this.props.accountInfo.rates[currency].lastFetch + 300000 < Date.now()
// )


class Assets extends Component {

    // ...
    exchangeRateStale = (currency) => (
        !this.props.accountInfo.rates ||
        !this.props.accountInfo.rates[currency] ||
        this.props.accountInfo.rates[currency].lastFetch + 300000 < Date.now()
    )

    updateExchangeRate = (currency) => {
        if (this.exchangeRateStale(currency)) {
            Axios.get(`${config.api}/ticker/latest/${currency}`)
                .then((response) => {
                    this.props.setExchangeRate({
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


}

// ...
export default connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,

    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setExchangeRate,
    }, dispatch)
)(Assets)