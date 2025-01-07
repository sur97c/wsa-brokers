// utils/mockData/generators/userGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import { SectionRole, UserRole } from '@/models/user/roles'
import type { UserProfile } from '@/models/user/user'
import { BaseMockGenerator } from './baseGenerator'

export class UserGenerator extends BaseMockGenerator {
  private readonly firstNames = [
    'José',
    'María',
    'Juan',
    'Miguel',
    'Carlos',
    'Francisco',
    'Jorge',
    'Ricardo',
    'Manuel',
    'Javier',
    'Ana',
    'Guadalupe',
    'Mariana',
    'Isabel',
    'Patricia',
    'Fernanda',
    'Alejandra',
    'Rosa',
    'Lucía',
    'Adriana',
  ]

  private readonly paternalLastNames = [
    'García',
    'López',
    'Martínez',
    'Rodríguez',
    'González',
    'Hernández',
    'Pérez',
    'Sánchez',
    'Ramírez',
    'Torres',
    'Flores',
    'Rivera',
    'Morales',
    'Jiménez',
    'Reyes',
    'Vázquez',
    'Cruz',
    'Moreno',
    'Ortiz',
    'Castillo',
  ]

  // Add this utility function at the top of the file
  private normalizeSpanishText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[ñÑ]/g, 'n') // Replace ñ with n
  }

  generate(count: number): UserProfile[] {
    return Array.from({ length: count }, () => {
      const firstName = this.getRandomElement(this.firstNames)
      const lastName = this.getRandomElement(this.paternalLastNames)

      return {
        id: uuidv4(),
        uid: uuidv4(),
        email: this.normalizeSpanishText(
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ejemplo.com`
        ),
        emailVerified: Math.random() > 0.2,
        displayName: `${firstName} ${lastName}`,
        name: firstName,
        lastName,
        role: this.getRandomElement(['admin', 'agent', 'supervisor', 'user']),
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
        lastSignInTime: new Date().toISOString(),
        status: this.getRandomElement(['active', 'inactive']),
        primaryRole: this.getRandomElement(Object.values(UserRole)),
        sectionRoles: [
          this.getRandomElement(Object.values(SectionRole)),
          this.getRandomElement(Object.values(SectionRole)),
          this.getRandomElement(Object.values(SectionRole)),
        ],
        isOnline: Math.random() > 0.5,
        blocked: Math.random() > 0.8,
        disabled: Math.random() > 0.8,
        deleted: Math.random() > 0.8,
        allowMultipleSessions: Math.random() > 0.8,
        activeSessions: Math.floor(Math.random() * 5),
        totalHistoricalSessions: Math.floor(Math.random() * 20),
      }
    })
  }
}
