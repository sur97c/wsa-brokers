// app/translations/en/modules/dashboard.ts

import { DashboardTranslations } from '@/translations/types/modules/dashboard'

export const dashboardEN: DashboardTranslations = {
  title: 'Key Performance Indicators',
  kpis: {
    monthlyCommissions: {
      title: 'Monthly Commissions',
      trend: 'vs last month',
    },
    activeClients: {
      title: 'Active Clients',
      trend: 'vs last month',
    },
    activePolicies: {
      title: 'Active Policies',
      trend: 'vs last month',
    },
    renewalRate: {
      title: 'Renewal Rate',
      trend: 'vs last month',
    },
  },
  gauges: {
    satisfaction: {
      name: 'Satisfaction',
      description: 'Customer satisfaction',
    },
    retention: {
      name: 'Retention',
      description: 'Customer retention rate',
    },
    claims: {
      name: 'Claims',
      description: 'Claims rate',
    },
    quotes: {
      name: 'Quotes',
      description: 'Quote conversion',
    },
  },
  charts: {
    monthlyCommissions: {
      title: 'Monthly Commissions',
      tooltip: 'Commissions',
    },
    policyDistribution: {
      title: 'Policy Distribution',
      types: {
        auto: 'Auto',
        life: 'Life',
        home: 'Home',
        health: 'Health',
      },
    },
  },
  common: {
    vsLastMonth: 'vs last month',
    months: {
      jan: 'Jan',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Apr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dec',
    },
    weekdays: {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    },
  },
  userActivity: {
    title: 'User Activity',
    subtitle: 'Active users per day',
    activeUsers: 'Active users',
  },
  userStats: {
    verifiedUsers: {
      title: 'Verified Users',
      description: 'Percentage of email-verified users',
    },
    newUsers: {
      title: 'New Users',
      description: 'Registered in the last 30 days',
    },
    activeRegions: {
      title: 'Active Regions',
      description: 'Geographical user distribution',
    },
    userEngagement: {
      title: 'User Engagement',
      description: 'Engagement metrics',
      lastLogin: 'Last login',
      verified: 'Verified',
      unverified: 'Unverified',
    },
    profileCompletion: {
      title: 'Complete Profiles',
      description: 'Users with completed profiles',
    },
  },
}
