import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Sparkles, Zap, CheckCircle, Clock, Activity, 
  X, ChevronRight, MessageSquare, TrendingUp, Target,
  Play, Pause, AlertCircle, Loader2, Box
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { AgentCopilot } from './AgentCopilot';

// Types
export interface AgentSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  estimatedTime: string;
}

export interface AgentAction {
  id: string;
  type: 'task' | 'analysis' | 'communication' | 'approval';
  title: string;
  description: string;
  status: 'in-progress' | 'completed' | 'failed' | 'awaiting-approval';
  progress: number;
  timestamp: Date;
  requiresApproval?: boolean;
  approvalData?: {
    question: string;
    options: string[];
    recommendation: string;
  };
  result?: {
    summary: string;
    details: Record<string, string | number>;
    fullContent?: any;
  };
  steps?: Array<{
    label: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
}

interface AgentModeLayoutProps {
  subpageName: string;
  subpageRoute: string;
  fullRoute: string;
  capabilities: string[];
  suggestions: AgentSuggestion[];
  onStartAction: (suggestion: AgentSuggestion) => void;
  actions: AgentAction[];
  onApprove: (actionId: string) => void;
  onReject: (actionId: string) => void;
  onAskMarbim?: (prompt: string) => void;
}

export function AgentModeLayout({
  subpageName,
  subpageRoute,
  fullRoute,
  capabilities,
  suggestions,
  onStartAction,
  actions,
  onApprove,
  onReject,
  onAskMarbim
}: AgentModeLayoutProps) {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent'; message: string; timestamp: Date }[]>([]);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'executing' | 'activity' | 'suggestions' | 'chat'>('overview');
  const [copilotOpen, setCopilotOpen] = useState(false);

  const completedCount = actions.filter(a => a.status === 'completed').length;
  const failedCount = actions.filter(a => a.status === 'failed').length;
  const inProgressCount = actions.filter(a => a.status === 'in-progress').length;
  const awaitingApprovalCount = actions.filter(a => a.status === 'awaiting-approval').length;

  const successRate = actions.length > 0 ? (completedCount / actions.length) * 100 : 0;

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    setChatHistory(prev => [...prev, {
      role: 'user',
      message: userMessage,
      timestamp: new Date()
    }]);

    // Simulate agent response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        role: 'agent',
        message: `I understand you want to: "${userMessage}". Let me break this down into actionable steps and start executing...`,
        timestamp: new Date()
      }]);
    }, 1000);

    setUserMessage('');
  };

  const getImpactColor = (impact: AgentSuggestion['impact']) => {
    switch(impact) {
      case 'high': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'medium': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'low': return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const getStatusColor = (status: AgentAction['status']) => {
    switch(status) {
      case 'in-progress': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'completed': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'failed': return 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20';
      case 'awaiting-approval': return 'bg-[#9333EA]/10 text-[#9333EA] border-[#9333EA]/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#6F83A7] mb-4">
          <span>{fullRoute}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold mb-1">{subpageRoute}</h1>
              <p className="text-[#6F83A7]">Fully autonomous AI assistant for {subpageName.toLowerCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Agent Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20 mb-8">
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { id: 'overview', icon: Box, label: 'Overview' },
            { id: 'executing', icon: Zap, label: 'Executing Now', badge: inProgressCount, highlight: inProgressCount > 0 },
            { id: 'suggestions', icon: Sparkles, label: 'AI Suggestions', badge: suggestions.length },
            { id: 'activity', icon: Activity, label: 'Activity Stream', badge: actions.length },
            { id: 'chat', icon: MessageSquare, label: 'Chat' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeView === tab.id
                  ? 'bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 text-black font-medium shadow-lg shadow-[#EAB308]/30'
                  : tab.highlight
                  ? 'bg-[#57ACAF]/10 hover:bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30 animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-[#6F83A7]'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeView === tab.id ? 'scale-110' : ''} transition-transform`} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <Badge className={`${activeView === tab.id ? 'bg-white/20 text-black' : tab.highlight ? 'bg-[#57ACAF]/30 text-[#57ACAF]' : 'bg-white/20'} text-xs px-1.5 py-0`}>
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <AnimatePresence mode="wait">
          {/* Rest of the component implementation */}
          <div className="text-white">Agent Mode Layout - Content tabs will be implemented here</div>
        </AnimatePresence>
      </ScrollArea>

      {/* MARBIM Co-Pilot Button */}
      <button
        onClick={() => setCopilotOpen(!copilotOpen)}
        className="fixed bottom-24 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 flex items-center justify-center shadow-2xl shadow-[#57ACAF]/30 transition-all duration-300 hover:scale-110 z-50 group"
      >
        <Brain className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        {(awaitingApprovalCount + inProgressCount) > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-[#EAB308] text-black w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            {awaitingApprovalCount + inProgressCount}
          </Badge>
        )}
      </button>

      <AnimatePresence>
        {copilotOpen && (
          <AgentCopilot
            isOpen={copilotOpen}
            onClose={() => setCopilotOpen(false)}
            actions={actions}
            onApprove={onApprove}
            onReject={onReject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
