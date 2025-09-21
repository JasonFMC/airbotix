import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  LogOut
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { NAVIGATION_ITEMS, ROLE_LABELS, SIDEBAR_CONFIG } from '@/constants/navigation'
import { USER_ROLES } from '@/constants/userRoles'
import { cn } from '@/utils'

interface SidebarProps {
  className?: string
}

// Role display and badge color functions - exported for potential future use
export const getRoleDisplayName = (role: string) => {
  return ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role
}

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
      return 'bg-red-100 text-red-800 border-red-200'
    case USER_ROLES.ADMIN:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case USER_ROLES.TEACHER:
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const { profile, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const filteredNavigationItems = NAVIGATION_ITEMS.filter(item => 
    profile?.role && item.requiredRoles.includes(profile.role)
  )

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? `w-${SIDEBAR_CONFIG.COLLAPSED_WIDTH / 4}` : `w-${SIDEBAR_CONFIG.WIDTH / 4}`,
        className
      )}
      style={{
        width: isCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : SIDEBAR_CONFIG.WIDTH
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900 truncate">
            Airbotix Admin
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {filteredNavigationItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                "hover:bg-gray-50 hover:shadow-sm",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 h-5 w-5 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )}
              />
              {!isCollapsed && (
                <span className="ml-3 truncate">
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Simplified Bottom Section - Settings & Logout Only */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span>Settings</span>}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Export types for external use
export type { SidebarProps }
