import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    actionType: 'add',    //  add or edit
    currentData: null
}

const adminTeamSlice = createSlice({
    name: "adminTeam",
    initialState,
    reducers: {
        openForm: (state, action) => {
            const { actionType, data } = action.payload;
            state.isOpen = true;
            state.actionType = actionType;
            state.currentData = data || null;
        },
        closeForm: (state) => {
            state.isOpen = false;
            state.actionType = 'add';
            state.isSubTask = false;
            state.currentData = null;
        }
    }
})

export const {openForm, closeForm} = adminTeamSlice.actions;

export default adminTeamSlice.reducer;
