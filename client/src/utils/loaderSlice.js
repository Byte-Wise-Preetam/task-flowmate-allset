import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        isLoading: false,
        loadingType: null,
        message: null
    }
}

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        startLoading: function(state, action){
            state.value.isLoading = true;
            state.value.loadingType = action.payload?.type || null;
            state.value.message = action.payload?.message || null;
        },
        stopLoading: function(state, action){
            state.value.isLoading = false;
            state.value.loadingType = null;
            state.value.message = null;
        }
    }
})

export const { startLoading, stopLoading } = loaderSlice.actions;

export default loaderSlice.reducer;