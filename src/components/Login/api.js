import { config } from "../../config"
import Axios from "axios"


// ...
export const authenticate = async (username, password) => (
    async () => {
        try {
            return (await Axios.post(
                `${config.api}/user/authenticate/${username}/${password}`
            )).data
        } catch (error) {
            return error.response !== undefined ?
                error.response.data :
                {authenticated: false, error: error.message,}
        }
    }
)(username, password)



