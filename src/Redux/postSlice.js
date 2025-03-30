import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:'post',
    initialState:{
        posts:[],
        selectedPost:[],
    },
    reducers:{
        setPost:(state,action) => {
            state.posts = action.payload;
        },
        setSelectedPost:(state,action) => {
            state.selectedPost = action.payload;
        }
    }
})

export default postSlice.reducer;
export const {setPost, setSelectedPost} = postSlice.actions;
