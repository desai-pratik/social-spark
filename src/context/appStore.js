import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import sidebarReducer from "./sidebarSlice";
import chatReducer from "./chatSlice";

const appStore = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        chat: chatReducer,
    }
});

export default appStore;