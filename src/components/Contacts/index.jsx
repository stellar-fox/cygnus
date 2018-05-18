import React, { Component } from "react"
import { Grid } from "@material-ui/core"
import ContactCard from "../ContactCard"
import AddNew from "../ContactCard/AddNew"

const testData = {
    firstName: "Stellar",
    lastName: "Fox",
    publicKey: "GCUG5DWV7W5LH3PRGRYMVJM4SW4A4JVDB6FWOSZJV5LTFRNSHEKH2WYS",
    paymentAddress: "fox*stellarfox.net",
}

// ...
class Contacts extends Component {
    render = () =>
        <Grid
            container
            alignContent="flex-start"
            alignItems="center"
            spacing={16}
        >
            <Grid item key={0} xs>
                <AddNew />
            </Grid>
            <Grid item key={1} xs>
                <ContactCard data={testData} />
            </Grid>
            <Grid item key={2} xs>
                <ContactCard data={testData} />
            </Grid>
            <Grid item key={3} xs>
                <ContactCard data={testData} />
            </Grid>
            <Grid item key={4} xs>
                <ContactCard data={testData} />
            </Grid>
        </Grid>
}



// ...
export default Contacts