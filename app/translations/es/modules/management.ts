// app/translations/es/modules/management.ts

import { SectionRole, UserRole } from '@/models/user/roles'
import { ManagementTranslations } from '@/translations/types/modules/management'

export const managementES: ManagementTranslations = {
  title: 'Administración',
  users: {
    edit: {
      title: 'Editar Usuario',
    },
    fields: {
      email: 'Correo electrónico',
      displayName: 'Mostrar Como',
      primaryRole: 'Rol Principal',
      name: 'Nombre',
      lastName: 'Apellido',
      sectionRoles: 'Roles de Sección',
      specialPermissions: 'Permisos Especiales',
    },
    permissions: {
      allowMultipleSessions: 'Permitir múltiples sesiones',
      blocked: 'Bloqueado',
      disabled: 'Desactivado',
    },
    editCreate: {
      title: 'Editar Usuario',
      successMessage: 'Usuario actualizado exitosamente',
      errorMessage: 'Error al actualizar usuario',
    },
    buttons: {
      new: 'Nuevo',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
    list: {
      title: 'Usuarios',
      addUser: 'Agregar Usuario',
    },
  },
  roles: {
    [UserRole.SUPERADMIN]: 'Superadmin',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.BROKER]: 'Broker',
    [UserRole.CLIENT]: 'Cliente',
    sections: {
      [SectionRole.USER_MANAGEMENT]: 'Administración de Usuarios',
      [SectionRole.ROLE_MANAGEMENT]: 'Administración de Roles',
      [SectionRole.SYSTEM_CONFIG]: 'Configuración del Sistema',
      [SectionRole.DASHBOARD]: 'Tablero',
      [SectionRole.QUOTES]: 'Cotizaciones',
      [SectionRole.POLICIES]: 'Pólizas',
      [SectionRole.CLAIMS]: 'Reclamaciones',
      [SectionRole.REPORTS]: 'Reportes',
      [SectionRole.BROKER_PORTAL]: 'Portal del Broker',
      [SectionRole.CLIENT_PORTAL]: 'Portal del Cliente',
    },
  },
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
