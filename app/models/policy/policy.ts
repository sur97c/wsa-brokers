// models/policy/policy.ts

import type { BaseEntity } from '../base.entity'

export interface Policy extends BaseEntity {
  policyNumber: string
  clientId: string
  clientName: string
  type: string
  startDate: string
  endDate: string
  premium: number
  coverage: number
  paymentFrequency: 'monthly' | 'quarterly' | 'annually'
  insuranceCompany: string
  status: 'active' | 'pending' | 'cancelled' | 'expired'
}
