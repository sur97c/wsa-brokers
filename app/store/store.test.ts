import { store } from './index';
import { login, logout } from './slices/authSlice';

describe('Redux Store', () => {
    it('should handle login action', () => {
        const roles = ['admin', 'editor'];
        store.dispatch(login(roles));

        const state = store.getState().auth;
        expect(state.isLogged).toBe(true);
        expect(state.roles).toEqual(roles);
    });

    it('should handle logout action', () => {
        store.dispatch(logout());

        const state = store.getState().auth;
        expect(state.isLogged).toBe(false);
        expect(state.roles).toEqual([]);
    });
});
