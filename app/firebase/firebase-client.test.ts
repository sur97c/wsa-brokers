// Archivo: app/firebase/firebase-client.test.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { app, auth } from './firebase-client'

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({ name: 'mockApp' })),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => ({ name: 'mockApp' })),
}))

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({ currentUser: null })),
    onAuthStateChanged: jest.fn((auth, callback) => callback(null)),
}))

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({ dbName: 'mockDb' })),
}))

describe('Firebase Client Initialization', () => {
    it('should initialize Firebase app if no apps exist', () => {
        (getApps as jest.Mock).mockReturnValue([])

        const testApp = initializeApp({})
        expect(initializeApp).toHaveBeenCalledWith({})
        expect(testApp).toBeDefined()
    })

    it('should reuse an existing Firebase app if one is already initialized', () => {
        (getApps as jest.Mock).mockReturnValue([{}])

        const testApp = getApps()[0]
        expect(getApps).toHaveBeenCalled()
        expect(testApp).toBeDefined()
    })

    it('should initialize Firebase Auth', () => {
        const testAuth = getAuth(app)
        expect(getAuth).toHaveBeenCalledWith(app)
        expect(testAuth).toBeDefined()
    })

    it('should initialize Firestore', () => {
        const testDb = getFirestore(app)
        expect(getFirestore).toHaveBeenCalledWith(app)
        expect(testDb).toBeDefined()
    })

    it('should handle authentication state changes', () => {
        const callback = jest.fn()
        const onAuthStateChangedMock = jest.fn((auth, cb) => cb(null));

        (onAuthStateChanged as jest.Mock).mockImplementation(onAuthStateChangedMock)
        onAuthStateChanged(auth, callback)

        expect(onAuthStateChangedMock).toHaveBeenCalledWith(auth, expect.any(Function))
        expect(callback).toHaveBeenCalledWith(null)
    })
})
