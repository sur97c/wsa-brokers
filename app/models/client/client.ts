// models/client/client.ts

import type { BaseEntity } from '../base.entity'

export interface Client extends BaseEntity {
  clientNumber: string
  name: string
  lastName: string
  maternalLastName: string
  email: string
  phone: string
  address: string
  colony: string
  city: string
  state: string
  zipCode: string
  rfc: string
  curp: string
  birthDate: string
  gender: 'M' | 'F' | 'O'
  occupation: string
  status: 'active' | 'inactive'
}
