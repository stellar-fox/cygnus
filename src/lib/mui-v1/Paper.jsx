import React, { Component } from "react"
import PropTypes from "prop-types"

import { withStyles } from "@material-ui/core/styles"
import { Paper } from "@material-ui/core"




// <CustomPaper> component
export default withStyles((theme) => ({

    root: theme.mixins.gutters({
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: "10px !important",
        paddingRight: "10px !important",
        borderRadius: "2px",
    }),

    primaryMaxWidth: {
        background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
        minWidth: 300,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        // ...
        render = () => (
            ({ children, classes, color }) =>
                <Paper
                    classes={{
                        root: classes[color],
                    }}
                    className={classes.root}
                    elevation={3}
                >
                    { children }
                </Paper>
        )(this.props)
    }
)
