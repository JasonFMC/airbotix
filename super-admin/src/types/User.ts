import { User } from '@supabase/supabase-js'
import { NotificationType } from '@/constants/ui'

// User dropdown component props
export interface UserDropdownProps {
  user: User | null
  userRole: string | null
  onSignOut: () => Promise<void>
  className?: string
}

// Notification item interface
export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
}

// Notification dropdown props
export interface NotificationDropdownProps {
  notifications: NotificationItem[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onNotificationClick: (notification: NotificationItem) => void
  className?: string
}

// User profile interface
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

// User menu action interface
export interface UserMenuAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: 'default' | 'destructive'
}

// Responsive user info interface
export interface ResponsiveUserInfo {
  showAvatar: boolean
  showName: boolean
  showRole: boolean
  showDropdown: boolean
}

// Export types for external use
// Explicit re-exports omitted to avoid duplicate export conflicts