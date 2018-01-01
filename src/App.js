import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

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
};

class App extends Component {

  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <AppBar
            title="Stellar Fox"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            className="App-navbar"
          />
        </MuiThemeProvider>
        <div className="App-content">
          <header className="App-header">
            <h1 className="App-title">Welcome to Stellar Fox</h1>
          </header>
          <MuiThemeProvider>
          <TextField
            floatingLabelText="Stellar Public Key"
            underlineStyle={styles.underlineStyle}
            underlineFocusStyle={styles.underlineStyle}
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
          />
          </MuiThemeProvider>
          <p className="App-intro">
            For full account functionality please login with your hardware wallet:
          </p>
          <MuiThemeProvider>
            <RaisedButton label="Ledger Nano S" />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default App;
