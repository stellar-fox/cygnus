import React, { Fragment } from "react"
import { compose } from "redux"
import { connect } from "react-redux"
import { withAssetManager } from "../AssetManager"
import { List, ListItem } from "material-ui/List"
import {
    handleException,
    htmlEntities as he,
    pubKeyAbbr,
} from "../../lib/utils"



export default compose(
    withAssetManager,
    connect(state => ({Balances: state.Balances,}))
)((state) =>
    <Fragment>
        <div>
            Please confirm the following info on your
            device<he.Apos />s screen.
        </div>

        <List>
            <ListItem
                disabled={true}
                primaryText="Type"
                secondaryText={state.Balances.transactionType}
                leftIcon={
                    <i className="green material-icons md-icon-small">
                        assignment_late
                    </i>
                }
            />
            <ListItem
                disabled={true}
                primaryText="Amount"
                secondaryText={`${state.Balances.amount} XLM`}
                leftIcon={
                    <i className="green material-icons md-icon-small">
                        account_balance_wallet
                    </i>
                }
            />
            <ListItem
                disabled={true}
                primaryText="Destination"
                secondaryText={
                    handleException(
                        () => pubKeyAbbr(state.Balances.payee),
                        () => "Not Available"
                    )
                }
                leftIcon={
                    <i className="green material-icons md-icon-small">
                        local_post_office
                    </i>
                }
            />
            <ListItem
                disabled={true}
                primaryText="Memo"
                secondaryText={state.Balances.memoText}
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
)
