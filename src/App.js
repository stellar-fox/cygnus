import React, { Component } from "react"
import { createStore } from "redux"
import reducers from "./reducers"
import { Provider } from "react-redux"
import Layout from "./components/Layout"

const store = createStore(reducers)

class App extends Component {
    render () {
        return (
            <Provider store={store}>
                <Layout />
            </Provider>
        )
    }
}

export default App
