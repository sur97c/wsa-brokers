import authReducer, { login, logout } from './authSlice'

describe('authSlice', () => {
    const initialState = {
        isLogged: false,
        roles: [],
    }

    it('should return the initial state', () => {
        expect(authReducer(undefined, { type: "" })).toEqual(initialState)
    })

    it('should handle login', () => {
        const roles = ['admin', 'user']
        const newState = authReducer(initialState, login(roles))

        expect(newState.isLogged).toBe(true)
        expect(newState.roles).toEqual(roles)
    })

    it('should handle logout', () => {
        const loggedInState = {
            isLogged: true,
            roles: ['admin'],
        }
        const newState = authReducer(loggedInState, logout())

        expect(newState.isLogged).toBe(false)
        expect(newState.roles).toEqual([])
    })
})
