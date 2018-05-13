import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    List,
    ListItem,
} from "material-ui/List"
import {
    handleException,
    htmlEntities as he,
    pubKeyAbbrLedgerHQ,
} from "../../lib/utils"




// ...
export default connect(
    // map state to props.
    (state) => ({ Balances: state.Balances, })
)(
    ({ Balances, }) =>
        <Fragment>
            <div className="p-t centered">
                Please confirm that the following info is the same on your
                device<he.Apos />s screen:
            </div>
            <div className="f-b space-around">
                <List>
                    <ListItem
                        disabled={true}
                        primaryText="Operation Type"
                        secondaryText={Balances.transactionType}
                        leftIcon={
                            <i className="text-primary material-icons">
                                style
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Amount"
                        secondaryText={`${Balances.amountNative} XLM`}
                        leftIcon={
                            <i className="text-primary material-icons">
                                account_balance_wallet
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Destination"
                        secondaryText={
                            handleException(
                                () => pubKeyAbbrLedgerHQ(Balances.payee),
                                () => "Not Available"
                            )
                        }
                        leftIcon={
                            <i className="text-primary material-icons">
                                gps_fixed
                            </i>
                        }
                    />
                </List>
                <List>
                    <ListItem
                        disabled={true}
                        primaryText="Memo"
                        secondaryText={
                            Balances.memoText === "" ?
                                "Empty" : Balances.memoText
                        }
                        leftIcon={
                            <i className="text-primary material-icons">
                                speaker_notes
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
                When you are sure it is correct press
                <span className="bigger text-primary"><he.Check /></span>
                on the device to sign your transaction and send it off.
            </div>
        </Fragment>
)
