// app/translations/types/modules/dashboard.ts
export interface DashboardTranslations {
  title: string
  kpis: Record<
    string,
    {
      title: string
      trend: string
    }
  >
  gauges: Record<
    string,
    {
      name: string
      description: string
    }
  >
  charts: Record<
    string,
    {
      title: string
      tooltip?: string
      types?: Record<string, string>
    }
  >
  common: {
    vsLastMonth: string
    months: Record<string, string>
    weekdays: Record<string, string>
  }
  userActivity: {
    title: string
    subtitle: string
    activeUsers: string
  }
  userStats: Record<
    string,
    {
      title: string
      description: string
      [key: string]: string
    }
  >
}
