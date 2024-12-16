import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isLogged: boolean
    roles: string[]
}

const initialState: AuthState = {
    isLogged: false,
    roles: [],
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<string[]>) {
            state.isLogged = true
            state.roles = action.payload
        },
        logout(state) {
            state.isLogged = false
            state.roles = []
        },
    },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
