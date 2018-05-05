import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    List,
    ListItem,
} from "material-ui/List"
import {
    htmlEntities as he,
} from "../../lib/utils"




// ...
export default connect(
    // map state to props.
    (_state) => ({})
)(
    ({ hashedData, }) =>
        <Fragment>
            <div className="p-t centered">
                The following fingerprint will be lodged to your account data
                store: {hashedData}
            </div>
            <div className="p-t centered">
                Please confirm that the following info is the same on your
                device<he.Apos />s screen:
            </div>
            <div className="f-b space-around">
                <List>
                    <ListItem
                        disabled={true}
                        primaryText="No Data Available"
                        secondaryText="No Data Available"
                        leftIcon={
                            <i className="text-primary material-icons">
                                style
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Hash"
                        secondaryText="CFA...KWA"
                        leftIcon={
                            <i className="text-primary material-icons">
                                account_balance_wallet
                            </i>
                        }
                    />
                </List>
            </div>
            <div className="p-b centered">
                When you are sure it is correct press
                <span className="bigger text-primary"><he.Check /></span>
                on the device to sign your transaction and send it off.
            </div>
        </Fragment>
)
