// app/components/dynamic-form/DynamicForm.tsx

import React, { useState } from 'react'

import { CheckboxGroup } from './fields/CheckboxGroup'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import {
  FieldConfig,
  DynamicFormProps,
  type TextFieldValue,
  type SelectFieldValue,
  type CheckboxGroupValue,
  type TextFieldConfig,
  type SelectFieldConfig,
  type CheckboxGroupConfig,
} from './types/formTypes'
import { validateCheckboxGroup } from './validations/CheckboxGroupValidations'
import { validateSelectField } from './validations/SelectFieldValidations'
import { validateTextField } from './validations/TextFieldValidations'

type ValidatorType<T extends FieldConfig, V> = (
  field: T,
  value: V
) => Promise<string | null>

const fieldValidators: {
  text: ValidatorType<TextFieldConfig, TextFieldValue>
  select: ValidatorType<SelectFieldConfig, SelectFieldValue>
  checkboxGroup: ValidatorType<CheckboxGroupConfig, CheckboxGroupValue>
} = {
  text: validateTextField,
  select: validateSelectField,
  checkboxGroup: validateCheckboxGroup,
}

interface TextFieldProps {
  field: TextFieldConfig
  value: string // Aquí está la clave, TextField espera específicamente string
  onChange: (value: string) => void
  containerStyle?: string
  componentStyle?: string
}

interface SelectFieldProps {
  field: SelectFieldConfig
  value: SelectFieldValue
  onChange: (value: SelectFieldValue) => void
  containerStyle?: string
  componentStyle?: string
}

interface CheckboxGroupProps {
  field: CheckboxGroupConfig
  value: CheckboxGroupValue
  onChange: (value: CheckboxGroupValue) => void
  containerStyle?: string
  componentStyle?: string
}

const fieldComponents: {
  text: React.FC<TextFieldProps>
  select: React.FC<SelectFieldProps>
  checkboxGroup: React.FC<CheckboxGroupProps>
} = {
  text: TextField,
  select: SelectField,
  checkboxGroup: CheckboxGroup,
}

export const DynamicForm = <
  T extends Record<
    string,
    TextFieldValue | SelectFieldValue | CheckboxGroupValue
  >,
>({
  title,
  successMessage,
  errorMessage,
  className,
  fieldStyles,
  fields,
  grid = { columns: 12, gap: '1rem' },
  initialData,
  onSubmit,
  submitButtonCaption = 'Submit',
  onCancel,
  cancelButtonCaption = 'Cancel',
}: DynamicFormProps<T>) => {
  const fieldDefaultValues: Partial<Record<FieldConfig['type'], unknown>> = {
    text: '',
    select: null,
    checkboxGroup: [],
  }

  const [formData, setFormData] = useState<T>(() => {
    if (initialData) {
      return initialData as T
    }
    const defaultValues: Partial<T> = {}

    fields.forEach(({ fieldConfig }) => {
      if (
        fieldConfig.name &&
        fieldDefaultValues[fieldConfig.type] !== undefined
      ) {
        defaultValues[fieldConfig.name as keyof T] = fieldDefaultValues[
          fieldConfig.type
        ] as T[keyof T]
      } else {
        defaultValues[fieldConfig.name as keyof T] =
          null as unknown as T[keyof T]
      }
    })

    return defaultValues as T
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasSubmissionError, setHasSubmissionError] = useState(false)
  const [showErrorDetails, setShowErrorDetails] = useState(false)

  const handleFieldChange = (
    name: string,
    value: TextFieldValue | SelectFieldValue | CheckboxGroupValue
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string | null> = {}

    for (const { fieldConfig } of fields) {
      const validator = fieldValidators[fieldConfig.type]
      if (validator) {
        const validationError = await (
          validator as ValidatorType<typeof fieldConfig, unknown>
        )(fieldConfig, formData[fieldConfig.name as keyof T])
        if (validationError) {
          newErrors[fieldConfig.name] = validationError
        }
      }
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = await validateForm()
    if (isValid) {
      try {
        onSubmit(formData)
        setIsSubmitted(true)
        setHasSubmissionError(false)
      } catch {
        setHasSubmissionError(true)
      }
    } else {
      setHasSubmissionError(true)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative grid gap-${grid.gap} ${className} grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-${grid.columns}`}
    >
      {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
      {isSubmitted && successMessage && (
        <div className="text-green-500 text-sm mb-4">{successMessage}</div>
      )}
      {hasSubmissionError && errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-full"
            onClick={() => setShowErrorDetails((prev) => !prev)}
          >
            {Object.keys(errors).length} Errors
          </button>
          {showErrorDetails && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-md border border-gray-300 rounded-lg p-4">
              <h4 className="text-sm font-bold mb-2">Error Details:</h4>
              <ul className="text-sm text-red-500">
                {Object.entries(errors).map(
                  ([field, error]) =>
                    error && <li key={field}>{`${field}: ${error}`}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
      {fields.map(({ fieldConfig, layout }) => {
        switch (fieldConfig.type) {
          case 'text': {
            const Component = fieldComponents.text
            return (
              <div
                key={fieldConfig.name}
                className={`col-span-${layout?.colspan || 1} row-span-${layout?.rowspan || 1}`}
              >
                <Component
                  field={fieldConfig}
                  value={String(formData[fieldConfig.name as keyof T])} // Convertimos a string
                  onChange={(
                    value: string // Especificamos que el value es string
                  ) => handleFieldChange(fieldConfig.name, value)}
                  containerStyle={
                    fieldStyles?.containerStyles?.[fieldConfig.name] || ''
                  }
                  componentStyle={
                    fieldStyles?.componentStyles?.[fieldConfig.name] || ''
                  }
                />
              </div>
            )
          }
          case 'select': {
            const Component = fieldComponents.select
            const fieldValue = formData[
              fieldConfig.name as keyof T
            ] as SelectFieldValue // Cast explícito al tipo correcto

            return (
              <div
                key={fieldConfig.name}
                className={`col-span-${layout?.colspan || 1} row-span-${layout?.rowspan || 1}`}
              >
                <Component
                  field={fieldConfig}
                  value={fieldValue}
                  onChange={(value: SelectFieldValue) =>
                    handleFieldChange(fieldConfig.name, value)
                  }
                  containerStyle={
                    fieldStyles?.containerStyles?.[fieldConfig.name] || ''
                  }
                  componentStyle={
                    fieldStyles?.componentStyles?.[fieldConfig.name] || ''
                  }
                />
              </div>
            )
          }
          case 'checkboxGroup': {
            const Component = fieldComponents.checkboxGroup
            const fieldValue = formData[
              fieldConfig.name as keyof T
            ] as CheckboxGroupValue // Cast explícito al tipo correcto
            return (
              <div
                key={fieldConfig.name}
                className={`col-span-${layout?.colspan || 1} row-span-${layout?.rowspan || 1}`}
              >
                <Component
                  field={fieldConfig}
                  value={fieldValue}
                  onChange={(value: CheckboxGroupValue) =>
                    handleFieldChange(fieldConfig.name, value)
                  }
                  containerStyle={
                    fieldStyles?.containerStyles?.[fieldConfig.name] || ''
                  }
                  componentStyle={
                    fieldStyles?.componentStyles?.[fieldConfig.name] || ''
                  }
                />
              </div>
            )
          }
          default:
            return null
        }
      })}
      <div className="col-span-12">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {submitButtonCaption}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            {cancelButtonCaption}
          </button>
        )}
      </div>
    </form>
  )
}
