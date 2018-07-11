import { config } from "../../config"
import Axios from "axios"





// ...
export const fundAccount = async (user_id, token, charge) =>
    await Axios.post(`${config.apiV2}/account/fund/`, {
        user_id, token, charge,
    })
