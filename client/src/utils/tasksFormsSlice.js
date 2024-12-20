import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    actionType: 'add',    //  add or edit
    isSubTask: false,   // true for subTask, false for task
    currentData: null   // current task data when a task to be edited OR taskID when a subtask to be added.
}

const formSlice = createSlice({
    name: 'taskForms',
    initialState,
    reducers: {
        openForm: (state, action) => {
            const { actionType, isSubTask, data } = action.payload;
            state.isOpen = true;
            state.actionType = actionType; 
            state.isSubTask = isSubTask; 
            state.currentData = data || null;
        },
        closeForm: (state) => {
            state.isOpen = false;
            state.actionType = 'createnew';
            state.isSubTask = false;
            state.currentData = null;
        }
    }
})

export const { openForm, closeForm } = formSlice.actions;

export default formSlice.reducer;