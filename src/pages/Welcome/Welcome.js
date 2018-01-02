import React, {Component} from 'react'
import {
  Redirect
} from 'react-router-dom'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'

const styles = {
  errorStyle: {
    color: '#757575',
  },
  underlineStyle: {
    borderColor: '#FFC107',
  },
  floatingLabelStyle: {
    color: '#CFD8DC',
  },
  floatingLabelFocusStyle: {
    color: '#455A64',
  },
}

export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      aexp: false,
    }
  }

  publicKeyChanged(event, value) {
    if(value.length === 56) {
      try {
        window.StellarBase.Keypair.fromPublicKey(value)
        sessionStorage.setItem('pubKey', value);
        setTimeout(() => {
          this.setState({
            error: null,
            aexp: true,
          })
        }, 500)

      } catch (e) {
        this.setState({
          error: e.message
        })
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.aexp ? <Redirect to={{
          pathname: "/aexp",
          pubKey: this.state.pubKey,
        }}/> : null}
        <MuiThemeProvider>
          <AppBar
            title="Stellar Fox"
            className="App-navbar"
          />
        </MuiThemeProvider>
        <div className="App-content">
          <header className="App-header">
            <h1 className="App-title">Welcome to Stellar Fox</h1>
          </header>
          <div className="App-intro">
            To access account explorer enter your Stellar <b>Public</b> Key
          </div>
          <MuiThemeProvider>
            <TextField
              onChange={this.publicKeyChanged.bind(this)}
              floatingLabelText="Stellar Public Key"
              errorText={this.state.error}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            />
          </MuiThemeProvider>
          <p className="App-intro">
            For full account functionality please sign-in with your hardware wallet:
          </p>
          <MuiThemeProvider>
            <RaisedButton label="Ledger Nano S" />
          </MuiThemeProvider>
          <div className="App-instructions">
            Connect your Ledger Nano S hardware wallet. Choose Stellar wallet on
            the device and click the Hardware Login button above.
          </div>
        </div>
      </div>
    )
  }
}
