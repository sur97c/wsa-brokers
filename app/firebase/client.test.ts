import { auth } from './client'

jest.mock('./client', () => ({
    auth: {
        currentUser: { uid: '123', email: 'test@example.com' },
    },
    firestore: {
        collection: jest.fn(() => ({
            get: jest.fn(() => ({
                docs: [{ id: '1', data: () => ({ name: 'Test Item' }) }],
            })),
        })),
    },
}))

describe('Firebase Client', () => {
    it('should return current user', () => {
        expect(auth.currentUser).toEqual({ uid: '123', email: 'test@example.com' })
    })
})
