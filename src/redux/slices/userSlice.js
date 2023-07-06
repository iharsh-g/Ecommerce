import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    userDetails: null,
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.userDetails = value.payload;
        },

        setLoading(state, value) {
            state.isLoading = value.payload;
        }
    }
});

export const { setUser, setLoading} = userSlice.actions;
export default userSlice.reducer;