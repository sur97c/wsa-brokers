// File: app/adapters/firestore/firestore-adapter.ts

import {
  CollectionReference,
  FirestoreDataConverter,
  DocumentReference,
  type QueryDocumentSnapshot,
  type Firestore,
  type DocumentData,
} from 'firebase-admin/firestore'
import { adminDb } from '@/firebase/firebase.admin'
import { db as clientDb } from '@/firebase/firebase.client'

/**
 * Base type for Firestore documents, ensuring the presence of an `id` field.
 */
interface FirestoreDocument {
  id: string
}

/**
 * Custom error classes for Firestore operations.
 */
export class FirestoreError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FirestoreError'
  }
}

export class DocumentNotFoundError extends FirestoreError {
  constructor(documentId: string, collectionName: string) {
    super(
      `Document with ID '${documentId}' not found in collection '${collectionName}'.`
    )
    this.name = 'DocumentNotFoundError'
  }
}

/**
 * Generic Firestore data converter for type-safe transformations.
 */
const createConverter = <
  T extends FirestoreDocument,
>(): FirestoreDataConverter<T> => ({
  toFirestore(data: T): DocumentData {
    const { ...rest } = data
    return rest
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): T {
    return { id: snapshot.id, ...snapshot.data() } as T
  },
})

export class FirestoreAdapter<T extends FirestoreDocument> {
  private db: Firestore
  private collectionRef: CollectionReference<T>
  private isAdmin: boolean
  private collectionName: string

  constructor(collectionName: string, useAdmin: boolean = false) {
    this.isAdmin = useAdmin
    this.collectionName = collectionName
    this.db = useAdmin ? adminDb : (clientDb as unknown as Firestore)

    const collection = this.db.collection(collectionName)
    const converter = createConverter<T>()
    this.collectionRef = collection.withConverter(
      converter
    ) as CollectionReference<T>
  }

  /**
   * Centralized error handler for Firestore operations.
   * @param error - The error object.
   * @param operation - The name of the operation being performed.
   */
  private handleError(error: unknown, operation: string): never {
    if (error instanceof DocumentNotFoundError) {
      throw error
    }
    console.error(`Error during Firestore operation '${operation}':`, error)
    throw new FirestoreError(`Failed to perform '${operation}' operation.`)
  }

  async getDocumentById(documentId: string): Promise<T> {
    try {
      const docRef = this.collectionRef.doc(documentId)
      const snapshot = await docRef.get()

      if (!snapshot.exists) {
        throw new DocumentNotFoundError(documentId, this.collectionName)
      }

      return snapshot.data()!
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        throw error
      }
      return this.handleError(error, 'getDocumentById')
    }
  }

  async createDocument(documentId: string, data: T): Promise<void> {
    try {
      const docRef = this.collectionRef.doc(documentId)
      await docRef.set(data)
    } catch (error) {
      this.handleError(error, 'createDocument')
    }
  }

  async updateDocument(documentId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.collectionRef.doc(documentId)
      await docRef.update(data)
    } catch (error) {
      this.handleError(error, 'updateDocument')
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      const docRef = this.collectionRef.doc(documentId)
      await docRef.delete()
    } catch (error) {
      this.handleError(error, 'deleteDocument')
    }
  }

  async getAllDocuments(): Promise<T[]> {
    try {
      const snapshot = await this.collectionRef.get()
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      this.handleError(error, 'getAllDocuments')
    }
  }

  /**
   * Listen to changes in a specific document in real-time (only for client SDK).
   * @param documentId - The ID of the document to listen to.
   * @param onUpdate - Callback invoked on data changes.
   * @returns Function to stop listening.
   */
  onDocumentSnapshot(
    documentId: string,
    onUpdate: (data: T | null) => void
  ): () => void {
    if (this.isAdmin) {
      throw new FirestoreError(
        'onDocumentSnapshot is not supported in admin context. Use client context instead.'
      )
    }

    const docRef: DocumentReference<T> = this.collectionRef.doc(documentId)
    const unsubscribe = docRef.onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        onUpdate(null)
      } else {
        onUpdate(snapshot.data()!)
      }
    })
    return unsubscribe
  }

  /**
   * Listen to changes in a collection in real-time (only for client SDK).
   * @param onUpdate - Callback invoked on data changes.
   * @returns Function to stop listening.
   */
  onCollectionSnapshot(onUpdate: (data: T[]) => void): () => void {
    if (this.isAdmin) {
      throw new FirestoreError(
        'onCollectionSnapshot is not supported in admin context. Use client context instead.'
      )
    }

    const unsubscribe = this.collectionRef.onSnapshot((snapshot) => {
      const data: T[] = snapshot.docs.map((doc) => doc.data())
      onUpdate(data)
    })
    return unsubscribe
  }
}

/**
 * Factory function to create Firestore adapters based on context (client or admin).
 */
export const createFirestoreAdapter = <T extends FirestoreDocument>(
  collectionName: string,
  useAdmin: boolean = false
): FirestoreAdapter<T> => {
  return new FirestoreAdapter<T>(collectionName, useAdmin)
}
