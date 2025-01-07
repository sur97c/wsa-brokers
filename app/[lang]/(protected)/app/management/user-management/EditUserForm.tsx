// app/[lang]/(protected)/management/user-management/EditUserForm.tsx

import React, { useMemo } from 'react'

import { DynamicForm } from '@/components/dynamic-form/DynamicForm'
import {
  FormFieldType,
  type DynamicFormField,
} from '@/components/dynamic-form/types/formTypes'
import { UserRole, SectionRole, RoleAccess } from '@/models/user/roles'
import { UserProfile } from '@/models/user/user'
import { useTranslations } from '@/translations/hooks/useTranslations'

interface EditUserFormProps {
  user?: UserProfile
  currentUserRole: UserRole
  onClose: () => void
  onSave: (userData: Partial<UserProfile>) => Promise<void>
}

export const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  currentUserRole,
  onClose,
  onSave,
}) => {
  const { t, translations } = useTranslations()

  const initialData = {
    email: user?.email || '',
    displayName: user?.displayName || '',
    primaryRole: user?.primaryRole || UserRole.CLIENT,
    sectionRoles: user?.sectionRoles || [],
    specialPermissions: [
      user?.allowMultipleSessions ?? false,
      user?.blocked ?? false,
      user?.disabled ?? false,
    ],
  }

  // const userRoleInfo =
  //   translations.core.roles.userRoles[user?.primaryRole || UserRole.CLIENT]

  const fields: DynamicFormField[] = useMemo(
    () => [
      // Datos básicos
      {
        fieldConfig: {
          type: FormFieldType.TEXT,
          name: 'email',
          label: t(translations.modules.management.users.fields.email),
          validations: [
            {
              type: 'required',
              message: t(translations.core.validation.required),
            },
            {
              type: 'email',
              message: t(translations.core.validation.invalidEmail),
            },
            {
              type: 'custom',
              message: t(translations.core.validation.emailExists),
              asyncValidators: [
                async (value) => {
                  // Solo validar si el email cambió
                  if (user?.email === value)
                    return { result: true, message: '' }

                  // Implementar verificación de email existente
                  const exists = false // TODO: await checkEmailExists(value as string)
                  return {
                    result: !exists,
                    message: t(translations.core.validation.emailExists),
                  }
                },
              ],
            },
          ],
        },
        layout: { colspan: 6 },
      },
      {
        fieldConfig: {
          type: FormFieldType.TEXT,
          name: 'displayName',
          label: t(translations.modules.management.users.fields.displayName),
          validations: [
            {
              type: 'required',
              message: t(translations.core.validation.required),
            },
          ],
        },
        layout: { colspan: 6 },
      },
      // Rol Principal
      {
        fieldConfig: {
          type: FormFieldType.SELECT,
          name: 'primaryRole',
          label: t(translations.modules.management.users.fields.primaryRole),
          options: Object.values(UserRole)
            .filter((role) => canAssignRole(currentUserRole, role))
            .map((role) => ({
              key: role,
              value: role,
              label: t(translations.core.roles.userRoles[role].name),
            })),
          validations: [
            {
              type: 'required',
              message: t(translations.core.validation.required),
            },
          ],
        },
        layout: { colspan: 6 },
      },
      // Roles de Sección
      {
        fieldConfig: {
          type: FormFieldType.CHECKBOX_GROUP,
          name: 'sectionRoles',
          label: t(translations.modules.management.users.fields.sectionRoles),
          options: getAvailableSectionRoles(
            user?.primaryRole || UserRole.CLIENT
          ).map((role: SectionRole) => ({
            key: role,
            value: role,
            label: t(
              translations.modules.management.roles.sections[
                role as keyof typeof translations.modules.management.roles.sections
              ]
            ),
          })),
          validations: [
            {
              type: 'required',
              message: t(translations.core.validation.required),
            },
          ],
        },
        layout: { colspan: 6 },
      },
      // Permisos especiales (solo visible para SUPERADMIN y ADMIN)
      ...(canManagePermissions(currentUserRole)
        ? [
            {
              fieldConfig: {
                type: FormFieldType.CHECKBOX_GROUP,
                name: 'specialPermissions',
                label: t(
                  translations.modules.management.users.fields
                    .specialPermissions
                ),
                options: [
                  {
                    key: 'allowMultipleSessions',
                    value: 'allowMultipleSessions',
                    label: t(
                      translations.modules.management.users.permissions
                        .allowMultipleSessions
                    ),
                  },
                  {
                    key: 'blocked',
                    value: 'blocked',
                    label: t(
                      translations.modules.management.users.permissions.blocked
                    ),
                  },
                  {
                    key: 'disabled',
                    value: 'disabled',
                    label: t(
                      translations.modules.management.users.permissions.disabled
                    ),
                  },
                ],
              },
              layout: { colspan: 12 },
            },
          ]
        : []),
    ],
    [currentUserRole, t, translations, user?.email, user?.primaryRole]
  )

  // ... continuará

  return (
    <div className="p-6 bg-gray-50 rounded shadow-md">
      <DynamicForm
        title={t(translations.modules.management.users.editCreate.title)}
        successMessage={t(
          translations.modules.management.users.editCreate.successMessage
        )}
        errorMessage={t(
          translations.modules.management.users.editCreate.errorMessage
        )}
        submitButtonCaption={t(
          translations.modules.management.users.buttons.save
        )}
        cancelButtonCaption={t(
          translations.modules.management.users.buttons.cancel
        )}
        fields={fields}
        initialData={initialData}
        onSubmit={onSave}
        onCancel={onClose}
        grid={{ columns: 12, gap: '1rem' }}
      />
    </div>
  )
}

// Funciones auxiliares
const canAssignRole = (
  currentUserRole: UserRole,
  roleToAssign: UserRole
): boolean => {
  const roleHierarchy: Record<UserRole, UserRole[]> = {
    [UserRole.SUPERADMIN]: [
      UserRole.SUPERADMIN,
      UserRole.ADMIN,
      UserRole.BROKER,
      UserRole.CLIENT,
    ],
    [UserRole.ADMIN]: [UserRole.BROKER, UserRole.CLIENT],
    [UserRole.BROKER]: [UserRole.CLIENT],
    [UserRole.CLIENT]: [],
  }

  return roleHierarchy[currentUserRole]?.includes(roleToAssign) || false
}

const canManagePermissions = (role: UserRole): boolean => {
  return [UserRole.SUPERADMIN, UserRole.ADMIN].includes(role)
}

const getAvailableSectionRoles = (userRole: UserRole): SectionRole[] => {
  return RoleAccess[userRole] || []
}
