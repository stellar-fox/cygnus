import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout((cb) => {

    }, 500)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout((cb) => {

    }, 500)
  }
}

export const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props}/> : <Redirect to='/' />
  )}/>
)
