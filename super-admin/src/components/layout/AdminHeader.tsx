import React from 'react'
import { Search, Bell, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/DropdownMenu'
import { useAuth } from '@/hooks/useAuth'

interface AdminHeaderProps {
  onSidebarToggle?: () => void
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onSidebarToggle }) => {
  const { user, userRole, signOut } = useAuth()

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return (user.user_metadata.full_name as string)
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.charAt(0).toUpperCase() || 'A'
  }

  const getDisplayName = () => {
    return (user?.user_metadata?.full_name as string) || user?.email || 'User'
  }

  const getRoleDisplayName = () => {
    return userRole || 'super_admin'
  }

  const handleUserMenuAction = async (action: string) => {
    switch (action) {
      case 'profile':
        console.log('Navigate to profile')
        break
      case 'settings':
        console.log('Navigate to settings')
        break
      case 'logout':
        try {
          await signOut()
        } catch (error) {
          console.error('Error signing out:', error)
        }
        break
    }
  }

  const handleNotificationClick = () => {
    console.log('Navigate to notifications')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu toggle (mobile) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onSidebarToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden lg:block text-sm font-medium text-gray-600">
            Airbotix Super Admin
          </span>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, courses, orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right: Notifications + User Dropdown */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button 
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Dropdown - ONLY LOCATION for user info */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getUserInitials()}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getDisplayName()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getRoleDisplayName()}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserMenuAction('profile')}>
                <User className="mr-3 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUserMenuAction('settings')}>
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserMenuAction('logout')} className="text-red-600">
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
