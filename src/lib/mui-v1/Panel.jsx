import React from "react"

import { withStyles } from "material-ui-next/styles"




// <Panel> component
export default withStyles({

    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid rgba(244, 176, 4, 1.0)",
        borderRadius: "3px",
    },

    header: {
        backgroundColor: "rgba(244, 176, 4, 1.0)",
    },

    title: {
        margin: "3px 5px 3px 15px",
        color: "rgba(15, 46, 83, 1.0)",
        fontSize: "1.2em",
    },

    body: {
        margin: "1.5rem",
        textAlign: "left",
    },

})(
    ({ children, classes, title, }) =>
        <article className={classes.root}>
            <div className={classes.header}>
                <p className={classes.title}>{ title }</p>
            </div>
            <div className={classes.body}>
                { children }
            </div>
        </article>
)
