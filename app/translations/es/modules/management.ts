// app/translations/es/modules/management.ts

import { ManagementTranslations } from '@/translations/types/modules/management'

export const managementES: ManagementTranslations = {
  title: 'Administración',
  advancedTable: {
    users: {
      columns: {
        uid: 'ID',
        email: 'Correo electrónico',
        emailVerified: 'Verificado',
        displayName: 'Mostrar Como',
        name: 'Nombre',
        lastName: 'Apellido',
        createdAt: 'Creado',
        lastSignInTime: 'Ultimo acceso',
      },
      editCreate: {
        fields: {
          uid: 'ID',
          email: 'Correo electrónico',
          emailVerified: 'Verificado',
          emailNotVerified: 'No verificado',
          displayName: 'Mostrar como',
          name: 'Nombre',
          lastName: 'Apellido',
          createdAt: 'Fecha creación',
          lastSignInTime: 'Último acceso',
          status: 'Estado',
        },
        dropDowns: {
          status: {
            active: 'Activo',
            inactive: 'Inactivo',
          },
        },
        edit: {
          title: 'Editar Usuario',
          successMessage: 'Usuario actualizado exitosamente',
          errorMessage: 'Error al actualizar usuario',
        },
        create: {
          title: 'Crear Usuario',
          successMessage: 'Usuario creado exitosamente',
          errorMessage: 'Error al crear usuario',
        },
        buttons: {
          save: 'Guardar',
          cancel: 'Cancelar',
        },
      },
      tableOptions: {
        dataSource: 'Cambiar a fuente de datos {{source}}',
        mock: 'simulados',
        real: 'reales',
        exportCsv: 'Exportar a CSV',
      },
      rowOptions: {
        edit: 'Editar',
        delete: 'Eliminar',
      },
    },
  },
}
