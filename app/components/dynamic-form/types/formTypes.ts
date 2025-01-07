// app/components/dynamic-form/types/formTypes.ts

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: string | number
  message: string
  customValidators?: Array<
    (
      value: TextFieldValue | SelectFieldValue | CheckboxGroupValue
    ) => { result: boolean; message: string } | null
  >
  asyncValidators?: Array<
    (
      value: TextFieldValue | SelectFieldValue | CheckboxGroupValue
    ) => Promise<{ result: boolean; message: string } | null>
  >
}

export type TextFieldValue = string | number | boolean | Date
export type SelectFieldValue = string | number | readonly string[]
export type CheckboxGroupValue = string[] | number[] | boolean[]

export interface FormFieldLayoutConfig {
  row?: number
  column?: number
  colspan?: number
  rowspan?: number
}

export enum FormFieldType {
  TEXT = 'text',
  SELECT = 'select',
  CHECKBOX_GROUP = 'checkboxGroup',
}

export interface BaseFieldConfig {
  type: FormFieldType
  name: string
  label: string
  validations?: ValidationRule[]
  disabled?: boolean
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: FormFieldType.TEXT
  placeholder?: string
  rightElement?: React.ReactNode // Added to support additional content inside the field
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: FormFieldType.SELECT
  options: { key: string | number; label: string; value: SelectFieldValue }[]
  placeholder?: string
}

export interface CheckboxGroupConfig extends BaseFieldConfig {
  type: FormFieldType.CHECKBOX_GROUP
  options: { key: string | number; label: string; value: string | number }[]
}

export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | CheckboxGroupConfig

export type DynamicFormField = {
  fieldConfig: TextFieldConfig | SelectFieldConfig | CheckboxGroupConfig
  layout?: FormFieldLayoutConfig
}

export interface DynamicFormProps<
  T extends Record<
    string,
    TextFieldValue | SelectFieldValue | CheckboxGroupValue
  >,
> {
  title: string
  successMessage: string
  errorMessage: string
  className?: string
  fieldStyles?: {
    containerStyles?: Record<string, string> // Container styles per field
    componentStyles?: Record<string, string> // Component styles per field
  }
  fields: DynamicFormField[]
  grid: {
    columns: number
    gap: string
  }
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  submitButtonCaption: string
  onCancel?: () => void
  cancelButtonCaption: string
}
