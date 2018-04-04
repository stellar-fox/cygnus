import { createReducer } from "../lib/utils"
import { routerReducer } from "react-router-redux"




// <StellarRouter> component state
const initState = {

    currentView: "",
    location: {
        pathname: "",
        search: "",
        hash: "",
        key: "",
    },
    staticPaths: {},

}




// ...
export const SET_STELLAR_ROUTER_STATE = "SET_STELLAR_ROUTER_STATE"
export const ADD_STATIC_PATHS = "ADD_STATIC_PATHS"
export const SET_CURRENT_VIEW = "SET_CURRENT_VIEW"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STELLAR_ROUTER_STATE,
        payload: state,
    }),

    // ...
    addStaticPaths: (staticPaths) => ({
        type: ADD_STATIC_PATHS,
        payload: staticPaths,
    }),

    // ...
    setCurrentView: (viewName) => ({
        type: SET_CURRENT_VIEW,
        payload: viewName,
    }),

}




// ...
export const reducer = createReducer(initState)({

    [SET_STELLAR_ROUTER_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),

    [ADD_STATIC_PATHS]: (state, action) => ({
        ...state,
        staticPaths: {
            ...state.staticPaths,
            ...action.payload,
        },
    }),

    [SET_CURRENT_VIEW]: (state, action) => ({
        ...state,
        currentView: action.payload,
    }),

}, routerReducer)
