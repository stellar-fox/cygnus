import Axios from "axios"
import { config } from "../config"



// TODO: rename this and its instances as it was originally just fetching
// the gravatar link but ended up (as always) fethching everything :-)
export const gravatarLink = async (pubkey) => {
    return Axios.get(`${config.api}/user/md5/${pubkey}`)
        .then((response) => ({
            link: `https://www.gravatar.com/avatar/${response.data.md5}?s=100`,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email,
            alias: response.data.alias,
        }))
        .catch((_error) => ({
            link: "https://www.gravatar.com/avatar?d=mm&s=100",
            firstName: "Unknown",
            lastName: "",
            email: null,
            alias: "payment address unknown",
        }))
}
