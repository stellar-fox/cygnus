import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import { pubKeyAbbr } from "../../lib/utils"




// ...
export default withStyles((theme) => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        minWidth: 250,
    }),

    rootAlt: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: theme.palette.secondary.light,
        minWidth: 250,
    }),

    avatar: {
        borderRadius: 3,
        width: 48,
        height: 48,
        border: `1px solid ${theme.palette.primary.light}`,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, data, external, }) =>
                <Paper elevation={3}
                    className={external ? classes.rootAlt : classes.root}
                >
                    <div className="f-b space-between">
                        <Avatar className={classes.avatar}
                            src={`${gravatar}${data.email_md5}?${
                                gravatarSize48}&d=robohash`}
                        />
                        <div className="f-e-col space-between">
                            <div className="f-e-col">
                                <Typography align="right" noWrap>
                                    {data.last_name}, {data.first_name}
                                </Typography>
                                <Typography variant="caption" align="right"
                                    noWrap
                                >
                                    {data.alias}*{data.domain}
                                </Typography>
                            </div>
                            <Typography variant="caption" align="right"
                                noWrap
                            >
                                {pubKeyAbbr(data.pubkey)}
                            </Typography>
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)
