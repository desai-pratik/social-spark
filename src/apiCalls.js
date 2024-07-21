import axios from "axios";
import { toast } from "react-toastify";
import { tostConfig } from "./config/interface";

export const loginCall = async (userCredential, dispatch) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, userCredential);
    } catch (err) {
        toast.error(`${err}`, tostConfig);
    }
}
