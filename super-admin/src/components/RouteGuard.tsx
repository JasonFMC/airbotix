/**
 * Route Guard Component
 * Additional security layer for route protection
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PUBLIC_ROUTES } from '../constants/routes';

export interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

export function RouteGuard({ 
  children, 
  requiredPermission,
  fallbackPath = PUBLIC_ROUTES.LOGIN 
}: RouteGuardProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsChecking(true);

      // Wait for auth to load
      if (loading) {
        return;
      }

      // Check if user is authenticated
      if (!user || !profile) {
        navigate(PUBLIC_ROUTES.LOGIN, { 
          state: { from: location.pathname } 
        });
        return;
      }

      // Check role-based permissions
      if (requiredPermission) {
        const hasPermission = checkUserPermission(profile, requiredPermission);
        if (!hasPermission) {
          navigate(fallbackPath, { 
            state: { 
              from: location.pathname,
              requiredPermission 
            } 
          });
          return;
        }
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuthorization();
  }, [user, profile, loading, requiredPermission, location.pathname, navigate, fallbackPath]);

  // Show loading state while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Check if user has required permission
 */
function checkUserPermission(profile: { role?: string }, permission: string): boolean {
  // Basic role-based permission check
  const userRole = profile.role || 'user';
  
  // Super admin has all permissions
  if (userRole === 'super_admin') {
    return true;
  }

  // Admin has most permissions except super admin specific ones
  if (userRole === 'admin') {
    const restrictedPermissions = ['MANAGE_SYSTEM_SETTINGS', 'MANAGE_ADMINS'];
    return !restrictedPermissions.includes(permission);
  }

  // Regular user permissions
  const userPermissions = [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'VIEW_TEACHERS',
    'VIEW_WORKSHOPS',
    'VIEW_COURSES',
    'VIEW_CONTENT'
  ];

  return userPermissions.includes(permission);
}
