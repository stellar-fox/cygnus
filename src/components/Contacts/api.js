import { config } from "../../config"
import Axios from "axios"




// ...
export const listInternal = async (user_id, token) =>
    (await Axios.post(`${config.apiV2}/contacts/list/internal/`, {
        user_id, token,
    })).data




// ...
export const listRequested = async (user_id, token) =>
    (await Axios.post(`${config.apiV2}/contacts/list/requested/`, {
        user_id, token,
    })).data




// ...
export const listPending = async (user_id, token) =>
    (await Axios.post(`${config.apiV2}/contacts/list/pending/`, {
        user_id, token,
    })).data




// ...
export const requestInternalByPaymentAddress = async (
    user_id, token, alias, domain
) =>
    (await Axios.post(
        `${config.apiV2}/contact/request/internal/by-payment-address/`, {
            user_id, token, alias, domain,
        }
    )).status




// ...
export const approveInternal = async (user_id, token) =>
    (await Axios.post(`${config.apiV2}/contact/approve/internal/`, {
        user_id, token,
    })).data




// ...
export const removeInternal = async (user_id, token, contact_id) =>
    (await Axios.post(`${config.apiV2}/contact/remove/internal/`, {
        user_id, token, contact_id,
    })).status
