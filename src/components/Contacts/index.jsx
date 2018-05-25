import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import ContactCard from "../ContactCard"
import AddContactForm from "./AddContactForm"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Fuse from "fuse.js"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import Modal from "@material-ui/core/Modal"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { getUserContacts, getUserExternalContacts } from "../../lib/utils"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Divider from "../../lib/mui-v1/Divider"



// ...
const styles = (theme) => ({

    nocards: {
        color: theme.palette.secondary.dark,
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
        color: theme.palette.secondaryColor,
        "&:hover": {
            backgroundColor: theme.palette.primaryHighlight,
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
        backgroundColor: theme.palette.secondary.light,
    },

    input: {
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        "&:focus": {
            color: theme.palette.primary.main,
        },
    },

    textFieldInput: {
        color: theme.palette.primary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.main, },
        "&:after": { borderBottomColor: theme.palette.primary.main, },
    },

    inputMargin: {
        margin: "0px",
    },

    inputLabel: {
        color: theme.palette.primary.main,
        "&:focus": {
            color: theme.palette.primary.main,
        },
    },

})


// ...
const AddContactModal = withStyles(styles)(
    ({ classes, onClose, modalId, visible, }) =>
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={ modalId === "addContact" && visible }
            onClose={onClose}
        >
            <div className={classes.paper}>
                <Typography variant="subheading" color="primary"
                    id="modal-title"
                >
                    Request New Contact
                </Typography>
                <AddContactForm />
            </div>
        </Modal>
)


// ...
const AddContactButton = withStyles(styles)(
    ({ classes, onClick, }) =>
        <Button onClick={onClick} variant="raised"
            color="primary" size="small" className={classes.raised}
        >
            <Icon style={{ marginRight: "3px", }}>
                add_box
            </Icon>
            <Typography noWrap variant="caption" color="inherit">
                Request New Contact
            </Typography>
        </Button>
)


// ...
const NoCards = withStyles(styles)(
    ({ classes, title, subtitle, }) =>
        <div className={classes.nocards}>
            <Typography noWrap  variant="body2" color="inherit">
                {title}
            </Typography>
            <Typography noWrap  variant="caption" color="inherit">
                {subtitle}
            </Typography>
        </div>
)


// ...
const SearchField = withStyles(styles)(
    ({ classes, label, onChange, value, }) => <TextField
        id="seach-by"
        label={label}
        value={value}
        type="search"
        margin="dense"
        onChange={onChange}
        InputProps={{
            classes: {
                input: classes.textFieldInput,
                underline: classes.textFieldInput,
            },
        }}
        InputLabelProps={{
            classes: {
                root: classes.textFieldInput,
                marginDense: classes.inputMargin,
            },
        }}
    />
)


// ...
const SelectView = withStyles(styles)(
    ({ classes, value, onChange, }) =>
        <FormControl className={classes.formControl}>
            <InputLabel classes={{shrink: classes.inputLabel,}}
                htmlFor="select-view"
            >Select Contact View</InputLabel>
            <Select
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
                    className: classes.input,
                }}
            >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Internal</MenuItem>
                <MenuItem value={2}>External</MenuItem>
            </Select>
        </FormControl>
)



// ...
class Contacts extends Component {

    // ...
    state = {
        search: "",
        error: false,
        errorMessage: "",
        selectedView: 0,
    }


    // ...
    componentDidMount = () => {
        this.userContacts(this.state.selectedView)
    }


    // ...
    userContacts = () => {

        // list all user contacts
        this.state.selectedView === 0 &&
            getUserContacts(this.props.userId, this.props.token)
                .then((results) => {
                    results ? this.props.setState({
                        internal: results,
                    }) : this.props.setState({
                        internal: [],
                    })
                }) &&

            getUserExternalContacts(this.props.userId, this.props.token)
                .then((results) => {
                    results ? this.props.setState({
                        external: results,
                    }) : this.props.setState({
                        external: [],
                    })
                })


        // list internal contacts only
        this.state.selectedView === 1 &&
            getUserContacts(this.props.userId, this.props.token)
                .then((results) => {
                    results ? this.props.setState({
                        internal: results,
                    }) : this.props.setState({
                        internal: [],
                    })
                })

        // list external contacts only
        this.state.selectedView === 2 &&
            getUserExternalContacts(this.props.userId, this.props.token)
                .then((results) => {
                    results ? this.props.setState({
                        external: results,
                    }) : this.props.setState({
                        external: [],
                    })
                })

    }


    // ...
    showAllInternalCards = () =>
        this.props.contactsInternal.length === 0 ?
            <NoCards title="No contacts yet."
                subtitle="Adding contacts enables easier and safer transfers."
            /> :
            this.props.contactsInternal.map((contact, index) =>
                <Grid item key={index + 1} xs>
                    <ContactCard data={contact} />
                </Grid>
            )


    // ...
    showAllExternalCards = () =>
        this.props.contactsExternal.length === 0 ?
            <NoCards title="No contacts yet."
                subtitle="Adding contacts enables easier and safer transfers."
            /> :
            this.props.contactsExternal.map((contact, index) =>
                <Grid item key={index + 1} xs>
                    <ContactCard data={contact} external />
                </Grid>
            )


    // ...
    showFilteredInternalCards = () => {

        let results = new Fuse(this.props.contactsInternal, {
            keys: ["first_name", "last_name",],
        }).search(this.state.search)

        return results.length === 0 ?
            <Grid item key={0} xs>
                <NoCards title="No contacts found."
                    subtitle="No internal contacts were found matching this search."
                />
            </Grid> : results.map((contact, index) =>
                <Grid item key={index} xs>
                    <ContactCard data={contact} />
                </Grid>
            )
    }


    // ...
    showFilteredExternalCards = () => {

        let results = new Fuse(this.props.contactsExternal, {
            keys: ["first_name", "last_name",],
        }).search(this.state.search)

        return results.length === 0 ?
            <Grid item key={0} xs>
                <NoCards title="No contacts found."
                    subtitle="No external contacts were found matching this search."
                />
            </Grid> : results.map((contact, index) =>
                <Grid item key={index} xs>
                    <ContactCard data={contact} external />
                </Grid>
            )

    }


    // ...
    updateSearchFilter = (event) =>
        this.setState({ search: event.target.value, })


    // ...
    showModal = () => this.props.showModal("addContact")


    // ...
    changeView = (event) => {
        this.setState({ selectedView: event.target.value, }, () => {
            this.userContacts()
        })
    }

    // ...
    render = () =>
        <Fragment>

            <AppBar position="static" color="inherit">
                <Toolbar>

                    <div style={{flex: 1,}} className="f-b-col m-r">
                        <Typography noWrap variant="title" color="primary">
                            Contact Book
                        </Typography>
                        <Typography noWrap variant="body1" color="primary">
                                Your financial contacts.
                        </Typography>
                    </div>


                    <AddContactButton onClick={this.showModal} />


                    <div style={{ marginLeft: "2rem", }}>
                        <div className="f-e space-between">
                            <SearchField label="Search Contact Book"
                                onChange={this.updateSearchFilter}
                            />
                            <SelectView value={this.state.selectedView}
                                onChange={this.changeView}
                            />
                        </div>
                    </div>

                </Toolbar>

            </AppBar>

            <AddContactModal modalId={this.props.Modal.modalId}
                visible={this.props.Modal.visible} onClose={this.hideModal}
            />

            {this.state.selectedView === 0 &&
                <Fragment>
                    <div className="m-t-medium">
                        <Typography noWrap align="center" variant="body2"
                            color="secondary"
                        >
                            Internal Contacts
                        </Typography>
                        <Divider color="secondary" />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredInternalCards() :
                            this.showAllInternalCards()
                        }
                    </Grid>
                    <div className="m-t-medium">
                        <Typography noWrap align="center" variant="body2"
                            color="secondary"
                        >
                            External Contacts
                        </Typography>
                        <Divider color="secondary" />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredExternalCards() :
                            this.showAllExternalCards()
                        }
                    </Grid>
                </Fragment>
            }

            {this.state.selectedView === 1 &&
                <Fragment>
                    <div className="m-t-medium">
                        <Typography noWrap align="center" variant="body2"
                            color="secondary"
                        >
                            Internal Contacts
                        </Typography>
                        <Divider color="secondary" />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredInternalCards() :
                            this.showAllInternalCards()
                        }
                    </Grid>
                </Fragment>
            }

            {this.state.selectedView === 2 &&
                <Fragment>
                    <div className="m-t-medium">
                        <Typography noWrap align="center" variant="body2"
                            color="secondary"
                        >
                            External Contacts
                        </Typography>
                        <Divider color="secondary" />
                    </div>
                    <Grid
                        container
                        alignContent="flex-start"
                        alignItems="center"
                        spacing={16}
                    >
                        {this.state.search.length > 0 ?
                            this.showFilteredExternalCards() :
                            this.showAllExternalCards()
                        }
                    </Grid>
                </Fragment>
            }

        </Fragment>
}



// ...
export default connect(
    // map state to props
    (state) => ({
        token: state.LoginManager.token,
        userId: state.LoginManager.userId,
        Modal: state.Modal,
        contactsInternal: state.Contacts.internal,
        contactsExternal: state.Contacts.external,
    }),
    (dispatch) => bindActionCreators({
        setState: ContactsAction.setState,
        hideModal: ModalAction.hideModal,
        showModal: ModalAction.showModal,
    }, dispatch)
)(Contacts)