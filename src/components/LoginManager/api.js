import { config } from "../../config"
import Axios from "axios"


// ...
export const authenticate = async (email, password) => (
    async () => {
        try {
            return (await Axios.post(
                `${config.api}/user/authenticate/`, {email, password,}
            )).data
        } catch (error) {
            if (error.response.status >= 500) {
                return { authenticated: false, error: error.message,}
            }
            return error.response !== undefined ?
                error.response.data :
                {authenticated: false, error: error.message,}
        }
    }
)(email, password)
