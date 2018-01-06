import React, {Component} from 'react'
import {
  Redirect
} from 'react-router-dom'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'

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
  inputStyle: {
    color: 'rgb(244,176,4)',
  },
}

export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      aexp: false,
      isLoading: false,
    }
  }

  componentDidMount(){
    new window.StellarLedger.Api(new window.StellarLedger.comm(Number.MAX_VALUE)).connect(
      function() {
        console.log('Ledger Nano S is now connected.')
        let bip32Path = "44'/148'/0'";
        window.StellarLedger.comm.create_async().then(function(comm) {
          let api = new window.StellarLedger.Api(comm)
          return api.getPublicKey_async(bip32Path).then(function (result) {
            let publicKey = result['publicKey']
            console.log(publicKey)
          }).catch(function (err) {
              console.error(err)
          })
        })
      },
      function(err) {
        console.error(err)
      }
    )
  }


  publicKeyChanged(event, value) {
    if(value.length === 56) {
      try {
        window.StellarSdk.Keypair.fromPublicKey(value)
        sessionStorage.setItem('pubKey', value);

        this.setState({
          isLoading: true
        }, (prevState) => {
          setTimeout(() => {
            this.setState({
              error: null,
              aexp: true,
              isLoading: false,
            })
          }, 1500)
        })



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
            title="Stellar Fox [Cygnus] - Alpha Preview"
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
              inputStyle={styles.inputStyle}
            />
          </MuiThemeProvider>
          <MuiThemeProvider>
            <div>
              {this.state.isLoading ? <CircularProgress/> : null}
            </div>
          </MuiThemeProvider>

          <p className="App-intro p-t-large">
            For full account functionality please sign-in with your hardware wallet.
          </p>
          <MuiThemeProvider>
            <RaisedButton backgroundColor="rgb(244,176,4)" label="Ledger Nano S" />
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
