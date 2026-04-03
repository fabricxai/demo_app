import { motion } from 'motion/react';
import { fabricRightPanelClass } from './fabric/drawerChrome';
import { X, MessageSquare, Activity, BookOpen, Send, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import type { AgentAction } from './AgentModeLayout';

interface AgentCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  actions: AgentAction[];
  onApprove: (actionId: string) => void;
  onReject: (actionId: string) => void;
}

export function AgentCopilot({ isOpen, onClose, actions, onApprove, onReject }: AgentCopilotProps) {
  const [message, setMessage] = useState('');

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={fabricRightPanelClass('w-[480px]', { bottom: 'bottom-0' })}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">MARBIM Co-Pilot</h3>
              <p className="text-xs text-[#6F83A7]">Your AI assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6F83A7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mt-4 bg-white/5 border border-white/10">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
            {actions.length > 0 && (
              <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] ml-1">{actions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4">
                <p className="text-[#6F83A7] text-sm">
                  Hi! I'm MARBIM, your AI co-pilot. Ask me anything or give me instructions to execute workflows.
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask MARBIM anything..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setMessage('');
                  }
                }}
              />
              <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-3">
              {actions.length === 0 ? (
                <div className="text-center text-[#6F83A7] py-12">
                  No activities yet
                </div>
              ) : (
                actions.map((action) => (
                  <div
                    key={action.id}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{action.title}</h4>
                      <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] text-xs">
                        {action.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6F83A7] mb-2">{action.description}</p>
                    {action.status === 'in-progress' && (
                      <div className="text-xs text-[#EAB308]">{action.progress}% complete</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="training" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-medium mb-2">Training Pipeline</h4>
                <p className="text-xs text-[#6F83A7]">
                  Your feedback helps MARBIM learn and improve over time.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
