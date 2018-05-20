import Axios from "axios"
import { config } from "../config"




// TODO: rename this and its instances as it was originally just fetching
// the gravatar link but ended up (as always) fethching everything :-)
export const gravatarLink = async (pubkey, options) => {

    return Axios.get(`${config.api}/user/md5/${pubkey}`)
        .then((response) => ({
            link: `https://www.gravatar.com/avatar/${response.data.md5}?s=${options.s || 100}`,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email,
            alias: response.data.alias,
            domain: response.data.domain,
        }))
        .catch((_error) => ({
            link: `https://www.gravatar.com/avatar?d=${options.d}&s=${options.s || 100}`,
            firstName: null,
            lastName: null,
            email: null,
            alias: null,
            domain: null,
        }))
}
