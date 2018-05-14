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
        fingerprintUserData: state.Account.fingerprintUserData,
    })
)(
    ({ fingerprintUserData, }) =>
        <Fragment>
            <div className="p-t centered">
                The following data fingerprint will be lodged to your account:
            </div>
            <div className="p-t centered">
                <span className="bg-green">
                    {btoa(fingerprintUserData)}
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
                        primaryText="Operation Type"
                        secondaryText="Manage Data"
                        leftIcon={
                            <i className="text-primary material-icons">
                                style
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Name"
                        secondaryText="idSig"
                        leftIcon={
                            <i className="text-primary material-icons">
                                event_note
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Value"
                        secondaryText="<binary data>"
                        leftIcon={
                            <i className="text-primary material-icons">
                                font_download
                            </i>
                        }
                    />
                </List>
                <List>
                    <ListItem
                        disabled={true}
                        primaryText="Memo"
                        secondaryText="[none]"
                        leftIcon={
                            <i className="text-primary material-icons">
                                message
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Fee"
                        secondaryText="0.000001 XLM"
                        leftIcon={
                            <i className="text-primary material-icons">
                                credit_card
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Network"
                        secondaryText="Test"
                        leftIcon={
                            <i className="text-primary material-icons">
                                public
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
