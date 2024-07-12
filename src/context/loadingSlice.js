import { createSlice } from "@reduxjs/toolkit";


const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        loading: false,
        buttonLoading: false,
    },
    reducers: {
        toggleLoading: (state, action) => {
            state.loading = action.payload;
        },
        toggleButtonLoading: (state, action) => {
            state.buttonLoading = action.payload;
        },
    },
})


export const {toggleLoading, toggleButtonLoading} = loadingSlice.actions;
export default loadingSlice.reducer;