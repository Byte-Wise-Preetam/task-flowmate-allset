import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    user: {
        _id: null,
        firstName: null,
        lastName: null,
        email: null,
        team: null
    }
}

const loginUserSlice = createSlice({
    name: "loggedinUser",
    initialState,
    reducers: {
        saveUser: (state, action) => {
            const { _id, firstName, lastName, email, team } = action.payload;
            state.user = { _id, firstName, lastName, email, team };
        },
        addTeamMember: (state, action) => {
            state.user.team = action.payload;
        },
        editTeamMember: (state, action) => {
            const editedMember = action.payload;
            const index = state.user.team.findIndex((member) => editedMember.email === member.email);
            if(index !== -1){
                state.user.team[index] = editedMember;
            }
        },
        removeUser: (state, action) => {
            const userEmail = action.payload;
            state.user.team = state.user.team.filter((teamMember) => teamMember.email !== userEmail);
        },
        logOut: (state, action) => {
            state.user = {_id: null, firstName: null, lastName: null, email: null, team: null};
            sessionStorage.clear();
            return;
        },
        handleTokenExpiration: () => {
            sessionStorage.clear();
            window.location.href = '/sign-in';
        }
    }
})

export const {saveUser, addTeamMember, editTeamMember, removeUser, logOut, handleTokenExpiration} = loginUserSlice.actions;

export default loginUserSlice.reducer;