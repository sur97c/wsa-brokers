import { Firestore } from 'firebase/firestore'

export const auth = {
    currentUser: { uid: '123', email: 'test@example.com' },
}

export const firestore = {
    collection: jest.fn(() => ({
        get: jest.fn(() => ({
            docs: [{ id: '1', data: () => ({ name: 'Test Item' }) }],
        })),
    })),
} as unknown as Firestore
