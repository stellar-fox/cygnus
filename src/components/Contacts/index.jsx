import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import ContactCard from "../ContactCard"
import AddContactForm from "./AddContactForm"
import InputField from "../../lib/mui-v1/InputField"
import Typography from "@material-ui/core/Typography"
import Fuse from "fuse.js"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import Modal from "@material-ui/core/Modal"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as ModalAction } from "../../redux/Modal"
import { getUserContacts } from "../../lib/utils"




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
class Contacts extends Component {

    // ...
    state = {
        search: "",
        error: false,
        errorMessage: "",
    }


    // ...
    componentDidMount = () => {
        getUserContacts(this.props.userId, this.props.token)
            .then((results) => {
                results && this.props.setState({
                    internal: results.data.data,
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
    render = () =>
        <Fragment>
            <AddContactModal modalId={this.props.Modal.modalId}
                visible={this.props.Modal.visible} onClose={this.hideModal}
            />
            <div className="f-b space-between">
                <div className="f-b-col">
                    <Typography variant="title" color="inherit">
                        Contact Book
                    </Typography>
                    <Typography variant="body1" color="inherit">
                        Manage your financial contacts.
                    </Typography>
                </div>
                <div style={{ width: "100px", }}>
                    <AddContactButton onClick={this.showModal} />
                </div>
                <InputField
                    id="filter-contacts"
                    type="text"
                    label="Search Contact Book"
                    color="secondary"
                    margin="dense"
                    error={this.state.error}
                    errorMessage={this.state.errorMessage}
                    onChange={this.updateSearchFilter}
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