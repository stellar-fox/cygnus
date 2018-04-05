import { createReducer } from "../lib/utils"
import {
    LOCATION_CHANGE,
    routerReducer,
} from "react-router-redux"
import { swap } from "../lib/utils"




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
    pathToView: {},

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
    addStaticPaths: (paths) => ({
        type: ADD_STATIC_PATHS,
        payload: paths,
    }),

    // ...
    setCurrentView: (viewName) => ({
        type: SET_CURRENT_VIEW,
        payload: viewName,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_STELLAR_ROUTER_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),


    // add static paths, (re-)create pathToView mapping
    [ADD_STATIC_PATHS]: (state, action) => (
        (newPaths) => ({
            ...state,
            staticPaths: newPaths,
            pathToView: swap(newPaths),
        })
    )({
        ...state.staticPaths,
        ...action.payload,
    }),


    // arbitrairly set 'currentView' key in state
    [SET_CURRENT_VIEW]: (state, action) => ({
        ...state,
        currentView: action.payload,
    }),


    // intercept react-router's LOCATION_CHANGE action,
    // perform react-router's routerReducer and
    // compute new currentView value
    [LOCATION_CHANGE]: (state, action) => {
        let
            s = routerReducer(state, action),
            newView =
                s.location.pathname in s.pathToView ?
                    s.pathToView[s.location.pathname] : ""
        return {
            ...s,
            currentView:
                newView !== s.currentView ?
                    newView : s.currentView,
        }
    },

}, routerReducer)
