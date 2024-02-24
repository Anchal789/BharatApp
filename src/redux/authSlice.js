import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    profile: {
        image: "",
        email: "",
        userName : ""
    },
    authentication: false,
    error: "",
    admin: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        login: (state, action) => {
            state.profile = action.payload
            state.authentication = true
            state.admin = action.payload.admin ? true : false;
        },
        logout: (state) => {
            state.profile = {
                image: "",
                email: "",
                userName : ""
            }
            state.authentication = false
            state.email = ""
        },
    },
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer