import axios from "axios";
import { toast } from "react-toastify";

export const loginCall = async (userCredential, dispatch) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, userCredential);
    } catch (err) {
        toast.error(`${err}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
}