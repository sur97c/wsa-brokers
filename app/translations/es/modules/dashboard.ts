// app/translations/es/modules/dashboard.ts

import { DashboardTranslations } from '@/translations/types/modules/dashboard'

export const dashboardES: DashboardTranslations = {
  title: 'Indicadores clave de desempeño',
  kpis: {
    monthlyCommissions: {
      title: 'Comisiones Mensuales',
      trend: 'vs mes anterior',
    },
    activeClients: {
      title: 'Clientes Activos',
      trend: 'vs mes anterior',
    },
    activePolicies: {
      title: 'Pólizas Vigentes',
      trend: 'vs mes anterior',
    },
    renewalRate: {
      title: 'Tasa de Renovación',
      trend: 'vs mes anterior',
    },
  },
  gauges: {
    satisfaction: {
      name: 'Satisfacción',
      description: 'Satisfacción de clientes',
    },
    retention: {
      name: 'Retención',
      description: 'Tasa de retención de clientes',
    },
    claims: {
      name: 'Reclamos',
      description: 'Tasa de reclamos',
    },
    quotes: {
      name: 'Cotizaciones',
      description: 'Conversión de cotizaciones',
    },
  },
  charts: {
    monthlyCommissions: {
      title: 'Comisiones Mensuales',
      tooltip: 'Comisiones',
    },
    policyDistribution: {
      title: 'Distribución de Pólizas',
      types: {
        auto: 'Auto',
        life: 'Vida',
        home: 'Hogar',
        health: 'Salud',
      },
    },
  },
  common: {
    vsLastMonth: 'vs mes anterior',
    months: {
      jan: 'Ene',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Abr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Ago',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dic',
    },
    weekdays: {
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mié',
      thu: 'Jue',
      fri: 'Vie',
      sat: 'Sáb',
      sun: 'Dom',
    },
  },
  userActivity: {
    title: 'Actividad de Usuarios',
    subtitle: 'Usuarios activos por día',
    activeUsers: 'Usuarios activos',
  },
  userStats: {
    verifiedUsers: {
      title: 'Usuarios Verificados',
      description: 'Porcentaje de usuarios con email verificado',
    },
    newUsers: {
      title: 'Usuarios Nuevos',
      description: 'Registrados en los últimos 30 días',
    },
    activeRegions: {
      title: 'Regiones Activas',
      description: 'Distribución geográfica de usuarios',
    },
    userEngagement: {
      title: 'Engagement de Usuarios',
      description: 'Métricas de participación',
      lastLogin: 'Último acceso',
      verified: 'Verificados',
      unverified: 'No verificados',
    },
    profileCompletion: {
      title: 'Perfiles Completos',
      description: 'Usuarios con perfil completado',
    },
  },
}
