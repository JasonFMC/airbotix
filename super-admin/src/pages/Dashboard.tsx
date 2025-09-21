import { Activity } from 'lucide-react'
import { APP_STRINGS } from '@/constants/strings'
import { DashboardActivity } from '@/types'
import DashboardMetrics from '@/components/dashboard/DashboardMetrics'
import TodayOverview from '@/components/dashboard/TodayOverview'
import WeeklyView from '@/components/dashboard/WeeklyView'
import { useDashboardData } from '@/hooks/useDashboardData'

// Mock activities data - In a real app, this would come from an API
const mockActivities: DashboardActivity[] = [
  {
    id: '1',
    type: 'student_enrolled',
    description: 'John Doe enrolled in Advanced Robotics Course',
    user_id: 'user_1',
    user_name: 'John Doe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    type: 'workshop_completed',
    description: 'AI Fundamentals Workshop completed successfully',
    user_id: 'user_2',
    user_name: 'Sarah Smith',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: '3',
    type: 'course_created',
    description: 'New course "Machine Learning Basics" was created',
    user_id: 'user_3',
    user_name: 'Dr. Wilson',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: '4',
    type: 'user_registered',
    description: 'Emily Johnson registered as a new student',
    user_id: 'user_4',
    user_name: 'Emily Johnson',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
]

export default function Dashboard() {
  useDashboardData()

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMs = now.getTime() - time.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{APP_STRINGS.DASHBOARD_TITLE}</h1>
        <p className="mt-2 text-gray-600">{APP_STRINGS.DASHBOARD_WELCOME}</p>
      </div>

      {/* Dashboard Metrics */}
      <DashboardMetrics />

      {/* Today's Overview */}
      <TodayOverview 
        data={undefined} // Mock data would be passed here
        loading={false}
        error={undefined}
        onRefresh={() => console.log('Refresh today overview')}
      />

      {/* Weekly View */}
      <WeeklyView 
        data={undefined} // Mock data would be passed here
        loading={false}
        error={undefined}
        onRefresh={() => console.log('Refresh weekly view')}
      />

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user_name} - {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
