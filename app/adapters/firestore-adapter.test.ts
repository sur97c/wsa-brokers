// File: app/adapters/firestore-adapter.test.ts

import {
  FirestoreAdapter,
  createFirestoreAdapter,
  DocumentNotFoundError,
} from './firestore-adapter'
import {
  Firestore,
  type CollectionReference,
  type DocumentData,
} from 'firebase-admin/firestore'

type MockDocumentReference = {
  set: jest.Mock
  update: jest.Mock
  delete: jest.Mock
}

type MockCollectionReference = CollectionReference<DocumentData> & {
  doc: jest.Mock<MockDocumentReference>
  get: jest.Mock<Promise<{ exists: boolean; data: jest.Mock }>>
}

describe('FirestoreAdapter', () => {
  let mockClientDb: jest.Mocked<Partial<Firestore>>
  let adapter: FirestoreAdapter<{ id: string; name: string }>

  beforeEach(() => {
    jest.clearAllMocks()

    const mockDoc = {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    const mockCollection: MockCollectionReference = {
      doc: jest.fn(() => mockDoc),
      get: jest.fn(() => Promise.resolve({ exists: true, data: jest.fn() })),
    } as unknown as MockCollectionReference

    mockClientDb = {
      collection: jest.fn((collectionPath: string) => {
        if (collectionPath === 'testCollection') {
          return mockCollection
        }
        return mockCollection
      }),
    }

    adapter = createFirestoreAdapter('testCollection', false)
  })

  describe('getDocumentById', () => {
    it('should return a document if it exists', async () => {
      const mockDocSnapshot = {
        exists: true,
        data: jest.fn(() => ({ id: 'doc1', name: 'Test Document' })),
      }

      const mockDoc = mockClientDb.collection!('testCollection').doc!('doc1')
      ;(mockDoc.get as jest.Mock).mockResolvedValue(mockDocSnapshot)

      const result = await adapter.getDocumentById('doc1')
      expect(result).toEqual({ id: 'doc1', name: 'Test Document' })
    })

    it('should throw DocumentNotFoundError if document does not exist', async () => {
      const mockDocSnapshot = { exists: false }

      const mockDoc = mockClientDb.collection!('testCollection').doc!('doc1')
      ;(mockDoc.get as jest.Mock).mockResolvedValue(mockDocSnapshot)

      await expect(adapter.getDocumentById('doc1')).rejects.toThrow(
        DocumentNotFoundError
      )
    })
  })

  describe('createDocument', () => {
    it('should create a document successfully', async () => {
      const mockDoc = mockClientDb.collection!('testCollection').doc!('doc1')
      ;(mockDoc.set as jest.Mock).mockResolvedValue(undefined)

      await adapter.createDocument('doc1', { id: 'doc1', name: 'New Document' })
      expect(mockDoc.set).toHaveBeenCalledWith({
        id: 'doc1',
        name: 'New Document',
      })
    })
  })

  describe('updateDocument', () => {
    it('should update a document successfully', async () => {
      const mockDoc = mockClientDb.collection!('testCollection').doc!('doc1')
      ;(mockDoc.update as jest.Mock).mockResolvedValue(undefined)

      await adapter.updateDocument('doc1', { name: 'Updated Document' })
      expect(mockDoc.update).toHaveBeenCalledWith({ name: 'Updated Document' })
    })
  })

  describe('deleteDocument', () => {
    it('should delete a document successfully', async () => {
      const mockDoc = mockClientDb.collection!('testCollection').doc!('doc1')
      ;(mockDoc.delete as jest.Mock).mockResolvedValue(undefined)

      await adapter.deleteDocument('doc1')
      expect(mockDoc.delete).toHaveBeenCalled()
    })
  })

  describe('getAllDocuments', () => {
    it('should return all documents in a collection', async () => {
      const mockDocs = [
        {
          id: 'doc1',
          data: jest.fn(() => ({ id: 'doc1', name: 'Document 1' })),
        },
        {
          id: 'doc2',
          data: jest.fn(() => ({ id: 'doc2', name: 'Document 2' })),
        },
      ]

      const mockCollection = mockClientDb.collection!('testCollection')!
      ;(mockCollection.get as jest.Mock).mockResolvedValue({ docs: mockDocs })

      const result = await adapter.getAllDocuments()
      expect(result).toEqual([
        { id: 'doc1', name: 'Document 1' },
        { id: 'doc2', name: 'Document 2' },
      ])
    })
  })
})
