// models/BaseEntity.ts

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt?: Date
  createdBy: string
  updatedBy: string
}
