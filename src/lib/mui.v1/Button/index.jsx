import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "material-ui-next/styles"
import Button from "material-ui-next/Button"




// ...
const styles = (theme) => ({
    cssRoot: {
        color: theme.palette.getContrastText(theme.palette.secondaryColor),
        backgroundColor: theme.palette.secondaryColor,
        "&:hover": {
            backgroundColor: theme.palette.secondaryHighlight,
        },
        boxShadow: "0 3px 7px rgba(0, 0, 0, 0.3)",
    },
})




// <CustomButton> component...
export default withStyles(styles)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes: { cssRoot, }, onClick, children, }) =>
                <Button
                    variant="raised"
                    color="primary"
                    className={classNames(cssRoot)}
                    onClick={onClick}
                >
                    { children ? children : "Button" }
                </Button>
        )(this.props)

    }
)
