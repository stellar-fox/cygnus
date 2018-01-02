import React, {Component} from 'react'
import {
  Redirect
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new'
import Paper from 'material-ui/Paper'
import './AccountExplorer.css'

export default class AccountExplorer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedOut: false,
    }
  }

  handleClick() {
    sessionStorage.clear()
    this.setState({
      loggedOut: true,
    })
  }

  render() {
    return (
      <div>
        {this.state.loggedOut ? <Redirect to={{
          pathname: "/"
        }}/> : null}
        <MuiThemeProvider>
          <AppBar
            title="Stellar Fox"
            iconElementRight={
              <IconButton onClick={this.handleClick.bind(this)}>
                <PowerSettingsNew />
              </IconButton>
            }
            className="App-navbar"
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Paper className="paper" zDepth={1}>
            <p>{sessionStorage.getItem('pubKey')}</p>
          </Paper>
        </MuiThemeProvider>
      </div>
    )
  }
}
