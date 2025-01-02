// app/translations/types/modules/table.ts

export interface TableTranslationBase {
  columns: Record<string, string>
  editCreate: {
    fields: Record<string, string>
    dropDowns: Record<string, Record<string, string>>
    edit: {
      title: string
      successMessage: string
      errorMessage: string
    }
    create: {
      title: string
      successMessage: string
      errorMessage: string
    }
    buttons: {
      save: string
      cancel: string
    }
  }
  rowOptions?: Record<string, string>
  tableOptions?: Record<string, string>
}
