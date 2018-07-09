import { config } from "../../config"
import Axios from "axios"




// ...
export const subscribeEmail = async (user_id, token, email) =>
    (await Axios.post(
        `${config.apiV2}/user/subscribe-email/`, {
            user_id, token, email,
        }
    )).status