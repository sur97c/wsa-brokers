const noopStorage = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: async (_key: string): Promise<string | null> => {
    // key is not used
    return null
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem: async (_key: string, _value: string): Promise<void> => {
    // key and value are not used
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (_key: string): Promise<void> => {
    // key is not used
  },
}

export default noopStorage
