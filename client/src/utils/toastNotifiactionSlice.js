import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        type: null,     //  add, edit, fail, undo, delete, success
        message: null,
        isActive: false
    }
}

const toastNotificationSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        setToastVisible: function(state, action){
            state.value.isActive=true;
            state.value.type = action.payload?.type || null;
            state.value.message = action.payload?.message || null;
        },
        removeToast: function(state, action){
            state.value.isActive=false;
            state.value.type = null;
            state.value.message = null;
        }
    }
})

export const {setToastVisible, removeToast}  = toastNotificationSlice.actions;

export default toastNotificationSlice.reducer;