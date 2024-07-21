import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        editUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        removeUser: (state) => {
            state.user = null;
        },
    }
})

export const { addUser, editUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
