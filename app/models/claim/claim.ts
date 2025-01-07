// models/claims/claim.ts

import type { BaseEntity } from '../base.entity'

export interface DocumentType {
  name: string
  url: string
  type: string
  size: number
  lastModified: string
  description: string
  tags: string[]
  metadata: Record<string, unknown>
}

export interface Claim extends BaseEntity {
  claimNumber: string
  policyId: string
  policyNumber: string
  clientId: string
  clientName: string
  type: string
  description: string
  amount: number
  dateOfIncident: string
  dateSubmitted: string
  dateResolved?: string
  adjuster?: string
  status:
    | 'new'
    | 'in_progress'
    | 'pending_info'
    | 'approved'
    | 'rejected'
    | 'closed'
  documents: DocumentType[]
}
