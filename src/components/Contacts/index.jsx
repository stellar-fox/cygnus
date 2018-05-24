import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import ContactCard from "../ContactCard"
import AddContactForm from "./AddContactForm"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Fuse from "fuse.js"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import Modal from "@material-ui/core/Modal"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { getUserContacts } from "../../lib/utils"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"



// ...
const styles = (theme) => ({

    nocards: {
        position: "absolute",
        width: theme.spacing.unit * 80,
        color: theme.palette.secondary.dark,
        top: "50%",
        left: "50%",
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

    outlined: {
        borderRadius: "3px",
        border: `1px solid ${theme.palette.secondary.dark}`,
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
        color: theme.palette.secondary.main,
        borderBottom: `1px solid ${theme.palette.secondary.main}`,
        "&:focus": {
            color: theme.palette.secondary.main,
        },
    },

    textFieldInput: {
        color: theme.palette.secondary.main,
        "&:hover:before": {
            borderBottomColor: `${theme.palette.secondary.main} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.secondary.main, },
        "&:after": { borderBottomColor: theme.palette.secondary.main, },
    },

    inputMargin: {
        margin: "0px",
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
                    Add New Contact
                </Typography>
                <AddContactForm />
            </div>
        </Modal>
)


// ...
const AddContactButton = withStyles(styles)(
    ({ classes, onClick, }) =>
        <Button onClick={onClick} variant="outlined"
            color="secondary" size="small" className={classes.outlined}
        >
            <Icon style={{ marginRight: "3px", }}>
                add_box
            </Icon>
            <Typography noWrap  variant="caption" color="inherit">
                Add New
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
                shrink: classes.shrink,
            },
        }}
    />
)


// ...
const SelectView = withStyles(styles)(
    ({ classes, value, onChange, }) =>
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-view">Select Contact View</InputLabel>
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
                <MenuItem value={2}>Current</MenuItem>
                <MenuItem value={1}>Pending</MenuItem>
                <MenuItem value={3}>Declined</MenuItem>
                <MenuItem value={4}>Blocked</MenuItem>
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
        selectedView: 2,
    }


    // ...
    componentDidMount = () => {
        getUserContacts(this.props.userId, this.props.token)
            .then((results) => {
                results ? this.props.setState({
                    internal: results,
                }) : this.props.setState({
                    internal: [],
                })
            })
    }


    // ...
    showAllCards = () =>
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
    showFilteredCards = () => {

        let results = new Fuse(this.props.contactsInternal, {
            keys: ["first_name", "last_name",],
        }).search(this.state.search)

        return results.length === 0 ? <NoCards title="No contacts found."
            subtitle="There are no contacts in your book that match this search."
        /> : results.map((contact, index) =>
            <Grid item key={index} xs>
                <ContactCard data={contact} />
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
        this.setState({
            selectedView: event.target.value,
        })
    }

    // ...
    render = () =>
        <Fragment>
            <AddContactModal modalId={this.props.Modal.modalId}
                visible={this.props.Modal.visible} onClose={this.hideModal}
            />
            <div className="f-b m-b space-between" style={{ alignItems: "flex-end", }}>
                <div className="f-b-col" style={{ marginBottom: "5px", }}>
                    <Typography variant="title" color="inherit">
                        Contact Book
                    </Typography>
                    <Typography variant="body1" color="inherit">
                        Manage your financial contacts.
                    </Typography>
                </div>
                <div style={{ width: "100px", marginBottom: "8px", }}>
                    <AddContactButton onClick={this.showModal} />
                </div>
                <div style={{ marginBottom: "4px", }}>
                    <SearchField label="Search Contact Book"
                        onChange={this.updateSearchFilter}
                    />
                </div>

                <SelectView value={this.state.selectedView}
                    onChange={this.changeView}
                />
            </div>

            <Grid
                container
                alignContent="flex-start"
                alignItems="center"
                spacing={16}
            >
                {this.state.search.length > 0 ?
                    this.showFilteredCards() : this.showAllCards()
                }
            </Grid>
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
    }),
    (dispatch) => bindActionCreators({
        setState: ContactsAction.setState,
        hideModal: ModalAction.hideModal,
        showModal: ModalAction.showModal,
    }, dispatch)
)(Contacts)