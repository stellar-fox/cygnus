import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    Card,
    CardActions,
} from "material-ui/Card"
import {
    IconButton,
    Typography,
} from "@material-ui/core"
import ClearIcon from "@material-ui/icons/ClearRounded"
import { Link } from "react-router-dom"
import { action as BankActions } from "../../redux/Bank"




// <RegisterCard> component
class RegisterCard extends Component {

    dismiss = () => this.props.toggleSignupHint(false)

    // ...
    render = () =>
        <Card className="welcome-card">
            <CardActions>
                <div className="flex-box-row space-between items-centered">
                    <Typography
                        style={{ fontSize: "0.9rem", paddingLeft: "0.5rem", fontWeight: 600 }}
                        color="secondary"
                    >
                        Consider <Link target="_blank"
                            rel="noopener noreferrer" to="/signup"
                        >signing up</Link> for a user account with our service
                        and get convenience and security out of the box.
                        Read about the <Link target="_blank"
                            rel="noopener noreferrer" to="/features"
                        >benefits</Link> of having a user account.
                    </Typography>
                    <IconButton onClick={this.dismiss} aria-label="Delete">
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </div>
            </CardActions>
        </Card>

}


// ...
export default connect(
    // map state to props.
    (_state) => ({}),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        toggleSignupHint: BankActions.toggleSignupHint,
    }, dispatch)
)(RegisterCard)
