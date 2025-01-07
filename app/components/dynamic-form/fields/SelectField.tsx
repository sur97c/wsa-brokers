// app/components/dynamic-form/fields/SelectField.tsx

import React, { useState } from 'react'

import { SelectFieldConfig, type SelectFieldValue } from '../types/formTypes'
import { validateSelectField } from '../validations/SelectFieldValidations'

interface SelectFieldProps {
  field: SelectFieldConfig
  value: SelectFieldValue
  onChange: (value: SelectFieldValue) => void
  error?: string
  containerStyle?: string // Add custom styles for container
  componentStyle?: string // Add custom styles for input component
}

export const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  onChange,
  error,
  containerStyle,
  componentStyle,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null)

  const handleBlur = async () => {
    const validationError = await validateSelectField(field, value)
    setInternalError(validationError)
  }

  return (
    <div className={`mb-4 ${containerStyle || ''}`}>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="relative">
        <select
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={field.disabled}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            componentStyle || ''
          }`}
        >
          <option value="" disabled>
            {field.placeholder || 'Select an option'}
          </option>
          {field.options.map((option) => (
            <option
              key={option.key}
              value={
                option.value !== null && option.value !== undefined
                  ? String(option.value)
                  : ''
              }
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error || internalError ? (
        <span className="text-red-500 text-xs">{error || internalError}</span>
      ) : null}
    </div>
  )
}
