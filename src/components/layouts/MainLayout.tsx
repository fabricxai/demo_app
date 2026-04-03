import { Outlet, useNavigate, useLocation } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';
import { AIAssistantPanel } from '../AIAssistantPanel';
import { toast } from 'sonner@2.0.3';
import { getSession, verifySession, signOut } from '../../utils/auth';
import { initializeDemoSession } from '../../utils/supabase/rbac';
import { getAiModuleKeyForPath } from '../../config/moduleAgents';
import { MobileWorkspaceNotice } from './MobileWorkspaceNotice';
import { useIsMobileErpLayout } from '../../hooks/useMediaQuery';

interface UserSession {
  email: string;
  name: string;
  company: string;
  role: string;
  userId?: string;
  companyId?: string;
  accessToken?: string;
}

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [aiPanelPrompt, setAIPanelPrompt] = useState<string | undefined>(undefined);
  const [demoExpiryTime, setDemoExpiryTime] = useState<number | null>(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const isMobileLayout = useIsMobileErpLayout();

  const aiModuleKey = useMemo(
    () => getAiModuleKeyForPath(location.pathname),
    [location.pathname],
  );

  // Verify session on mount
  useEffect(() => {
    const checkSession = async () => {
      const session = getSession();
      if (!session) {
        toast.error('Session expired. Please sign in again.', { duration: 8000 });
        navigate('/login');
        setIsVerifyingSession(false);
        return;
      }

      const verification = await verifySession();
      if (!verification.valid) {
        signOut();
        toast.error(
          verification.errorMessage ||
            'Could not verify your session. Please sign in again.',
          { duration: 8000 },
        );
        navigate('/login');
        setIsVerifyingSession(false);
        return;
      }

      if (verification.user) {
        setUser({
          email: verification.user.email,
          name: verification.user.fullName,
          company: verification.user.companyName,
          role: verification.user.role,
          userId: verification.user.id,
          companyId: verification.user.companyId,
          accessToken: session.accessToken,
        });

        // Initialize database session
        initializeDemoSession(verification.user.role);

        // Check if this is a demo session
        if (verification.user.email === 'demo@fabricxai.com') {
          const existingExpiry = localStorage.getItem('demo_expiry_time');
          if (existingExpiry) {
            setDemoExpiryTime(parseInt(existingExpiry));
          } else {
            const expiryTime = Date.now() + (30 * 60 * 1000); // 30 minutes
            setDemoExpiryTime(expiryTime);
            localStorage.setItem('demo_expiry_time', expiryTime.toString());
          }
        }
      }

      setIsVerifyingSession(false);
    };

    checkSession();
  }, [navigate]);

  // Demo session auto-logout timer
  useEffect(() => {
    if (!demoExpiryTime || !user) return;

    const checkExpiry = () => {
      const now = Date.now();
      const timeLeft = demoExpiryTime - now;

      // Show warning 5 minutes before expiry
      if (timeLeft <= 5 * 60 * 1000 && timeLeft > 0 && !showExpiryWarning) {
        setShowExpiryWarning(true);
        toast.info('Your demo session will expire in 5 minutes', {
          duration: 10000,
        });
      }

      // Auto-logout when expired
      if (timeLeft <= 0) {
        toast.error('Your demo session has expired. Please request a new demo.');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 30000);
    return () => clearInterval(interval);
  }, [demoExpiryTime, user, showExpiryWarning]);

  const handleLogout = () => {
    signOut();
    localStorage.removeItem('demo_expiry_time');
    setUser(null);
    setDemoExpiryTime(null);
    setShowExpiryWarning(false);
    navigate('/login');
  };

  const handleAskMarbim = (prompt: string) => {
    setAIPanelPrompt(prompt);
    setIsAIPanelOpen(true);
  };

  // Show loading while verifying session
  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#57ACAF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const aiPanelSharedProps = {
    isOpen: isAIPanelOpen,
    onClose: () => {
      setIsAIPanelOpen(false);
      setAIPanelPrompt(undefined);
    },
    initialPrompt: aiPanelPrompt,
    currentModule: aiModuleKey,
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#101725] to-[#182336] overflow-hidden">
      <Sidebar 
        currentPage={location.pathname}
        onNavigate={(page) => {
          const path = page.startsWith('/') ? page : `/${page}`;
          navigate(path);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div 
        className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300 ${
          isAIPanelOpen ? 'compact-layout' : ''
        }`}
      >
        <TopBar 
          onOpenAIPanel={() => setIsAIPanelOpen(true)}
          currentPage={location.pathname}
          onNavigate={(page) => {
            const path = page.startsWith('/') ? page : `/${page}`;
            navigate(path);
          }}
          user={user}
          onLogout={handleLogout}
          demoExpiryTime={demoExpiryTime}
        />

        <div className="flex-1 flex min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
            <main className="flex-1 overflow-auto custom-scrollbar min-h-0">
              <div className="max-w-[1600px] mx-auto w-full min-h-full">
                <Outlet context={{ onAskMarbim: handleAskMarbim, user }} />
              </div>
            </main>
          </div>
          {!isMobileLayout && (
            <AIAssistantPanel {...aiPanelSharedProps} docked fullBleed={false} />
          )}
        </div>

        <footer className="shrink-0 border-t border-white/5 bg-[#0D1117]/50 backdrop-blur-sm px-6 py-2.5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>© 2025 FabricXAI</span>
              <span className="text-gray-600">|</span>
              <span>Garments Intelligent Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/privacy-policy')}
                className="hover:text-[#57ACAF] transition-colors duration-180"
              >
                Privacy
              </button>
              <span className="text-gray-600">|</span>
              <button 
                onClick={() => navigate('/terms-of-service')}
                className="hover:text-[#57ACAF] transition-colors duration-180"
              >
                Terms
              </button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-[#57ACAF] transition-colors duration-180">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>

      {isMobileLayout && (
        <AIAssistantPanel {...aiPanelSharedProps} fullBleed />
      )}

      {isMobileLayout && !isAIPanelOpen && (
        <MobileWorkspaceNotice onOpenFabricAI={() => setIsAIPanelOpen(true)} />
      )}

    </div>
  );
}
