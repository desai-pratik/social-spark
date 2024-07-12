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

export const getPost = async (user)=>{
    try {
    const fetchPosts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/timeline/${user._id}`);
        res.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)})
    }
    fetchPosts();
} catch (error) {
    toast.error(`${error}`, tostConfig);
}
}