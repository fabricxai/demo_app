import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getSession } from '../../utils/auth';
import { getCurrentSession } from '../../utils/supabase/rbac';
import { toast } from 'sonner@2.0.3';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    
    // Check if user is logged in
    if (!session || !session.user) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    // Check role-based access
    if (roles && roles.length > 0) {
      const userSession = getCurrentSession();
      const userRole = userSession.role;
      
      // Admin has access to everything
      if (userRole === 'admin') {
        return;
      }

      // Check if user's role is in allowed roles
      if (!roles.includes(userRole)) {
        toast.error('You do not have permission to access this page');
        navigate('/');
        return;
      }
    }
  }, [navigate, roles]);

  return <>{children}</>;
}
