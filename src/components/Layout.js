import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import './Layout.css'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'

const Layout = () => (
  <div>
    <Router>
      <div>
        <Header/>
        <Content />
        <Footer />
      </div>
    </Router>
  </div>
)

export default Layout
