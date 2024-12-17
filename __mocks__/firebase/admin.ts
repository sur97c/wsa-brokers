export const adminFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => ({
        exists: true,
        data: () => ({ name: 'Mocked Item' }),
      })),
      set: jest.fn((data) => Promise.resolve({ id: 'mocked-id', ...data })),
    })),
    get: jest.fn(() => ({
      docs: [
        { id: '1', data: () => ({ name: 'Mocked Item 1' }) },
        { id: '2', data: () => ({ name: 'Mocked Item 2' }) },
      ],
    })),
  })),
}
