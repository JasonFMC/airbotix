import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Constants following AI coding rules
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
} as const

const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/admin'
} as const

const ERROR_MESSAGES = {
  ACCESS_DENIED_TITLE: 'Access Denied',
  ACCESS_DENIED_DESCRIPTION: "You don't have permission to access this page.",
  LOADING_MESSAGE: 'Loading...'
} as const

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requiredPermission?: string
  fallbackPath?: string
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requiredPermission,
  fallbackPath = ROUTES.LOGIN 
}: ProtectedRouteProps) => {
  const { user, loading: isLoading, profile, hasPermission } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">{ERROR_MESSAGES.LOADING_MESSAGE}</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />
  }

  // Check role-based access if required roles specified
  if (requiredPermission) {
    if (!hasPermission(requiredPermission as any)) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
              <div className="text-sm text-gray-500">
                <p>Required permission: {requiredPermission}</p>
                <p>Your role: {profile?.role || 'None'}</p>
              </div>
            </div>
            <button onClick={() => window.history.back()} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Go Back
            </button>
          </div>
        </div>
      )
    }
  }

  if (requiredRoles.length > 0 && profile?.role && !requiredRoles.includes(profile.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg 
                className="h-8 w-8 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {ERROR_MESSAGES.ACCESS_DENIED_TITLE}
            </h2>
            <p className="text-gray-600 mb-6">
              {ERROR_MESSAGES.ACCESS_DENIED_DESCRIPTION}
            </p>
            <div className="text-sm text-gray-500">
              <p>Required roles: {requiredRoles.join(', ')}</p>
              <p>Your role: {profile?.role || 'None'}</p>
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Both named and default exports for compatibility
export { ProtectedRoute }
export default ProtectedRoute

// Export the interface for type safety
export type { ProtectedRouteProps }

// Export constants for external use
export { AUTH_STATES, ROUTES, ERROR_MESSAGES }