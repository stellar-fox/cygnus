import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Card,
    CardActions,
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
    render = () => (({ classes }) =>
        <Card classes={{ root: classes.card }} className="welcome-card">
            <CardActions className={classes.actions}>

                <Typography
                    style={{ paddingLeft: "0.5rem" }}
                    color="secondary"
                    variant="body2"
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
            </CardActions>
        </Card>)(this.props)

}


// ...
export default func.compose(
    withStyles((theme) => ({
        actions: {
            justifyContent: "space-between",
        },
        card: {
            boxSizing: "border-box",
            borderRadius: "2px",
        },
        colorTextPrimary: {
            color: theme.palette.primary.other,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            toggleSignupHint: BankActions.toggleSignupHint,
        }, dispatch),
    ),
)(RegisterCard)

