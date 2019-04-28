import React, { Fragment } from "react"
import {
    Icon,
    Typography,
} from "@material-ui/core"




export default () =>

    <Fragment>
        <div className="flex-box-row">
            <div className="m-t-medium badge-error">
                <Icon
                    style={{
                        fontSize: "30px",
                        marginRight: "1rem",
                    }}
                >lock</Icon>
                <span style={{
                    fontSize: "32px",
                }}
                >Account Locked</span>
            </div>
        </div>
        <div className="m-t flex-box-col">
            <Typography variant="body1" color="primary">
                Warning!
            </Typography>
            <Typography variant="body2" color="primary">
                This account has been locked and this state cannot
                be undone. All remaining funds are frozen and final.
            </Typography>
            <Typography variant="body2" color="primary">
                <b>DO NOT</b> deposit
                anything onto this account as you will never be
                able to recover or withdraw those funds.
            </Typography>
        </div>
    </Fragment>
