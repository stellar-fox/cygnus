import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import { gravatar, gravatarSize48 } from "../StellarFox/env"
import Icon from "@material-ui/core/Icon"




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

        // ...
        state = {
            link: `${gravatar}?${gravatarSize48}&d=mysteryman`,
        }

        // ...
        render = () => (
            ({ classes, }) =>
                <Paper elevation={3} className={classes.root}>
                    <div className="f-b space-between">
                        <Icon style={{ fontSize: 48, }}>
                            add_box
                        </Icon>
                        <div className="bigger">
                            Add Contact
                        </div>
                    </div>
                </Paper>
        )(this.props)
    }
)