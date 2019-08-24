import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "@material-ui/core/styles"
import { Divider } from "@material-ui/core"




// <CustomDivider> component
export default withStyles((theme) => ({

    primary: {
        backgroundColor: theme.palette.primary.fade,
    },

    secondary: {
        backgroundColor: theme.palette.secondary.fade,
    },

    common: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, color, style }) =>
                <Divider
                    classes={{
                        root: classNames(classes[color], classes.common),
                    }}
                    style={style}
                />
        )(this.props)

    }
)
