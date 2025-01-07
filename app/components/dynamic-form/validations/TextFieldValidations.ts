// app/validations/TextFieldValidations.ts

import { TextFieldValue, TextFieldConfig } from '../types/formTypes'

export const validateTextField = async (
  field: TextFieldConfig,
  value: TextFieldValue
): Promise<string | null> => {
  if (!field.validations) return null

  for (const validation of field.validations) {
    switch (validation.type) {
      case 'required':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return validation.message
        }
        break

      case 'email':
        if (
          value &&
          typeof value === 'string' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          return validation.message
        }
        break

      case 'minLength':
        if (
          value &&
          typeof value === 'string' &&
          value.length < (validation.value as number)
        ) {
          return validation.message
        }
        break

      case 'maxLength':
        if (
          value &&
          typeof value === 'string' &&
          value.length > (validation.value as number)
        ) {
          return validation.message
        }
        break

      case 'pattern':
        if (
          value &&
          typeof value === 'string' &&
          validation.value &&
          !new RegExp(validation.value.toString()).test(value)
        ) {
          return validation.message
        }
        break

      case 'custom':
        if (Array.isArray(validation.customValidators)) {
          for (const customValidator of validation.customValidators) {
            const result = customValidator(value)
            if (result && !result.result) {
              return result.message
            }
          }
        }
        if (Array.isArray(validation.asyncValidators)) {
          for (const asyncValidator of validation.asyncValidators) {
            const result = await asyncValidator(value)
            if (result && !result.result) {
              return result.message
            }
          }
        }
        break
    }
  }

  return null
}
