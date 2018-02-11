import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import {
    setAccountRegistered,
} from '../../actions/index'


class RegisterAccountStepper extends Component {
    state = {
        finished: false,
        stepIndex: 0,
        email: '',
    };

    handleNext = () => {
        const { stepIndex } = this.state
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 1,
        })
        if (stepIndex >= 1) {
            this.props.onComplete('DONE')
            this.props.setAccountRegistered(true)
        }
    };

    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };

    updateEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    renderStepActions(step) {
        const { stepIndex } = this.state;

        return (
            <div style={{ margin: '12px 0' }}>
                <RaisedButton
                    label="Next"
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    backgroundColor="rgb(15,46,83)"
                    labelColor="rgb(244,176,4)"
                    onClick={this.handleNext}
                    style={{ marginRight: 12 }}
                />
                {step > 0 && (
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        labelStyle={{ color: "rgb(15,46,83)" }}
                        onClick={this.handlePrev}
                    />
                )}
            </div>
        );
    }

    render() {
        const { finished, stepIndex } = this.state;
        const styles = {
            stepLabel: {
                fontSize: '1rem',
            },
            errorStyle: {
                color: '#912d35',
            },
            underlineStyle: {
                borderColor: 'rgba(15,46,83,0.6)',
            },
            floatingLabelStyle: {
                color: 'rgba(15,46,83,0.5)',
            },
            floatingLabelFocusStyle: {
                color: 'rgba(15,46,83,0.35)',
            },
            inputStyle: {
                color: 'rgba(15,46,83,0.8)',
            },
        }
        return (
            <div style={{ maxWidth: 580, maxHeight: 400, margin: 'auto' }}>
                <Stepper connector={null} activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">perm_identity</i>}>
                            Choose Email and Password
                        </StepLabel>
                        <StepContent style={{ borderLeft: '1px solid rgba(15,46,83,0.2)' }}>
                            <div>
                                <TextField
                                    type="email"
                                    floatingLabelText="Email"
                                    errorStyle={styles.errorStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    inputStyle={styles.inputStyle}
                                    onChange={this.updateEmail.bind(this)}
                                />
                            </div>
                            <div>
                                <TextField
                                    type="password"
                                    floatingLabelText="Password"
                                    errorStyle={styles.errorStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    inputStyle={styles.inputStyle}

                                />
                            </div>
                            <div>
                                <TextField
                                    type="password"
                                    floatingLabelText="Confirm Password"
                                    errorStyle={styles.errorStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    inputStyle={styles.inputStyle}
                                />
                            </div>
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">fingerprint</i>}>Confirmation</StepLabel>
                        <StepContent style={{ borderLeft: 'none' }}>
                            <p>
                                The following email will be associate with this account:
                            </p>
                            <p className="bigger-emphasize">
                                {this.state.email}
                            </p>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                </Stepper>
                {finished && (
                    <p style={{ margin: '20px 0', textAlign: 'center' }}>
                        Your account has been setup.
                    </p>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        ui: state.ui,
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setAccountRegistered,
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(RegisterAccountStepper)