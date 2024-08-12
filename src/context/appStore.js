import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import sidebarReducer from "./sidebarSlice";
import chatReducer from "./chatSlice";
import loadingReducer from "./loadingSlice";
import searchReducer from "./searchSlice";

const appStore = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        chat: chatReducer,
        loading: loadingReducer,
        search: searchReducer,
    }
});

export default appStore;