// app/validations/SelectFieldValidations.ts

import { SelectFieldValue, SelectFieldConfig } from '../types/formTypes'

export const validateSelectField = async (
  field: SelectFieldConfig,
  value: SelectFieldValue
): Promise<string | null> => {
  if (!field.validations) return null

  for (const validation of field.validations) {
    switch (validation.type) {
      case 'required':
        if (!value || value === '') {
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
