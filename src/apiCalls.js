import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "Login_Start" });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, userCredential);
        dispatch({ type: "Login_Success", payload: res.data });
    } catch (err) {
        dispatch({ type: "Login_Failure", payload: err });
    }
}