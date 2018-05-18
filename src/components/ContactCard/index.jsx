import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import { gravatarLink } from "../../lib/deneb"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import { pubKeyAbbr } from "../../lib/utils"




// ...
export default withStyles((theme) => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        color: theme.palette.primary.main,
        minWidth: 250,
    }),

    avatar: {
        borderRadius: 3,
        width: 48,
        height: 48,
        border: `1px solid ${theme.palette.primary.main}`,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        state = {
            link: `${gravatar}?${gravatarSize48}`,
        }

        // ...
        componentDidMount = () => {
            gravatarLink(this.props.data.publicKey).then((response) => this.setState({
                link: response.link,
            }))
        }

        // ...
        render = () => (
            ({ classes, data, }) =>
                <Paper elevation={3} className={classes.root}>
                    <div className="f-b space-between">
                        <Avatar className={classes.avatar}
                            src={this.state.link}
                        />
                        <div className="f-e-col space-between">
                            <div>
                                <div>
                                    {data.lastName}, {data.firstName}
                                </div>
                                <div className="small fade">
                                    {data.paymentAddress}
                                </div>
                            </div>
                            <div className="tiny fade-strong">
                                {pubKeyAbbr(data.publicKey)}
                            </div>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)