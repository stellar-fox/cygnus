import {
    createReducer,
    string,
    struct,
} from "@xcmats/js-toolbox"

import {
    LOCATION_CHANGE,
    routerReducer,
} from "react-router-redux"
import { StaticRouter } from "../components/StellarRouter"




// <StellarRouter> component state
const initState = {

    currentView: string.empty(),
    location: {
        pathname: string.empty(),
        search: string.empty(),
        hash: string.empty(),
        key: string.empty(),
    },
    staticPaths: {},
    pathToView: {},

}




// ...
export const SET_STATE = "@StellarRouter/SET_STATE"
export const ADD_STATIC_PATHS = "@StellarRouter/ADD_STATIC_PATHS"
export const SET_CURRENT_VIEW = "@StellarRouter/SET_CURRENT_VIEW"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
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


    // ...
    getStatics: () =>
        (_dispatch, getState) => {
            let { staticPaths, pathToView } = getState().Router
            return { staticPaths, pathToView }
        },

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // add static paths, (re-)create 'pathToView' mapping
    // and compute new 'currentView' value
    [ADD_STATIC_PATHS]: (state, action) => {
        let
            newPaths = {
                ...state.staticPaths,
                ...action.payload,
            },
            newPathToView = struct.swap(newPaths),
            newView = StaticRouter.getView(
                state.location.pathname, newPathToView
            )
        return {
            ...state,
            staticPaths: newPaths,
            pathToView: newPathToView,
            currentView:
                newView !== state.currentView ?
                    newView : state.currentView,
        }
    },


    // arbitrairly set 'currentView' key in state
    [SET_CURRENT_VIEW]: (state, action) => ({
        ...state,
        currentView: action.payload,
    }),


    // intercept react-router's 'LOCATION_CHANGE' action,
    // perform react-router's 'routerReducer'
    // and compute new 'currentView' value
    [LOCATION_CHANGE]: (state, action) => {
        let
            s = routerReducer(state, action),
            newView = StaticRouter.getView(
                s.location.pathname, s.pathToView
            )
        return {
            ...s,
            currentView:
                newView !== s.currentView ?
                    newView : s.currentView,
        }
    },

}, routerReducer)
