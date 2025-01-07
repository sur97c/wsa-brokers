// app/[lang]/(protected)/app/dashboard/BrokerDashboard.tsx

import { motion } from 'framer-motion'
import { uniqueId } from 'lodash'
import {
  Users,
  FileText,
  DollarSign,
  Award,
  AlertTriangle,
  ThumbsUp,
  Briefcase,
  LucideIcon,
  CheckCircle,
  UserPlus,
  Activity,
} from 'lucide-react'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { UserRole } from '@/models/user/roles'
import { UserProfile } from '@/models/user/user'
import { useTranslations } from '@/translations/hooks/useTranslations'

interface KPICardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: number
  color: string
}

interface GaugeData {
  name: string
  value: number
  fill: string
  icon: LucideIcon
  description: string
}

interface GaugeCardProps {
  data: GaugeData
}

interface AnimatedChartProps {
  children: ReactNode
  title: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function BrokerDashboard() {
  const { t, translations } = useTranslations()
  const [isVisible, setIsVisible] = useState(false)
  const [users, setUsers] = useState<UserProfile[]>([])

  // Datos existentes...
  const monthlyCommissions = [
    {
      name: t(translations.modules.dashboard.common.months.jan),
      value: 45000,
    },
    {
      name: t(translations.modules.dashboard.common.months.feb),
      value: 52000,
    },
    {
      name: t(translations.modules.dashboard.common.months.mar),
      value: 48000,
    },
    {
      name: t(translations.modules.dashboard.common.months.apr),
      value: 61000,
    },
    {
      name: t(translations.modules.dashboard.common.months.may),
      value: 55000,
    },
    {
      name: t(translations.modules.dashboard.common.months.jun),
      value: 67000,
    },
  ]

  const policyTypes = [
    {
      name: t(
        translations.modules.dashboard.charts.policyDistribution.types?.auto
      ),
      value: 35,
    },
    {
      name: t(
        translations.modules.dashboard.charts.policyDistribution.types?.life
      ),
      value: 25,
    },
    {
      name: t(
        translations.modules.dashboard.charts.policyDistribution.types?.home
      ),
      value: 20,
    },
    {
      name: t(
        translations.modules.dashboard.charts.policyDistribution.types?.health
      ),
      value: 20,
    },
  ]

  const userActivity = [
    {
      name: t(translations.modules.dashboard.common.weekdays.mon),
      active: 120,
    },
    {
      name: t(translations.modules.dashboard.common.weekdays.tue),
      active: 132,
    },
    {
      name: t(translations.modules.dashboard.common.weekdays.wed),
      active: 125,
    },
    {
      name: t(translations.modules.dashboard.common.weekdays.thu),
      active: 138,
    },
    {
      name: t(translations.modules.dashboard.common.weekdays.fri),
      active: 142,
    },
    {
      name: t(translations.modules.dashboard.common.weekdays.sat),
      active: 98,
    },
    {
      name: t(translations.modules.dashboard.common.weekdays.sun),
      active: 85,
    },
  ]

  // Nuevos datos para los gauges
  const gaugeData = [
    {
      name: t(translations.modules.dashboard.gauges.satisfaction.name),
      value: 95,
      fill: '#00C49F',
      icon: ThumbsUp,
      description: t(
        translations.modules.dashboard.gauges.satisfaction.description
      ),
    },
    {
      name: t(translations.modules.dashboard.gauges.retention.name),
      value: 88,
      fill: '#0088FE',
      icon: Users,
      description: t(
        translations.modules.dashboard.gauges.retention.description
      ),
    },
    {
      name: t(translations.modules.dashboard.gauges.claims.name),
      value: 15,
      fill: '#FF8042',
      icon: AlertTriangle,
      description: t(translations.modules.dashboard.gauges.claims.description),
    },
    {
      name: t(translations.modules.dashboard.gauges.quotes.name),
      value: 75,
      fill: '#FFBB28',
      icon: Briefcase,
      description: t(translations.modules.dashboard.gauges.quotes.description),
    },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Simulate fetch of user data
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers: UserProfile[] = Array.from({ length: 100 }, (_, i) => ({
      // UserBase
      uid: `user-${i}`,
      email: `user${i}@example.com`,
      displayName: `User ${i}`,
      name: `John${i}`,
      lastName: `Doe${i}`,
      emailVerified: Math.random() > 0.2,
      // UserRoles
      primaryRole: UserRole.SUPERADMIN,
      sectionRoles: [],
      // UserState
      isOnline: Math.random() > 0.5,
      blocked: false,
      disabled: false,
      deleted: false,
      allowMultipleSessions: false,
      // UserTimestampsDB
      createdAt: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      createdBy: 'system',
      updatedBy: 'system',
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
      // UserMetadata
      // metadata:
      // UserSession
      sessionId: uniqueId('session-'),
      activeSessions: 1,
      lastSessionCreated: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
      totalHistoricalSessions: 1,
    }))

    setUsers(mockUsers)
  }, [])

  // Calculate user statistics
  const userStats = useMemo(() => {
    const verifiedCount = users.filter((u) => u.emailVerified).length
    const verifiedPercentage = (verifiedCount / users.length) * 100

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const newUsersCount = users.filter(
      (u) => new Date(u.createdAt || '') > thirtyDaysAgo
    ).length

    const recentLoginCount = users.filter((u) => {
      const lastLogin = new Date(u.lastLogin || '')
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return lastLogin > sevenDaysAgo
    }).length

    const completedProfiles = users.filter(
      (u) => u.name?.trim() && u.lastName?.trim()
    ).length
    const profileCompletionRate = (completedProfiles / users.length) * 100

    return {
      verifiedPercentage,
      newUsersCount,
      recentLoginCount,
      totalUsers: users.length,
      profileCompletionRate,
    }
  }, [users])

  // New User Stats Cards Component
  const UserStatsCards = () => (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
    >
      <KPICard
        title={t(translations.modules.dashboard.userStats.verifiedUsers.title)}
        value={`${Math.round(userStats.verifiedPercentage)}%`}
        icon={<CheckCircle className="h-6 w-6 text-white" />}
        color="bg-emerald-500"
      />
      <KPICard
        title={t(translations.modules.dashboard.userStats.newUsers.title)}
        value={userStats.newUsersCount.toString()}
        icon={<UserPlus className="h-6 w-6 text-white" />}
        color="bg-indigo-500"
      />
      <KPICard
        title={t(translations.modules.dashboard.userStats.userEngagement.title)}
        value={`${Math.round(
          (userStats.recentLoginCount / userStats.totalUsers) * 100
        )}%`}
        icon={<Activity className="h-6 w-6 text-white" />}
        color="bg-cyan-500"
      />
      <KPICard
        title="Total Users"
        value={userStats.totalUsers.toString()}
        icon={<Users className="h-6 w-6 text-white" />}
        color="bg-violet-500"
      />
    </motion.div>
  )

  // New User Activity Chart Component
  const UserActivityChart = () => (
    <AnimatedChart title={t(translations.modules.dashboard.userActivity.title)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={userActivity}>
          <defs>
            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="active"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#activeGradient)"
            name={t(translations.modules.dashboard.userActivity.activeUsers)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnimatedChart>
  )

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon,
    trend,
    color,
  }) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''))
    const [count, setCount] = useState(0)

    useEffect(() => {
      const duration = 2000 // 2 segundos
      const steps = 60
      const stepValue = numericValue / steps
      const stepDuration = duration / steps
      let current = 0

      const timer = setInterval(() => {
        current += stepValue
        if (current >= numericValue) {
          setCount(numericValue)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }, [numericValue])

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-semibold">
              {value.startsWith('$') ? '$' : ''}
              {count.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              {value.endsWith('%') ? '%' : ''}
            </p>
            {trend && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className={`text-sm mt-2 ${
                  trend >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%{' '}
                {t(translations.modules.dashboard.common.vsLastMonth)}
              </motion.p>
            )}
          </div>
          <motion.div
            className={`p-3 rounded-full ${color}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {icon}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const GaugeCard: React.FC<GaugeCardProps> = ({ data }) => {
    const Icon = data.icon
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress((data.value / 100) * circumference)
      }, 300)
      return () => clearTimeout(timer)
    }, [data.value, circumference])

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r={radius}
                stroke={data.fill}
                strokeWidth="8"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeLinecap="round"
                fill="none"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - progress }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <motion.text
                x="64"
                y="64"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold"
                fill={data.fill}
                transform="rotate(90 64 64)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {`${data.value}%`}
              </motion.text>
            </svg>
          </div>
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Icon
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: data.fill }}
            />
            <h3 className="font-semibold text-gray-800">{data.name}</h3>
            <p className="text-sm text-gray-500">{data.description}</p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Componente para gráficas animadas
  const AnimatedChart: React.FC<AnimatedChartProps> = ({ children, title }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <motion.div
        className="h-80"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Gauge Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gaugeData.map((data, index) => (
          <GaugeCard key={index} data={data} />
        ))}
      </motion.div>
      {/* Existing KPI Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t(
            translations.modules.dashboard.kpis.monthlyCommissions.title
          )}
          value="$67,000"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          trend={12.5}
          color="bg-blue-500"
        />
        <KPICard
          title={t(translations.modules.dashboard.kpis.activeClients.title)}
          value="1,234"
          icon={<Users className="h-6 w-6 text-white" />}
          trend={5.2}
          color="bg-green-500"
        />
        <KPICard
          title={t(translations.modules.dashboard.kpis.activePolicies.title)}
          value="3,567"
          icon={<FileText className="h-6 w-6 text-white" />}
          trend={8.7}
          color="bg-purple-500"
        />
        <KPICard
          title={t(translations.modules.dashboard.kpis.renewalRate.title)}
          value="92%"
          icon={<Award className="h-6 w-6 text-white" />}
          trend={2.1}
          color="bg-yellow-500"
        />
      </motion.div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedChart
          title={t(
            translations.modules.dashboard.charts.monthlyCommissions.title
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCommissions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE">
                {monthlyCommissions.map((entry, index) => (
                  <motion.circle
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </AnimatedChart>

        <AnimatedChart
          title={t(
            translations.modules.dashboard.charts.policyDistribution.title
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={policyTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {policyTypes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  >
                    <motion.path
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    />
                  </Cell>
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </AnimatedChart>
      </div>
      {/* New User Stats Section */}
      <UserStatsCards />
      {/* New User Activity Chart */}
      <UserActivityChart />
    </motion.div>
  )
}
