import { config } from "../../config"
import Axios from "axios"




// ...
export const statusList = {
    REQUESTED: 1,
    APPROVED: 2,
    BLOCKED: 3,
    DELETED: 4,
    PENDING: 5,
}




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
export const requestByEmail = async (
    user_id, token, email, referrer
) =>
    (await Axios.post(
        `${config.apiV2}/contact/request/by-email/`, {
            user_id, token, email, referrer,
        }
    )).status




// ...
export const requestByAccountNumber = async (
    user_id, token, pubkey
) =>
    (await Axios.post(
        `${config.apiV2}/contact/request/by-account-number/`, {
            user_id, token, pubkey,
        }
    )).status




// ...
export const requestByPaymentAddress = async (
    user_id, token, alias, domain
) =>
    (await Axios.post(
        `${config.apiV2}/contact/request/by-payment-address/`, {
            user_id, token, alias, domain,
        }
    )).status




// ...
export const approveInternal = async (user_id, token, contact_id) =>
    (await Axios.post(`${config.apiV2}/contact/approve/internal/`, {
        user_id, token, contact_id,
    })).data




// ...
export const rejectInternal = async (user_id, token, contact_id) =>
    (await Axios.post(`${config.apiV2}/contact/reject/internal/`, {
        user_id, token, contact_id,
    })).data




// ...
export const unblockInternal = async (user_id, token, contact_id) =>
    (await Axios.post(`${config.apiV2}/contact/unblock/internal/`, {
        user_id, token, contact_id,
    })).data




// ...
export const removeFederated = async (user_id, token, id, added_by) =>
    (await Axios.post(`${config.apiV2}/contact/remove/federated/`, {
        user_id, token, id, added_by,
    })).status




// ...
export const removeInternal = async (user_id, token, contact_id) =>
    (await Axios.post(`${config.apiV2}/contact/remove/internal/`, {
        user_id, token, contact_id,
    })).status




// ...
export const updateFederated = async (user_id, token, attr) =>
    (await Axios.post(`${config.apiV2}/contact/update/federated/`, {
        user_id, token, ...attr,
    })).status
