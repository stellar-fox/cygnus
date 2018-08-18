import { config } from "../../config"
import Axios from "axios"




// ...
export const subscribeEmail = async (user_id, token, email) =>
    (await Axios.post(
        `${config.apiV2}/user/subscribe-email/`, {
            user_id, token, email,
        }
    )).status




// ...
export const unsubscribeEmail = async (user_id, token, email) =>
    (await Axios.post(
        `${config.apiV2}/user/unsubscribe-email/`, {
            user_id, token, email,
        }
    )).status




// ...
export const implodeCloudData = async (user_id, token) =>
    (await Axios.post(
        `${config.apiV2}/account/implode/`, {
            user_id, token,
        }
    )).status
