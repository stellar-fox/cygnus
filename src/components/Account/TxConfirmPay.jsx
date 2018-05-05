import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    List,
    ListItem,
} from "material-ui/List"
import Divider from "../../lib/mui-v1/Divider"
import {
    htmlEntities as he,
} from "../../lib/utils"




// ...
export default connect(
    // map state to props.
    (state) => ({
        fingerprintPaymentData: state.Account.fingerprintPaymentData,
    })
)(
    ({ fingerprintPaymentData, }) =>
        <Fragment>
            <div className="p-t centered">
                The following data fingerprint will be lodged to your account:
            </div>
            <div className="p-t centered">
                <span className="bg-green">
                    {btoa(fingerprintPaymentData)}
                </span>
            </div>
            <Divider />
            <div className="p-t centered">
                Please confirm that the following info is the same on your
                device<he.Apos />s screen:
            </div>
            <div className="f-b space-around">
                <List>
                    <ListItem
                        disabled={true}
                        primaryText="No Data Available"
                        leftIcon={
                            <i className="text-primary material-icons">
                                style
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Hash"
                        leftIcon={
                            <i className="text-primary material-icons">
                                account_balance_wallet
                            </i>
                        }
                    />
                </List>
            </div>
            <div className="p-b centered">
                Press <span className="bigger text-primary"><he.Check /></span>
                on the device to confirm your profile data update.
            </div>
        </Fragment>
)
