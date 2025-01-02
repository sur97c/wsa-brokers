// app/translations/en/core/validation.ts

import { ValidationTranslations } from '@/translations/types/core/validation'

export const validationEN: ValidationTranslations = {
  required: 'This field is required',
  invalidEmail: 'Email address is not valid',
  minLength: 'Must be at least {{count}} characters',
  maxLength: 'Must not exceed {{count}} characters',
  invalidFormat: 'Invalid format',
  passwordMismatch: 'Passwords do not match',
  uniqueValue: 'This value already exists',
  invalidNumber: 'Must be a valid number',
  invalidDate: 'Invalid date',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
}
