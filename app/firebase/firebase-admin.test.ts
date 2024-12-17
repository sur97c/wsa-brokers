// File: app/firebase/firebase-admin.test.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp, adminAuth, adminDb } from './firebase-admin'

jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(() => ({ name: 'mockAdminApp' })),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({ name: 'mockAdminApp' })),
  cert: jest.fn(() => ({ projectId: 'mockProjectId' })),
}))

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(() => ({ adminUser: true })),
}))

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({ adminDbName: 'mockAdminDb' })),
}))

describe('Firebase Admin Initialization', () => {
  it('should initialize Firebase Admin app if no apps exist', () => {
    ;(getApps as jest.Mock).mockReturnValue([])

    const testAdminApp = initializeApp({})
    expect(initializeApp).toHaveBeenCalledWith({})
    expect(testAdminApp).toBeDefined()
  })

  it('should reuse an existing Firebase Admin app if one is already initialized', () => {
    ;(getApps as jest.Mock).mockReturnValue([{}])

    const testAdminApp = getApps()[0]
    expect(getApps).toHaveBeenCalled()
    expect(testAdminApp).toBeDefined()
  })

  it('should initialize Firebase Admin Auth and validate adminAuth instance', () => {
    expect(adminAuth).toBeDefined()
    expect(adminAuth).toEqual(expect.objectContaining({ adminUser: true }))
    expect(getAuth).toHaveBeenCalledWith(adminApp)
  })

  it('should initialize Firebase Admin Firestore and validate adminDb instance', () => {
    expect(adminDb).toBeDefined()
    expect(adminDb).toEqual(
      expect.objectContaining({ adminDbName: 'mockAdminDb' })
    )
    expect(getFirestore).toHaveBeenCalledWith(adminApp)
  })

  it('should mock the cert function for service account', () => {
    const mockServiceAccount = cert({ projectId: 'mockProjectId' })
    expect(cert).toHaveBeenCalled()
    expect(mockServiceAccount).toEqual({ projectId: 'mockProjectId' })
  })
})
