import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "Login_Start" });
    try {
        const res = await axios.post("https://socialspark-backend.onrender.com/api/auth/login", userCredential);
        dispatch({ type: "Login_Success", payload: res.data });
    } catch (err) {
        dispatch({ type: "Login_Failure", payload: err });
    }
}