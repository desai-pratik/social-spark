import { createSlice } from "@reduxjs/toolkit";


const searchSlice = createSlice({
    name: "search",
    initialState: {
        search: null
    },
    reducers: {
        addSearch: (state, action) => {
            state.search = action.payload;
        },
        editSearchPosts: (state, action) => {
            state.search.posts = state.search.posts.filter(post => post._id !== action.payload);
        },
    }
});

export const { addSearch, editSearchPosts } = searchSlice.actions;
export default searchSlice.reducer;