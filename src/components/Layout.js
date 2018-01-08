import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './Layout.css'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Welcome from './Welcome'
import Faq from './Faq'

const isAuthenticated = true

const Layout = () => (
  <div>
    <Router>
      <div>
      <Route exact path="/" component={Welcome}/>
      <Route exact path="/faq" component={Faq}/>
      {isAuthenticated ?
      <div>
        <Header/>
        <Content />
        <Footer />
      </div> : null}
      </div>
    </Router>
  </div>
)

export default Layout
