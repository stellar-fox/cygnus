import React, { Fragment } from "react"
import { List, ListItem } from "material-ui/List"
import {
    htmlEntities as he,
} from "../../lib/utils"

export default (paymentData) => <Fragment>
    <div>
        Please confirm the following info on your
        device<he.Apos />s screen.
    </div>

    <List>
        <ListItem
            disabled={true}
            primaryText="Type"
            secondaryText={paymentData.transactionType}
            leftIcon={
                <i className="green material-icons md-icon-small">
                    assignment_late
                </i>
            }
        />
        <ListItem
            disabled={true}
            primaryText="Amount"
            secondaryText={`${paymentData.amount} XLM`}
            leftIcon={
                <i className="green material-icons md-icon-small">
                    account_balance_wallet
                </i>
            }
        />
        <ListItem
            disabled={true}
            primaryText="Destination"
            secondaryText={paymentData.publicKeyAbbr}
            leftIcon={
                <i className="green material-icons md-icon-small">
                    local_post_office
                </i>
            }
        />
        <ListItem
            disabled={true}
            primaryText="Memo"
            secondaryText={paymentData.memo}
            leftIcon={
                <i className="green material-icons md-icon-small">
                    speaker_notes
                </i>
            }
        />
        <ListItem
            disabled={true}
            primaryText="Fee"
            secondaryText="0.000001 XLM"
            leftIcon={
                <i className="green material-icons md-icon-small">
                    credit_card
                </i>
            }
        />
        <ListItem
            disabled={true}
            primaryText="Network"
            secondaryText="Test"
            leftIcon={
                <i className="green material-icons md-icon-small">
                    network_check
                </i>
            }
        />
    </List>
    <div>
        When you are sure it is correct press <span className="bigger">
            <he.Check /></span>
        on the device to sign your transaction and send it off.
    </div>
</Fragment>
