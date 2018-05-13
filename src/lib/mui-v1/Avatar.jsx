import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "material-ui-next/styles"
import Avatar from "material-ui-next/Avatar"

const styles = theme => ({
    avatar: {
        borderRadius: 3,
        width: 42,
        height: 42,
    },
    primary: {
        backgroundColor: theme.palette.primaryColor,
    },
})


export default withStyles(styles)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        render = () => (
            ({ classes, color, src, }) =>
                <Avatar
                    classes={{
                        root: classes[color],
                    }}
                    className={classes.avatar}
                    src={src}
                />
        )(this.props)
    }
)
