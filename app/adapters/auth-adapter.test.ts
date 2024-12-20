// File: app/adapters/auth-adapter.test.ts
import { AuthAdapter } from './auth-adapter'
import { auth as mockClientAuth } from '../firebase/firebase-client'
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  adminAuth as mockAdminAuth,
  adminDb as mockAdminDb,
} from '../firebase/firebase-admin'

jest.mock('firebase/app', () => {
  const mockApp = {
    name: '[DEFAULT]',
    options: {},
    automaticDataCollectionEnabled: false,
  }
  return {
    initializeApp: jest.fn(() => mockApp),
    getApp: jest.fn(() => mockApp),
    getApps: jest.fn(() => []),
  }
})

jest.mock('firebase/auth', () => {
  const mockAuth = {
    currentUser: null,
    // Add other auth properties as needed
  }
  return {
    getAuth: jest.fn(() => mockAuth),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    onAuthStateChanged: jest.fn(),
  }
})

jest.mock('../firebase/firebase-admin', () => {
  const mockDoc = jest.fn(() => ({
    set: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({
        roles: ['USER'],
      }),
    }),
  }))

  return {
    adminAuth: {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      setCustomUserClaims: jest.fn(),
    },
    adminDb: {
      collection: jest.fn(() => ({
        doc: mockDoc,
      })),
    },
  }
})

jest.mock('../firebase/firebase-client', () => ({
  auth: {
    currentUser: null,
    // Add other necessary properties
  },
  app: {
    name: '[DEFAULT]',
    options: {},
  },
  db: {
    // Add mock firestore properties
  },
}))

describe('AuthAdapter', () => {
  let authAdapter: AuthAdapter
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    authAdapter = new AuthAdapter()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const mockUserCredential = { user: { uid: '12345' } }
      ;(signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
        mockUserCredential
      )

      const email = 'test@example.com'
      const password = 'password123'

      const uid = await authAdapter.login(email, password)

      expect(uid).toBe('12345')
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockClientAuth,
        email,
        password
      )
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should throw an AuthError if login fails', async () => {
      const mockError = new Error('Invalid credentials')
      ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
        mockError
      )

      const email = 'test@example.com'
      const password = 'wrongpassword'

      await expect(authAdapter.login(email, password)).rejects.toThrow(
        'Failed to log in user'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error logging in user:',
        expect.any(Error)
      )
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockClientAuth,
        email,
        password
      )
    })
  })

  describe('logout', () => {
    it('should log out a user successfully', async () => {
      ;(signOut as jest.Mock).mockResolvedValueOnce(undefined)

      await authAdapter.logout()

      expect(signOut).toHaveBeenCalledWith(mockClientAuth)
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should throw an AuthError if logout fails', async () => {
      const mockError = new Error('Logout failed')
      ;(signOut as jest.Mock).mockRejectedValueOnce(mockError)

      await expect(authAdapter.logout()).rejects.toThrow(
        'Failed to log out user'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error logging out user:',
        expect.any(Error)
      )
      expect(signOut).toHaveBeenCalledWith(mockClientAuth)
    })
  })

  describe('recoverAccess', () => {
    it('should send a password reset email successfully', async () => {
      // Mock the sendPasswordResetEmail function
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined)

      const email = 'test@example.com'
      await authAdapter.recoverAccess(email)

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockClientAuth, email)
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should throw an AuthError if sending the password reset email fails', async () => {
      // Mock an error from sendPasswordResetEmail
      const mockError = new Error('Failed to send email')
      ;(sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(mockError)

      const email = 'test@example.com'

      await expect(authAdapter.recoverAccess(email)).rejects.toThrow(
        'Failed to send password reset email'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error sending password reset email:',
        expect.any(Error)
      )
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockClientAuth, email)
    })
  })

  describe('AuthAdapter - createUser', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      authAdapter = new AuthAdapter()
    })

    it('should create a user in Firebase Authentication and Firestore', async () => {
      // Mock Firebase Authentication response
      const mockUid = '12345'
      ;(mockAdminAuth.createUser as jest.Mock).mockResolvedValueOnce({
        uid: mockUid,
      })

      // Mock Firestore set operation
      const mockSet = jest.fn().mockResolvedValueOnce(undefined)
      const mockDoc = jest.fn(() => ({ set: mockSet }))
      const mockCollection = jest.fn(() => ({ doc: mockDoc }))
      ;(mockAdminDb.collection as jest.Mock).mockImplementation(mockCollection)

      const authData = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      }

      const firestoreData = {
        name: 'Test',
        lastName: 'User',
        status: 'active',
        roles: ['USER'],
      }

      const createdBy = 'admin123'

      const uid = await authAdapter.createUser(
        authData,
        firestoreData,
        createdBy
      )

      expect(uid).toBe(mockUid)
      expect(mockAdminAuth.createUser).toHaveBeenCalledWith({
        email: authData.email,
        password: authData.password,
        displayName: authData.displayName,
      })
      expect(mockAdminDb.collection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith(mockUid)
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUid,
          name: 'Test',
          lastName: 'User',
          status: 'active',
          roles: ['USER'],
          createdBy: createdBy,
          updatedBy: createdBy,
        })
      )
    })

    it('should throw an AuthError if Firebase Authentication fails', async () => {
      ;(mockAdminAuth.createUser as jest.Mock).mockRejectedValueOnce(
        new Error('Firebase Error')
      )

      const authData = { email: 'test@example.com', password: 'password123' }
      const firestoreData = {
        name: 'Test',
        lastName: 'User',
        status: 'active',
        roles: [],
      }
      const createdBy = 'admin123'

      await expect(
        authAdapter.createUser(authData, firestoreData, createdBy)
      ).rejects.toThrow('Failed to create user')
    })
  })

  describe('AuthAdapter - updateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      authAdapter = new AuthAdapter()
    })

    it('should update a user in Firebase Authentication and Firestore', async () => {
      const mockUid = '12345'
      const mockSet = jest.fn().mockResolvedValueOnce(undefined)
      const mockUpdate = jest.fn().mockResolvedValueOnce(undefined)
      const mockDoc = jest.fn(() => ({ set: mockSet, update: mockUpdate }))
      const mockCollection = jest.fn(() => ({ doc: mockDoc }))
      ;(mockAdminDb.collection as jest.Mock).mockImplementation(mockCollection)
      ;(mockAdminAuth.updateUser as jest.Mock).mockResolvedValueOnce(undefined)

      const authData = {
        email: 'updated@example.com',
        displayName: 'Updated User',
      }

      const firestoreData = {
        status: 'updated',
        roles: ['ADMIN'],
      }

      const updatedBy = 'admin456'

      await authAdapter.updateUser(mockUid, authData, firestoreData, updatedBy)

      expect(mockAdminAuth.updateUser).toHaveBeenCalledWith(mockUid, {
        email: authData.email,
        displayName: authData.displayName,
      })
      expect(mockAdminDb.collection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith(mockUid)
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'updated',
          roles: ['ADMIN'],
          updatedBy: updatedBy,
        })
      )
    })

    it('should throw an AuthError if Firebase Authentication update fails', async () => {
      ;(mockAdminAuth.updateUser as jest.Mock).mockRejectedValueOnce(
        new Error('Firebase Error')
      )

      const uid = '12345'
      const authData = { email: 'new-email@example.com' }
      const firestoreData = { roles: ['ADMIN'] }
      const updatedBy = 'admin456'

      await expect(
        authAdapter.updateUser(uid, authData, firestoreData, updatedBy)
      ).rejects.toThrow('Failed to update user')
    })
  })

  describe('AuthAdapter - deleteUser', () => {
    it('should soft delete a user by disabling in Firebase Authentication and marking deleted in Firestore', async () => {
      const mockUid = '12345'
      const mockSet = jest.fn().mockResolvedValueOnce(undefined)
      const mockDoc = jest.fn(() => ({ set: mockSet }))
      const mockCollection = jest.fn(() => ({ doc: mockDoc }))
      ;(mockAdminDb.collection as jest.Mock).mockImplementation(mockCollection)
      ;(mockAdminAuth.updateUser as jest.Mock).mockResolvedValueOnce(undefined)

      const deletedBy = 'admin789'

      await authAdapter.deleteUser(mockUid, deletedBy)

      expect(mockAdminAuth.updateUser).toHaveBeenCalledWith(mockUid, {
        disabled: true,
      })
      expect(mockAdminDb.collection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith(mockUid)
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'deleted',
          updatedBy: deletedBy,
        }),
        { merge: true }
      )
    })

    it('should throw an AuthError if Firebase Authentication delete fails', async () => {
      ;(mockAdminAuth.updateUser as jest.Mock).mockRejectedValueOnce(
        new Error('Firebase Error')
      )

      const uid = '12345'
      const deletedBy = 'admin789'

      await expect(authAdapter.deleteUser(uid, deletedBy)).rejects.toThrow(
        'Failed to delete user'
      )
    })
  })
})
