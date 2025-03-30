import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUser:[]
    },
    reducers:{
        setOnlineUser:(state,action) => {
            state.posts = action.payload;
        },
    }
})

export const {setOnlineUser} = chatSlice.actions
export default  chatSlice.reducer;