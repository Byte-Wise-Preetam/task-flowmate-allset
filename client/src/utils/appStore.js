import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import tasksFormsSlice from "./tasksFormsSlice";
import adminTeamFormsSlice from "./adminTeamSlice"
import loginUserSlice from "./loginUserSlice";
import loaderSlice from "./loaderSlice";
import toastNotificationSlice from "./toastNotifiactionSlice"

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        taskForms: tasksFormsSlice,
        adminTeamForms: adminTeamFormsSlice,
        loginUser: loginUserSlice,
        loader: loaderSlice,
        toast: toastNotificationSlice
    }
})

export default store;