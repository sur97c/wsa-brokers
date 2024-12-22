// app/redux/store.test.ts

import { store } from './store'
import { login, logout } from './slices/auth-slice'

describe('Redux Store', () => {
  it('should handle login action', () => {
    const roles = ['admin', 'editor']
    store.dispatch(login(roles))

    const state = store.getState().auth
    expect(state.isLogged).toBe(true)
    expect(state.roles).toEqual(roles)
  })

  it('should handle logout action', () => {
    store.dispatch(logout())

    const state = store.getState().auth
    expect(state.isLogged).toBe(false)
    expect(state.roles).toEqual([])
  })
})
