// utils/mockData/generators/claimGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import type { Claim } from '@/models/claim/claim'
import { CLAIM_TYPES } from '../types'
import { BaseMockGenerator } from './baseGenerator'

export class ClaimGenerator extends BaseMockGenerator {
  generate(count: number): Claim[] {
    return Array.from({ length: count }, () => {
      return {
        id: uuidv4(),
        claimNumber: this.generateRandomString('CLA'),
        policyId: uuidv4(),
        policyNumber: this.generateRandomString('POL'),
        clientId: uuidv4(),
        clientName: 'John Doe',
        type: this.getRandomElement(CLAIM_TYPES),
        description: 'Description of the claim',
        amount: this.getRandomNumber(100, 1000),
        dateOfIncident: this.getRandomDate(
          new Date(2020, 0, 1),
          new Date()
        ) as string,
        dateSubmitted: this.getRandomDate(
          new Date(2020, 0, 1),
          new Date()
        ) as string,
        dateResolved: this.getRandomDate(
          new Date(2020, 0, 1),
          new Date()
        ) as string,
        adjuster: 'Adjuster Name',
        status: this.getRandomElement([
          'new',
          'in_progress',
          'pending_info',
          'approved',
          'rejected',
          'closed',
        ]),
        documents: [],
        createdAt: this.getRandomDate(
          new Date(2020, 0, 1),
          new Date(),
          true
        ) as Date,
        updatedAt: this.getRandomDate(
          new Date(2020, 0, 1),
          new Date(),
          true
        ) as Date,
        createdBy: uuidv4(),
        updatedBy: uuidv4(),
      }
    })
  }
}
