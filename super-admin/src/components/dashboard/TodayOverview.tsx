import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { 
  WORKSHOP_STATUS, 
  ALERT_TYPES, 
  CAPACITY_THRESHOLDS
} from '@/constants/dashboard'
import { 
  TodayOverviewProps, 
  TodayWorkshop, 
  WorkshopAlert,
  WorkshopCardProps,
  AlertBadgeProps
} from '@/types/dashboard'
import { cn } from '@/utils'

// Alert badge component
const AlertBadge = ({ alert, className }: AlertBadgeProps) => {
  const getAlertColor = () => {
    switch (alert.severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertIcon = () => {
    switch (alert.type) {
      case ALERT_TYPES.TEACHER_UNAVAILABLE:
        return <XCircle className="h-3 w-3" />
      case ALERT_TYPES.WORKSHOP_FULL:
        return <AlertTriangle className="h-3 w-3" />
      case ALERT_TYPES.LOW_ENROLLMENT:
        return <Users className="h-3 w-3" />
      case ALERT_TYPES.MISSING_CONTENT:
        return <AlertCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
      getAlertColor(),
      className
    )}>
      {getAlertIcon()}
      <span className="ml-1">{alert.message}</span>
    </div>
  )
}

// Workshop card component
const WorkshopCard = ({ workshop, className }: WorkshopCardProps) => {
  const getStatusColor = () => {
    switch (workshop.status) {
      case WORKSHOP_STATUS.IN_PROGRESS:
        return 'border-blue-200 bg-blue-50'
      case WORKSHOP_STATUS.COMPLETED:
        return 'border-green-200 bg-green-50'
      case WORKSHOP_STATUS.CANCELLED:
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getStatusIcon = () => {
    switch (workshop.status) {
      case WORKSHOP_STATUS.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-600" />
      case WORKSHOP_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case WORKSHOP_STATUS.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getCapacityStatus = () => {
    const ratio = workshop.enrolledCount / workshop.capacity
    if (ratio >= CAPACITY_THRESHOLDS.OVERBOOKED) {
      return { status: 'overbooked', color: 'text-red-600', bg: 'bg-red-100' }
    } else if (ratio >= CAPACITY_THRESHOLDS.NEAR_FULL) {
      return { status: 'near-full', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    } else if (ratio <= CAPACITY_THRESHOLDS.LOW_ENROLLMENT) {
      return { status: 'low-enrollment', color: 'text-blue-600', bg: 'bg-blue-100' }
    }
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const capacityStatus = getCapacityStatus()

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
      getStatusColor(),
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-gray-900 truncate">{workshop.title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {workshop.attendanceMarked && (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* Time and Location */}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(workshop.startTime)} - {formatTime(workshop.endTime)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">{workshop.location}</span>
        </div>

        {/* Teacher */}
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{workshop.teacherName}</span>
        </div>

        {/* Enrollment Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <span className="text-gray-600">Enrollment:</span>
            <span className="ml-2 font-medium">
              {workshop.enrolledCount}/{workshop.capacity}
            </span>
          </div>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            capacityStatus.bg,
            capacityStatus.color
          )}>
            {Math.round((workshop.enrolledCount / workshop.capacity) * 100)}%
          </div>
        </div>

        {/* Alerts */}
        {workshop.alerts.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {workshop.alerts.map((alert) => (
              <AlertBadge key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  </div>
)

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">Error loading today's overview</h3>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-4 inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </button>
    </div>
  </div>
)

// Main TodayOverview component
export default function TodayOverview({ 
  data, 
  loading = false, 
  error, 
  onRefresh 
}: TodayOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Today's Overview</h2>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Today's Overview</h2>
        </div>
        <ErrorState error={error} onRetry={handleRefresh} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Today's Overview</h2>
        </div>
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  const { workshops, totalWorkshops, activeWorkshops, completedWorkshops, totalEnrollments, alerts } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Today's Overview</h2>
          <p className="text-sm text-gray-600 mt-1">
            {data.lastUpdated ? `Last updated: ${new Date(data.lastUpdated).toLocaleString()}` : 'Real-time data'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workshops</p>
              <p className="text-2xl font-bold text-gray-900">{totalWorkshops}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeWorkshops}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedWorkshops}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-orange-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">Active Alerts</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {alerts.map((alert) => (
              <AlertBadge key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Workshops Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Workshops</h3>
        {workshops.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No workshops scheduled for today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Export types for external use
export type { TodayOverviewProps, TodayWorkshop, WorkshopAlert }
