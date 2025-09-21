import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

// Constants following AI coding rules
const METRIC_TYPES = {
  STUDENTS: 'total_students',
  TEACHERS: 'total_teachers', 
  WORKSHOPS: 'active_workshops',
  COURSES: 'total_courses'
} as const

const TREND_DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  NEUTRAL: 'NEUTRAL'
} as const

const COLOR_VARIANTS = {
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  PURPLE: 'PURPLE',
  ORANGE: 'ORANGE'
} as const

const UI_TEXT = {
  DASHBOARD_OVERVIEW: 'Dashboard Overview',
  KEY_METRICS: 'Key Metrics',
  ADDITIONAL_METRICS: 'Additional Metrics',
  QUICK_ACTIONS: 'Quick Actions',
  REFRESH: 'Refresh',
  REFRESHING: 'Refreshing...',
  LAST_UPDATED: 'Last updated:',
  REAL_TIME_DATA: 'Real-time data',
  FROM_LAST: 'from last',
  ERROR_LOADING: 'Error loading dashboard data',
  RETRY: 'Retry'
} as const

// TypeScript interfaces
interface MetricTrend {
  percentage: number
  direction: keyof typeof TREND_DIRECTIONS
  period: string
}

interface MetricCardData {
  id: string
  title: string
  value: number
  trend: MetricTrend
  icon: React.ComponentType<{ className?: string }>
  color: keyof typeof COLOR_VARIANTS
}

interface MetricCardProps {
  card: MetricCardData
  className?: string
}

interface DashboardMetricsProps {
  className?: string
}

// Color mapping for consistent styling
const getColorClasses = (color: keyof typeof COLOR_VARIANTS) => {
  const colorMap = {
    [COLOR_VARIANTS.BLUE]: {
      icon: 'text-blue-600 bg-blue-100',
      trend: 'text-blue-600'
    },
    [COLOR_VARIANTS.GREEN]: {
      icon: 'text-green-600 bg-green-100',
      trend: 'text-green-600'
    },
    [COLOR_VARIANTS.PURPLE]: {
      icon: 'text-purple-600 bg-purple-100',
      trend: 'text-purple-600'
    },
    [COLOR_VARIANTS.ORANGE]: {
      icon: 'text-orange-600 bg-orange-100',
      trend: 'text-orange-600'
    }
  }
  return colorMap[color]
}

// Single MetricCard component definition
const MetricCard: React.FC<MetricCardProps> = ({ card, className = '' }) => {
  const { title, value, trend, icon: Icon, color } = card
  const colorClasses = getColorClasses(color)
  const TrendIcon = trend.direction === TREND_DIRECTIONS.UP ? TrendingUp : TrendingDown

  return (
    <Card className={`${className} hover:shadow-md transition-shadow duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${colorClasses.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
        </div>
        <div className="flex items-center mt-1">
          <TrendIcon className={`h-3 w-3 mr-1 ${colorClasses.trend}`} />
          <span className={`text-xs ${colorClasses.trend}`}>
            {trend.percentage > 0 ? '+' : ''}{trend.percentage}% {UI_TEXT.FROM_LAST} {trend.period}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton component - exported for potential future use
export const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </CardContent>
    </Card>
  </div>
)

// Error state component - exported for potential future use
export const ErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string
  onRetry: () => void 
}) => (
  <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">{UI_TEXT.ERROR_LOADING}</h3>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-4 inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        {UI_TEXT.RETRY}
      </button>
    </div>
  </div>
)

// Main component
const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ className = '' }) => {
  // Mock data - replace with real data from your API
  const metricsData: MetricCardData[] = [
    {
      id: METRIC_TYPES.STUDENTS,
      title: 'Total Students',
      value: 1247,
      trend: {
        percentage: 12,
        direction: TREND_DIRECTIONS.UP,
        period: 'last month'
      },
      icon: Users,
      color: COLOR_VARIANTS.BLUE
    },
    {
      id: METRIC_TYPES.TEACHERS,
      title: 'Total Teachers',
      value: 89,
      trend: {
        percentage: 8,
        direction: TREND_DIRECTIONS.UP,
        period: 'last month'
      },
      icon: GraduationCap,
      color: COLOR_VARIANTS.GREEN
    },
    {
      id: METRIC_TYPES.WORKSHOPS,
      title: 'Active Workshops',
      value: 23,
      trend: {
        percentage: 15,
        direction: TREND_DIRECTIONS.UP,
        period: 'last month'
      },
      icon: Calendar,
      color: COLOR_VARIANTS.PURPLE
    },
    {
      id: METRIC_TYPES.COURSES,
      title: 'Total Courses',
      value: 156,
      trend: {
        percentage: 5,
        direction: TREND_DIRECTIONS.UP,
        period: 'last month'
      },
      icon: BookOpen,
      color: COLOR_VARIANTS.ORANGE
    }
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{UI_TEXT.DASHBOARD_OVERVIEW}</h2>
          <p className="text-gray-600 mt-1">{UI_TEXT.REAL_TIME_DATA}</p>
        </div>
      </div>

      {/* Primary Metrics - 4-card grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{UI_TEXT.KEY_METRICS}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((card) => (
            <MetricCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Export statements
export { DashboardMetrics, MetricCard }
export default DashboardMetrics
export type { MetricCardData, MetricCardProps, DashboardMetricsProps }