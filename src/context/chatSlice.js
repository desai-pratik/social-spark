import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedChat: null,
        notification: []
    },
    reducers: {
        addSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        addNotification: (state, action) => {
            state.notification = action.payload;
        }
    },
});

export const { addSelectedChat, addNotification } = chatSlice.actions;

export default chatSlice.reducer;
