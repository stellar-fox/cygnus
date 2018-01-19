import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Input from '../frontend/input/Input'
import SnackBar from '../frontend/snackbar/SnackBar'
import RaisedButton from 'material-ui/RaisedButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog'
import Toggle from 'material-ui/Toggle';
import MD5 from '../lib/md5'
import './Account.css'
import {
  showAlert,
  hideAlert,
  setAccountTab,
  setCurrency,
} from '../actions/index'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  tab: {
    backgroundColor: '#2e5077',
    borderRadius: '3px',
    color: 'rgba(244,176,4,0.9)',
  },
  inkBar: {
    backgroundColor: 'rgba(244,176,4,0.8)',
  },
  container: {
    backgroundColor: '#2e5077',
    borderRadius: '3px',
  },
  radioButton: {
    label: {
      color: 'rgba(244,176,4,0.9)',
    },
    icon: {
      fill: 'rgba(244,176,4,1)',
    },
  },
  toggleSwitch: {
    thumbOff: {
      backgroundColor: '#2e5077',
    },
    trackOff: {
      backgroundColor: '#2e5077',
    },
    thumbSwitched: {
      backgroundColor: 'rgb(244,176,4)',
    },
    trackSwitched: {
      backgroundColor: 'rgb(244,176,4)',
    },
    labelStyle: {
      color: 'rgb(244,176,4)',
    },
  },
}

const emailValidatorRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNameDisplay: '',
      lastNameDisplay: '',
      emailDisplay: '',
      paymentAddressDisplay: '',
      gravatarPath: '/img/gravatar.jpg',
      sbAccountDiscoverable: false,
      sbCurrency: false,
      sbMultisig: false,
      sb2FA: false,
      currency: '',
    }
  }

  handleCurrencyChange = (event) => {
    this.props.setCurrency(event.target.value)
    this.setState({
      currency: event.target.parentElement.innerText
    })
    this.setState((prevState) => {
      return {sbCurrency: true};
    })
  }

  handleCurrencyChangeSnackBarClose = () => {
    this.setState({
      sbCurrency: false
    })
  }

  handleAccountDiscoverableSnackBarClose = () => {
    this.setState({
      sbAccountDiscoverable: false
    })
  }

  handleMultisigSnackBarClose = () => {
    this.setState({
      sbMultisig: false
    })
  }

  handle2FASnackBarClose = () => {
    this.setState({
      sb2FA: false
    })
  }

  handleAccountDiscoverableToggle = (event, isInputChecked) => {
    if (isInputChecked === true) {
      this.setState({
        sbAccountDiscoverable: true
      })
    }
  }

  handleMultisigToggle = (event, isInputChecked) => {
    if (isInputChecked === true) {
      this.setState({
        sbMultisig: true
      })
    }
  }

  handle2FAToggle = (event, isInputChecked) => {
    if (isInputChecked === true) {
      this.setState({
        sb2FA: true
      })
    }
  }

  handleFirstNameChange = (event) => {
    this.setState({
      firstNameDisplay: event.target.value
    })
  }

  handleLastNameChange = (event) => {
    this.setState({
      lastNameDisplay: event.target.value
    })
  }

  handleEmailChange = (event) => {
    if (emailValidatorRegex.test(event.target.value) === true) {
      this.setState({
        gravatarPath: (
          'https://www.gravatar.com/avatar/' + MD5(event.target.value) +
          '?s=96'
        )
      })
    }
    this.setState({
      emailDisplay: event.target.value
    })
  }

  handlePaymentAddressChange = (event) => {
    this.setState({
      paymentAddressDisplay: event.target.value
    })
  }

  handleProfileUpdate = (event) => {
    console.log('Update Pressed')
  }

  handleChange = (value) => {
    this.props.setAccountTab(value)
  }

  handleOpen = () => {
    this.props.showAlert()
  }

  handleClose = () => {
    this.props.hideAlert()
  }

  render() {
    const actions = [
      <RaisedButton
        backgroundColor="rgb(15,46,83)"
        labelColor="rgb(244,176,4)"
        label="OK"
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ]
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <Dialog
              title="Not Yet Implemented"
              actions={actions}
              modal={false}
              open={this.props.modal.isShowing}
              onRequestClose={this.handleClose}
              paperClassName="modal-body"
              titleClassName="modal-title"
            >
              Pardon the mess. We are working hard to bring you this feature very
              soon. Please check back in a while as the feature implementation
              is being continuously deployed.
            </Dialog>
          </div>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Tabs
            tabItemContainerStyle={styles.container}
            inkBarStyle={styles.inkBar}
            value={this.props.tabBar.tabSelected}
            onChange={this.handleChange}
            className="tabs-container"
          >
            <Tab style={styles.tab} label="Profile" value="1">
              <div className="tab-content">
                <div className="flex-row">
                  <div>
                    <h2 style={styles.headline}>Account Profile</h2>
                    <div className="account-title">
                      Fill out your profile details.
                    </div>
                    <div className="account-subtitle">
                      Only your payment address is visible to public.
                      The details of your account profile contribute to KYC/AML
                      compliance.
                    </div>
                  </div>
                  <div className="gravatar">
                    <figure>
                      <img className="image"
                        src={this.state.gravatarPath}
                        alt="Gravatar"
                      />
                    </figure>
                  </div>
                </div>
                <div className="flex-centered">
                  <div className="p-b">
                    <Input
                      label="First Name"
                      inputType="text"
                      maxLength="100"
                      autoComplete="off"
                      handleChange={this.handleFirstNameChange.bind(this)}
                      subLabel={
                        "First Name: " + this.state.firstNameDisplay
                      }/>
                  </div>
                  <div className="p-t p-b">
                    <Input
                      label="Last Name"
                      inputType="text"
                      maxLength="100"
                      autoComplete="off"
                      handleChange={this.handleLastNameChange.bind(this)}
                      subLabel={
                        "Last Name: " + this.state.lastNameDisplay
                      }/>
                  </div>
                  <div className="p-t p-b">
                    <Input
                      label="Email"
                      inputType="text"
                      maxLength="100"
                      autoComplete="off"
                      handleChange={this.handleEmailChange.bind(this)}
                      subLabel={
                        "Email: " + this.state.emailDisplay
                      }/>
                  </div>
                  <div className="p-t p-b">
                    <Input
                      label="Payment Address Alias"
                      inputType="text"
                      maxLength="100"
                      autoComplete="off"
                      handleChange={this.handlePaymentAddressChange.bind(this)}
                      subLabel={
                        "Payment Address: " +
                        this.state.paymentAddressDisplay +
                        (this.state.paymentAddressDisplay === '' ?
                          "" : "*stellarfox.net")
                      }/>
                  </div>
                </div>
                <div className="p-t">
                  <RaisedButton
                    backgroundColor="rgb(244,176,4)"
                    labelColor="rgb(15,46,83)"
                    label="Update"
                    onClick={this.handleOpen.bind(this)}
                  />
                </div>
              </div>
            </Tab>
            <Tab style={styles.tab} label="Settings" value="2">
              <div>
                <h2 style={styles.headline}>Account Settings</h2>
                <div className="account-title">
                  Adjust settings for your account.
                </div>
                <div className="account-subtitle">
                  General account related settings. This configuration specifies
                  how the account related views are displayed to the user.
                </div>

                <div className="p-t p-b"></div>
                <div className="account-title p-t">
                  Display Currency:
                </div>
                <div className="account-subtitle">
                  Choose the currency you want to use in your account.
                </div>
                <MuiThemeProvider>
                  <div className="flex-start">
                  <SnackBar
                    open={this.state.sbCurrency}
                    message={"Currency set to " + this.state.currency}
                    onRequestClose={this.handleCurrencyChangeSnackBarClose.bind(this)}
                  />
                    <RadioButtonGroup
                      onChange={this.handleCurrencyChange.bind(this)}
                      className="account-radio-group"
                      name="currencySelect"
                      defaultSelected={this.props.currency.default}>
                      <RadioButton
                        className="p-b-small"
                        value="eur"
                        label="Euro [EUR]"
                        labelStyle={styles.radioButton.label}
                        iconStyle={styles.radioButton.icon}
                      />
                      <RadioButton
                        className="p-b-small"
                        value="usd"
                        label="U.S. Dollar [USD]"
                        labelStyle={styles.radioButton.label}
                        iconStyle={styles.radioButton.icon}
                      />
                      <RadioButton
                        value="aud"
                        label="Australian Dollar [AUD]"
                        labelStyle={styles.radioButton.label}
                        iconStyle={styles.radioButton.icon}
                      />
                    </RadioButtonGroup>
                  </div>
                </MuiThemeProvider>

                <div className="p-t p-b"></div>
                <div className="flex-row outline">
                  <div>
                    <div className="account-title">
                      Make Account Discoverable
                    </div>
                    <div className="account-subtitle">
                      Your account number will be publicly discoverable and can
                      be found by others via your payment address.
                    </div>
                  </div>
                  <div>
                    <MuiThemeProvider>
                      <div>
                        <SnackBar
                          open={this.state.sbAccountDiscoverable}
                          message="Account is now discoverable."
                          onRequestClose={this.handleAccountDiscoverableSnackBarClose.bind(this)}
                        />
                        <Toggle
                          onToggle={this.handleAccountDiscoverableToggle.bind(this)}
                          labelPosition="right"
                          thumbStyle={styles.toggleSwitch.thumbOff}
                          trackStyle={styles.toggleSwitch.trackOff}
                          thumbSwitchedStyle={styles.toggleSwitch.thumbSwitched}
                          trackSwitchedStyle={styles.toggleSwitch.trackSwitched}
                          labelStyle={styles.toggleSwitch.labelStyle}
                        />
                      </div>
                    </MuiThemeProvider>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab style={styles.tab} label="Security" value="3">
              <div>
                <h2 style={styles.headline}>Account Security</h2>
                <div className="account-title">
                  Adjust security settings for your account.
                </div>
                <div className="account-subtitle">
                  Protect your account with additional security options.
                </div>
                <div className="p-t p-b"></div>
                <div className="flex-row outline">
                  <div>
                    <div className="account-title">
                      Enable two-factor authentication. (2FA)
                    </div>
                    <div className="account-subtitle">
                      Confirm your account transations with second
                      authentication factor.
                    </div>
                  </div>
                  <div>
                    <MuiThemeProvider>
                      <div>
                        <SnackBar
                          open={this.state.sb2FA}
                          message={"Two factor authentication is now enabled."}
                          onRequestClose={this.handle2FASnackBarClose.bind(this)}
                        />
                        <Toggle
                          onToggle={this.handle2FAToggle.bind(this)}
                          labelPosition="right"
                          thumbStyle={styles.toggleSwitch.thumbOff}
                          trackStyle={styles.toggleSwitch.trackOff}
                          thumbSwitchedStyle={styles.toggleSwitch.thumbSwitched}
                          trackSwitchedStyle={styles.toggleSwitch.trackSwitched}
                          labelStyle={styles.toggleSwitch.labelStyle}
                        />
                      </div>
                    </MuiThemeProvider>
                  </div>
                </div>

                <div className="p-t p-b"></div>
                <div className="flex-row outline">
                  <div>
                    <div className="account-title">
                      Add co-signers to your account. (Multisignature Verification)
                    </div>
                    <div className="account-subtitle">
                      Multisignature account requires two or more signatures on
                      every transaction.
                    </div>
                  </div>
                  <div>
                    <MuiThemeProvider>
                      <div>
                        <SnackBar
                          open={this.state.sbMultisig}
                          message={"Account set to multisig."}
                          onRequestClose={this.handleMultisigSnackBarClose.bind(this)}
                        />
                        <Toggle
                          onToggle={this.handleMultisigToggle.bind(this)}
                          labelPosition="right"
                          thumbStyle={styles.toggleSwitch.thumbOff}
                          trackStyle={styles.toggleSwitch.trackOff}
                          thumbSwitchedStyle={styles.toggleSwitch.thumbSwitched}
                          trackSwitchedStyle={styles.toggleSwitch.trackSwitched}
                          labelStyle={styles.toggleSwitch.labelStyle}
                        />
                      </div>
                    </MuiThemeProvider>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
    tabBar: state.tabBar,
    currency: state.currency,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    showAlert,
    hideAlert,
    setAccountTab,
    setCurrency
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Account)
