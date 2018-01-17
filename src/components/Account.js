import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Input from '../frontend/input/Input'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import './Account.css'
import {
  showAlert,
  hideAlert,
  setAccountTab,
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
}

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNameDisplay: '',
      lastNameDisplay: '',
      emailDisplay: '',
      paymentAddressDisplay: '',
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
                    <div className="title">
                      Fill out your profile details.
                    </div>
                    <div className="subtitle">
                      Only your payment address is visible to public.
                      The details of your account profile contribute to KYC/AML
                      compliance.
                    </div>
                  </div>
                  <div className="gravatar">
                    <figure>
                      <img className="image"
                        src="/img/gravatar.jpg"
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
                        "First Name Entered: " + this.state.firstNameDisplay
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
                        "Last Name Entered: " + this.state.lastNameDisplay
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
                        "Email Entered: " + this.state.emailDisplay
                      }/>
                  </div>
                  <div className="p-t p-b">
                    <Input
                      label="Payment Address"
                      inputType="text"
                      maxLength="100"
                      autoComplete="off"
                      handleChange={this.handlePaymentAddressChange.bind(this)}
                      subLabel={
                        "Payment Address Entered: " +
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
                <p>
                  Adjust settings for your account.
                </p>
              </div>
            </Tab>
            <Tab style={styles.tab} label="Security" value="3">
              <div>
                <h2 style={styles.headline}>Account Security</h2>
                <p>
                  Set your security here.
                </p>
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
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    showAlert,
    hideAlert,
    setAccountTab,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Account)
