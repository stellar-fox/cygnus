import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "@material-ui/core/styles"
import { Avatar } from "@material-ui/core"




// <CustomAvatar> component
export default withStyles((theme) => ({

    avatar: {
        borderRadius: 3,
        width: 42,
        height: 42,
    },
    primary: { backgroundColor: theme.palette.primaryColor, },

}))(
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
