import { adminFirestore } from './admin'

jest.mock('./admin', () => require('../../__mocks__/firebase/admin'))

describe('Firebase Admin', () => {
    it('should fetch data from Firestore collection', async () => {
        const snapshot = await adminFirestore.collection('test').get()
        const data = snapshot.docs.map(doc => doc.data())

        expect(adminFirestore.collection).toHaveBeenCalledWith('test')
        expect(data).toEqual([
            { name: 'Mocked Item 1' },
            { name: 'Mocked Item 2' },
        ])
    })

    it('should fetch data from Firestore document', async () => {
        const doc = adminFirestore.collection('test').doc('mocked-id')
        const snapshot = await doc.get()

        expect(adminFirestore.collection).toHaveBeenCalledWith('test')
        expect(doc.get).toHaveBeenCalled()
        expect(snapshot.exists).toBe(true)
        expect(snapshot.data()).toEqual({ name: 'Mocked Item' })
    })

    it('should add data to Firestore document', async () => {
        const doc = adminFirestore.collection('test').doc('mocked-id')
        const result = await doc.set({ name: 'New Mocked Item' })

        expect(adminFirestore.collection).toHaveBeenCalledWith('test')
        expect(doc.set).toHaveBeenCalledWith({ name: 'New Mocked Item' })
        expect(result).toEqual({ id: 'mocked-id', name: 'New Mocked Item' })
    })
})
