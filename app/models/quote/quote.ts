// models/quote/quote.ts

import type { BaseEntity } from '../base.entity'

export interface Quote extends BaseEntity {
  quoteNumber: string
  clientId: string
  clientName: string
  type: string
  expiresAt: string
  premium: number
  coverage: number
  insuranceCompany: string
  agent: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted'
}
