import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken(state, value) {
            state.token = value.payload;
        },

        setAuthenticated(state, value) {
            state.isAuthenticated = value.payload;
        }
    }
});

export const {setToken, setAuthenticated} = authSlice.actions;
export default authSlice.reducer;