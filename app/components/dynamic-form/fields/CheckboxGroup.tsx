// app/components/dynamic-form/fields/CheckboxGroup.tsx

import React, { useState } from 'react'

import {
  CheckboxGroupConfig,
  type CheckboxGroupValue,
} from '../types/formTypes'
import { validateCheckboxGroup } from '../validations/CheckboxGroupValidations'

interface CheckboxGroupProps {
  field: CheckboxGroupConfig
  value: CheckboxGroupValue
  onChange: (value: CheckboxGroupValue) => void
  error?: string
  containerStyle?: string // Custom styles for the container
  componentStyle?: string // Add custom styles for input component
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  field,
  value,
  onChange,
  error,
  containerStyle,
  componentStyle,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null)

  const handleBlur = async () => {
    const validationError = await validateCheckboxGroup(field, value)
    setInternalError(validationError)
  }

  const handleCheckboxChange = (checkedValue: string | number) => {
    const newValue = Array.isArray(value)
      ? (value as Array<string | number>).includes(checkedValue)
        ? (value as Array<string | number>).filter((v) => v !== checkedValue) // Remove if already selected
        : [...(value as Array<string | number>), checkedValue] // Add if not selected
      : [checkedValue] // Initialize array if value is not an array

    onChange(newValue as CheckboxGroupValue)
  }

  return (
    <div className={`mb-4 ${containerStyle || ''}`}>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="mt-2 space-y-2">
        {field.options.map((option) => (
          <label
            key={option.key}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              value={
                option.value !== null && option.value !== undefined
                  ? String(option.value)
                  : ''
              }
              checked={
                Array.isArray(value) &&
                (value as Array<string | number>).includes(option.value)
              }
              onChange={() => handleCheckboxChange(option.value)}
              onBlur={handleBlur}
              disabled={field.disabled}
              className={`h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" sm:text-sm ${
                componentStyle || ''
              }`}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error || internalError ? (
        <span className="text-red-500 text-xs">{error || internalError}</span>
      ) : null}
    </div>
  )
}
