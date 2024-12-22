import '@testing-library/jest-dom'
import { jest } from '@jest/globals'

// Configuración global de Jest
global.jest = jest

const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(() => null as string | null),
}
global.localStorage = localStorageMock

const sessionStorageMock = {
  getItem: jest.fn(() => null as string | null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(() => null as string | null),
}
global.sessionStorage = sessionStorageMock

type MockResponse = {
  json: () => Promise<{}>
  headers: Headers
  ok: true
  redirected: false
  status: number
  statusText: string
  type: 'basic'
  url: string
  clone: jest.Mock
  body: null
  bodyUsed: false
  arrayBuffer: jest.Mock
  blob: jest.Mock
  formData: jest.Mock
  text: jest.Mock
  bytes?: () => Promise<Uint8Array>
}
