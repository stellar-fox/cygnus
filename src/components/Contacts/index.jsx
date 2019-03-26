import React, { Component, Fragment } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    AppBar,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Toolbar,
    Typography,
} from "@material-ui/core"
import Fuse from "fuse.js"
import ContactCard from "../ContactCard"
import ContactRequestCard from "../ContactCard/requestCard"
import ContactPendingCard from "../ContactCard/pendingCard"
import ContactBlockedCard from "../ContactCard/blockedCard"
import AddContactForm from "./AddContactForm"
import EditContactForm from "./EditContactForm"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { statusList } from "./api"
import { sortBy } from "../../lib/utils"
import Divider from "../../lib/mui-v1/Divider"
import debounce from "lodash/debounce"
import { fade } from "@material-ui/core/styles/colorManipulator"
import LCARSInput from "../../lib/common/LCARSInput"




// ...
const styles = (theme) => ({

    nocards: {
        color: theme.palette.secondary.dark,
        paddingLeft: "0.5rem",
        paddingTop: "0.5rem",
    },

    paper: {
        position: "absolute",
        width: theme.spacing.unit * 80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[24],
        padding: theme.spacing.unit * 2,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "3px",
        "&:focus": {
            outline: "none",
        },
    },

    raised: {
        color: theme.palette.secondary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
        borderRadius: "3px",
        transition: "text-shadow 350ms ease-out, background-color 350ms ease",
        marginLeft: "1.5rem",
    },

    formControl: {
        margin: theme.spacing.unit,
        minWidth: "150px",
    },

    selectMenu: {
        zIndex: 1001,
        backgroundColor: theme.palette.primary.other,
    },

    inputFocused: {
        color: `${fade(theme.palette.secondary.main, 0.5)} !important`,
    },

    selectIcon: {
        color: theme.palette.secondary.main,
    },

    selectRoot: {
        borderBottom: "unset",
        "&:before": { borderBottom: "unset" },
        "&:after": { borderBottom: "unset" },

    },

    toolbar: {
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },

})




// ...
const AddContactModal = withStyles(styles)(
    ({ classes, onClose, modalId, visible }) =>
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={ modalId === "addContact" && visible }
            onClose={onClose}
        >
            <div className={classes.paper}>
                <AddContactForm />
            </div>
        </Modal>
)




// ...
const EditContactModal = withStyles(styles)(
    ({ classes, onClose, modalId, visible, details }) =>
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={modalId === "editContact" && visible}
            onClose={onClose}
        >
            {details && details.external ?
                <div
                    style={{
                        background: "linear-gradient(90deg, rgb(244, 176, 4) 0%, rgb(138, 151, 175) 100%)",
                    }}
                    className={classes.paper}
                >
                    <EditContactForm />
                </div> :
                <div className={classes.paper}>
                    <EditContactForm />
                </div>
            }
        </Modal>
)




// ...
const AddContactButton = withStyles(styles)(
    ({ classes, onClick }) =>
        <Button onClick={onClick} variant="contained"
            color="primary" className={classes.raised}
        >Add Contact</Button>
)




// ...
const NoCards = withStyles(styles)(
    ({ classes, title, subtitle }) =>
        <div className={classes.nocards}>
            <Typography noWrap  variant="body1" color="inherit">
                {title}
            </Typography>
            <Typography noWrap  variant="caption" color="inherit">
                {subtitle}
            </Typography>
        </div>
)




// ...
const SelectView = withStyles(styles)(
    ({ classes, value, onChange }) =>
        <FormControl className={ classes.formControl }>

            <InputLabel
                classes={{
                    shrink: classes.inputFocused,
                }}
                htmlFor="select-view"
            >Select View</InputLabel>

            <Select disableUnderline
                classes={{
                    icon: classes.selectIcon,
                    root: classes.selectRoot,
                }}
                MenuProps={{
                    PopoverClasses: {
                        paper: classes.selectMenu,
                    },
                }}
                value={value}
                onChange={onChange}
                inputProps={{
                    name: "view",
                    id: "select-view",
                }}
            >
                <MenuItem value={0}>
                    <Typography variant="body1" color="secondary">
                        Everything
                    </Typography>
                </MenuItem>
                <MenuItem value={1}>
                    <Typography variant="body1" color="secondary">
                        Contacts
                    </Typography>
                </MenuItem>
                <MenuItem value={2}>
                    <Typography variant="body1" color="secondary">
                        Requests
                    </Typography>
                </MenuItem>
            </Select>
        </FormControl>
)




// <Contacts> component
class Contacts extends Component {

    // ...
    state = {
        search: string.empty(),
        error: false,
        errorMessage: string.empty(),
        selectedView: 0,
        sortBy: "first_name",
    }


    // ...
    showAllContacts = () => {
        if (this.props.contactsInternal.length === 0 &&
            this.props.contactsExternal.length === 0) {
            return (
                <NoCards title="You have no contacts at the moment."
                    subtitle="Click 'Add New Contact' to add some."
                />
            )
        }

        let contacts = []

        if (this.props.contactsInternal.length > 0) {
            contacts = contacts.concat(this.props.contactsInternal)
        }

        if (this.props.contactsExternal.length > 0) {
            contacts = contacts.concat(this.props.contactsExternal)
        }

        return contacts.sort(sortBy(this.state.sortBy)).map(
            (contact, index) =>
                <Grid item key={index + 1} xs={12} sm={12} md={4} lg={3}
                    xl={2}
                >
                    <ContactCard data={contact}
                        external={!contact.contact_id}
                    />
                </Grid>
        )
    }


    // ...
    showFilteredContacts = () => {
        let filteredInternal = new Fuse(this.props.contactsInternal, {
            keys: ["first_name", "last_name", "alias", "domain", "pubkey"],
            threshold: "0.3",
        }).search(this.state.search)

        let filteredExternal = new Fuse(this.props.contactsExternal, {
            keys: ["first_name", "last_name", "alias", "domain", "pubkey"],
            threshold: "0.3",
        }).search(this.state.search)

        if (filteredInternal.length === 0 && filteredExternal.length === 0) {
            return (
                <NoCards title="No contacts found."
                    subtitle="No external contacts were found matching this
                    search."
                />
            )
        }

        let filteredResults = []

        if (filteredInternal.length > 0) {
            filteredResults = filteredResults.concat(filteredInternal)
        }

        if (filteredExternal.length > 0) {
            filteredResults = filteredResults.concat(filteredExternal)
        }

        return filteredResults.sort(sortBy(this.state.sortBy)).map(
            (contact, index) =>
                <Grid item key={index + 1} xs={12} sm={12} md={4} lg={3}
                    xl={2}
                >
                    <ContactCard data={contact}
                        external={!contact.contact_id}
                    />
                </Grid>
        )
    }


    // ...
    showAllContactRequests = () => {
        if (this.props.contactRequests.length === 0 &&
            this.props.pending.length === 0) {
            return (
                <NoCards title="You have no contact requests at the moment."
                    subtitle="When someone requests you as a contact, you will
                    see it here."
                />
            )

        }
        let requests = []

        if (this.props.contactRequests.length > 0) {
            requests = requests.concat(this.props.contactRequests)
        }

        if (this.props.pending.length > 0) {
            requests = requests.concat(this.props.pending)
        }

        return requests.sort(sortBy(this.state.sortBy)).map(
            (contact, index) =>
                <Grid item key={index + 1} xs={12} sm={12} md={4} lg={3}
                    xl={2}
                >
                    {contact.status === statusList.REQUESTED &&
                        <ContactRequestCard data={contact} />
                    }
                    {contact.status === statusList.PENDING &&
                        <ContactPendingCard data={contact} />
                    }
                    {(contact.status === statusList.BLOCKED) &&
                        <ContactBlockedCard data={contact} />
                    }
                </Grid>
        )
    }


    // ...
    showFilteredContactRequests = () => {

        let searchRequests = new Fuse(this.props.contactRequests, {
            keys: ["first_name", "last_name", "alias", "domain", "pubkey"],
            threshold: "0.2",
        }).search(this.state.search)

        let searchPending = new Fuse(this.props.pending, {
            keys: ["first_name", "last_name", "alias", "domain", "pubkey"],
            threshold: "0.2",
        }).search(this.state.search)

        if (searchRequests.length === 0 && searchPending.length === 0) {
            return (
                <NoCards title="No contact requests found."
                    subtitle="No contact requests were found matching this
                    search."
                />
            )
        }

        let searchResults = []

        if (searchRequests.length > 0) {
            searchResults = searchResults.concat(searchRequests)
        }

        if (searchPending.length > 0) {
            searchResults = searchResults.concat(searchPending)
        }

        return searchResults.sort(sortBy(this.state.sortBy)).map(
            (contact, index) =>
                <Grid item key={index} xs={12} sm={12} md={4} lg={3} xl={2}>
                    {contact.status === statusList.REQUESTED &&
                        <ContactRequestCard data={contact} />
                    }
                    {contact.status === statusList.PENDING &&
                        <ContactPendingCard data={contact} />
                    }
                    {contact.status === statusList.BLOCKED &&
                        <ContactBlockedCard data={contact} />
                    }
                </Grid>
        )

    }


    // ...
    updateSearchFilter = debounce((search) => {
        this.setState({ search })
    }, 300)


    // ...
    showModal = () => this.props.showModal("addContact")


    // ...
    changeView = (event) =>
        this.setState({ selectedView: event.target.value })


    // ...
    render = () =>
        <Fragment>

            <AppBar
                style={{ borderRadius: "2px" }}
                position="static"
                color="inherit"
            >
                <Toolbar classes={{ root: this.props.classes.toolbar }}>

                    <div className="flex-box-col m-r">
                        <Typography noWrap variant="body1" color="primary">
                            Contact Book
                        </Typography>
                        <Typography noWrap variant="h5" color="primary">
                            Manage your financial contacts.
                        </Typography>
                    </div>

                    <AddContactButton onClick={this.showModal} />

                </Toolbar>

            </AppBar>

            <AddContactModal modalId={this.props.Modal.modalId}
                visible={this.props.Modal.visible} onClose={this.hideModal}
            />

            <EditContactModal modalId={this.props.Modal.modalId}
                visible={this.props.Modal.visible} onClose={this.hideModal}
                details={this.props.contactDetails}
            />


            <div className="p-l p-r">
                <div className="m-t flex-box-row space-between">
                    <LCARSInput
                        autoFocus
                        width="100%"
                        className="lcars-input p-b p-t"
                        label="Search Contacts"
                        inputType="search"
                        maxLength="100"
                        autoComplete="off"
                        handleChange={e => this.updateSearchFilter(e.target.value)}
                        subLabel={`Filter: ${this.state.search ?
                            this.state.search : "None"}`}
                    />
                    <SelectView value={this.state.selectedView}
                        onChange={this.changeView}
                    />
                </div>


                {this.state.selectedView === 0 &&
                <Fragment>
                    <div className="m-t-medium">
                        <Typography variant="body1" color="secondary">
                            Contacts
                        </Typography>
                        <Divider
                            style={{ opacity: "0.4" }}
                            color="secondary"
                        />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredContacts() :
                            this.showAllContacts()
                        }
                    </Grid>
                    <div className="m-t-medium">
                        <Typography variant="body1" color="secondary">
                            Requests
                        </Typography>
                        <Divider
                            style={{ opacity: "0.4" }}
                            color="secondary"
                        />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredContactRequests() :
                            this.showAllContactRequests()
                        }
                    </Grid>
                </Fragment>
                }

                {this.state.selectedView === 1 &&
                <Fragment>
                    <div className="m-t-medium">
                        <Typography variant="body1" color="secondary">
                            Contacts
                        </Typography>
                        <Divider
                            style={{ opacity: "0.4" }}
                            color="secondary"
                        />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredContacts() :
                            this.showAllContacts()
                        }
                    </Grid>
                </Fragment>
                }

                {this.state.selectedView === 2 &&
                <Fragment>
                    <div className="m-t-medium">
                        <Typography variant="body1" color="secondary">
                            Requests
                        </Typography>
                        <Divider
                            style={{ opacity: "0.4" }}
                            color="secondary"
                        />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredContactRequests() :
                            this.showAllContactRequests()
                        }
                    </Grid>
                </Fragment>
                }
            </div>
        </Fragment>
}




// ...
export default compose(
    withStyles(styles),
    connect(
        // map state to props
        (state) => ({
            Modal: state.Modal,
            contactsInternal: state.Contacts.internal,
            contactsExternal: state.Contacts.external,
            contactRequests: state.Contacts.requests,
            pending: state.Contacts.pending,
            contactDetails: state.Contacts.details,
        }),
        (dispatch) => bindActionCreators({
            setState: ContactsAction.setState,
            hideModal: ModalAction.hideModal,
            showModal: ModalAction.showModal,
        }, dispatch))
)(Contacts)
