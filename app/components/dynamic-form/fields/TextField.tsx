// app/components/dynamic-form/fields/TextField.tsx

import React, { useState } from 'react'

import { TextFieldConfig } from '../types/formTypes'
import { validateTextField } from '../validations/TextFieldValidations'

interface TextFieldProps {
  field: TextFieldConfig
  value: string
  onChange: (value: string) => void
  error?: string
  containerStyle?: string // Add custom styles for container
  componentStyle?: string // Add custom styles for input component
}

export const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  onChange,
  error,
  containerStyle,
  componentStyle,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null)

  const handleBlur = async () => {
    const validationError = await validateTextField(field, value)
    setInternalError(validationError)
  }

  return (
    <div className={`mb-4 ${containerStyle || ''}`}>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          disabled={field.disabled}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            componentStyle || ''
          }`}
        />
        {field.rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {field.rightElement}
          </div>
        )}
      </div>
      {error || internalError ? (
        <span className="text-red-500 text-xs">{error || internalError}</span>
      ) : null}
    </div>
  )
}
