import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  ChevronDown, 
  Settings, 
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  SEARCH_CONTEXT_MAP, 
  SEARCH_CONFIG, 
  NOTIFICATION_CONFIG,
  TOP_NAV_CONFIG,
  USER_MENU_ACTIONS 
} from '@/constants/search'
import { UI_TEXT } from '@/constants/ui'
import { Avatar } from '@/components/ui/Avatar'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '@/components/ui/DropdownMenu'
import { cn } from '@/utils'

interface TopNavigationProps {
  onSidebarToggle: () => void
  currentRoute: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  updated_at: string
}

export default function TopNavigation({ onSidebarToggle, currentRoute }: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notificationCount] = useState(3) // Mock notification count
  const location = useLocation()
  const { profile, signOut } = useAuth()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get context-aware search placeholder
  const getSearchPlaceholder = () => {
    return SEARCH_CONTEXT_MAP[currentRoute as keyof typeof SEARCH_CONTEXT_MAP] || 
           SEARCH_CONTEXT_MAP[location.pathname as keyof typeof SEARCH_CONTEXT_MAP] ||
           'Search...'
  }

  // Debounced search handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
        // Implement search logic here
        console.log('Searching for:', searchQuery)
      }
    }, SEARCH_CONFIG.DEBOUNCE_DELAY)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= SEARCH_CONFIG.MAX_SEARCH_LENGTH) {
      setSearchQuery(value)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search submission logic
      console.log('Search submitted:', searchQuery)
    }
  }

  const handleUserMenuAction = async (action: string) => {
    switch (action) {
      case USER_MENU_ACTIONS.PROFILE:
        console.log('Navigate to profile')
        break
      case USER_MENU_ACTIONS.SETTINGS:
        console.log('Navigate to settings')
        break
      case USER_MENU_ACTIONS.LOGOUT:
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

  // initials not used in simplified avatar

  const getDisplayName = () => {
    return profile?.full_name || profile?.email || 'User'
  }

  return (
    <div 
      className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200"
      style={{ height: TOP_NAV_CONFIG.HEIGHT }}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left Section - Mobile Menu & Branding */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Company branding - hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Airbotix Super Admin
            </h1>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={getSearchPlaceholder()}
                className={cn(
                  "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  "transition-all duration-200",
                  isSearchFocused && "shadow-md"
                )}
                maxLength={SEARCH_CONFIG.MAX_SEARCH_LENGTH}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > NOTIFICATION_CONFIG.COUNT_THRESHOLD && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > NOTIFICATION_CONFIG.MAX_COUNT_DISPLAY 
                  ? `${NOTIFICATION_CONFIG.MAX_COUNT_DISPLAY}+` 
                  : notificationCount
                }
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors">
                <div className="h-8 w-8">
                  <Avatar className="h-8 w-8" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-medium text-gray-900">{getDisplayName()}</div>
                  <div className="text-xs text-gray-500">{profile?.role || 'User'}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{UI_TEXT.MY_ACCOUNT}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserMenuAction(USER_MENU_ACTIONS.PROFILE)}>
                <User className="mr-2 h-4 w-4" />
                <span>{UI_TEXT.PROFILE}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUserMenuAction(USER_MENU_ACTIONS.SETTINGS)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{UI_TEXT.SETTINGS}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserMenuAction(USER_MENU_ACTIONS.LOGOUT)}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{UI_TEXT.LOGOUT}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// Export types for external use
export type { TopNavigationProps, UserProfile }
