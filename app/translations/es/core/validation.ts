// app/translations/es/core/validation.ts

import { ValidationTranslations } from '@/translations/types/core/validation'

export const validationES: ValidationTranslations = {
  required: 'Este campo es requerido',
  invalidEmail: 'El correo electrónico no es válido',
  minLength: 'Debe tener al menos {{count}} caracteres',
  maxLength: 'No debe exceder {{count}} caracteres',
  invalidFormat: 'El formato no es válido',
  passwordMismatch: 'Las contraseñas no coinciden',
  uniqueValue: 'Este valor ya existe',
  invalidNumber: 'Debe ser un número válido',
  invalidDate: 'La fecha no es válida',
  futureDate: 'La fecha debe ser futura',
  pastDate: 'La fecha debe ser pasada',
}
