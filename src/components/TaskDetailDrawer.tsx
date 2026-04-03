import { motion } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { X, Wrench, Clock, CheckCircle2, Sparkles, AlertTriangle, Calendar, User, MapPin, FileText, Settings, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarbimAIButton } from './MarbimAIButton';
import { toast } from 'sonner';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

export function TaskDetailDrawer({ isOpen, onClose, task }: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !task) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wrench },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: 'bg-[#57ACAF]/10', border: 'border-[#57ACAF]/30', text: 'text-[#57ACAF]' };
      case 'In Progress':
        return { bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]/30', text: 'text-[#EAB308]' };
      case 'Scheduled':
        return { bg: 'bg-[#6F83A7]/10', border: 'border-[#6F83A7]/30', text: 'text-[#6F83A7]' };
      default:
        return { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      case 'Medium':
        return { bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]/30', text: 'text-[#EAB308]' };
      case 'Low':
        return { bg: 'bg-[#6F83A7]/10', border: 'border-[#6F83A7]/30', text: 'text-[#6F83A7]' };
      default:
        return { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white' };
    }
  };

  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={fabricRightDrawerClass('max-w-[1000px]')}
    >
      {/* Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative px-8 py-6">
          {/* Top Row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-white mb-1">{task.id}</h2>
                <p className="text-sm text-[#6F83A7]">{task.task}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-180"
            >
              <X className="w-5 h-5 text-[#6F83A7]" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Status</div>
              <Badge className={`${statusColors.bg} ${statusColors.border} ${statusColors.text} border`}>
                {task.status}
              </Badge>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Priority</div>
              <Badge className={`${priorityColors.bg} ${priorityColors.border} ${priorityColors.text} border`}>
                {task.priority}
              </Badge>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Scheduled</div>
              <div className="text-sm text-white">{task.scheduled}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Duration</div>
              <div className="text-sm text-white">{task.estimatedDuration || task.duration || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center px-8 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                  ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="relative z-10">{tab.label}</span>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTaskTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-8 py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Task Details */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Task Details</h3>
                  <MarbimAIButton 
                    prompt={`Provide detailed analysis of maintenance task ${task.id} for ${task.machine}. Include task breakdown, resource requirements, and optimization recommendations.`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Task ID</span>
                      <span className="text-sm text-white">{task.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Machine</span>
                      <span className="text-sm text-white">{task.machine}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Machine Type</span>
                      <span className="text-sm text-white">{task.machineType}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[#6F83A7]">Task Type</span>
                      <span className="text-sm text-white">{task.type}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Technician</span>
                      <span className="text-sm text-white">{task.technician}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Location</span>
                      <span className="text-sm text-white">{task.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Scheduled Date</span>
                      <span className="text-sm text-white">{task.scheduled}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[#6F83A7]">Est. Duration</span>
                      <span className="text-sm text-white">{task.estimatedDuration || task.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Task Description</h3>
                </div>
                <p className="text-sm text-[#6F83A7] leading-relaxed">
                  {task.task}
                </p>
                <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-2">Maintenance Checklist:</div>
                  <ul className="space-y-2 text-sm text-white">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                      <span>Inspect equipment condition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                      <span>Perform necessary adjustments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                      <span>Replace worn components if needed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                      <span>Test functionality and document results</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Required Resources */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Required Resources</h3>
                  <MarbimAIButton 
                    prompt={`What tools, parts, and resources are needed for ${task.type} maintenance task on ${task.machineType}? Include cost estimates and availability status.`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-4 h-4 text-[#57ACAF]" />
                      <div className="text-sm text-white">Tools Required</div>
                    </div>
                    <div className="text-xs text-[#6F83A7]">Standard maintenance toolkit, calibration equipment</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-[#EAB308]" />
                      <div className="text-sm text-white">Technicians</div>
                    </div>
                    <div className="text-xs text-[#6F83A7]">1 technician (assigned)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Task Progress Timeline</h3>
                <MarbimAIButton 
                  prompt={`Analyze progress of task ${task.id}. Provide insights on completion timeline, potential delays, and recommendations to optimize execution.`}
                />
              </div>

              {/* Progress Overview */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Completion Status</h3>
                  </div>
                </div>
                <div className="text-center py-6">
                  <div className="text-6xl mb-2 bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                    {task.status === 'Completed' ? '100' : task.status === 'In Progress' ? '45' : '0'}%
                  </div>
                  <div className="text-[#6F83A7]">Task Completion</div>
                  <Badge className={`mt-4 ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                    {task.status}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#57ACAF] via-[#EAB308] to-transparent" />

                <div className="space-y-6">
                  <div className="relative pl-14">
                    <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white">Task Scheduled</h4>
                        <span className="text-xs text-[#6F83A7]">{task.scheduled}</span>
                      </div>
                      <p className="text-sm text-[#6F83A7]">
                        Maintenance task created and assigned to {task.technician}
                      </p>
                    </div>
                  </div>

                  {task.status !== 'Scheduled' && (
                    <div className="relative pl-14">
                      <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white">Task Started</h4>
                          <span className="text-xs text-[#6F83A7]">{task.scheduled}</span>
                        </div>
                        <p className="text-sm text-[#6F83A7]">
                          Work in progress - Equipment inspection underway
                        </p>
                      </div>
                    </div>
                  )}

                  {task.status === 'Completed' && (
                    <div className="relative pl-14">
                      <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white">Task Completed</h4>
                          <span className="text-xs text-[#6F83A7]">{task.completed || task.scheduled}</span>
                        </div>
                        <p className="text-sm text-[#6F83A7]">
                          Maintenance completed successfully. Equipment tested and verified.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Task Documents</h3>
                <MarbimAIButton 
                  prompt={`What documentation is required for ${task.type} maintenance on ${task.machineType}? Suggest essential reports and compliance documents.`}
                />
              </div>

              <div className="space-y-3">
                {['Maintenance Procedure', 'Safety Checklist', 'Parts List', 'Completion Report'].map((doc, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div>
                          <div className="text-white">{doc}</div>
                          <div className="text-xs text-[#6F83A7]">PDF • 1.2 MB</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-180 bg-[rgba(255,255,255,0)]"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              {/* Task Efficiency Score */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">AI Efficiency Score</h3>
                  </div>
                  <MarbimAIButton 
                    prompt={`Calculate efficiency score for task ${task.id}. Analyze resource utilization, timing, and provide optimization recommendations.`}
                  />
                </div>
                <div className="text-center py-6">
                  <div className="text-6xl mb-2 bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                    92
                  </div>
                  <div className="text-[#6F83A7]">Task Efficiency Score</div>
                  <Badge className="mt-4 bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                    Highly Efficient
                  </Badge>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Risk Assessment</h3>
                  <MarbimAIButton 
                    prompt={`Assess risks for maintenance task ${task.id} on ${task.machine}. Identify potential issues, safety concerns, and mitigation strategies.`}
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white">Safety Risk</div>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                        Low
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Standard safety procedures sufficient for this task
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white">Completion Risk</div>
                      <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                        Very Low
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      All required resources available, technician experienced
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">AI Recommendations</h3>
                  <MarbimAIButton 
                    prompt={`Provide optimization recommendations for task ${task.id}. Include best practices, time savings opportunities, and quality improvements.`}
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#57ACAF]" />
                      <div className="text-white">Time Optimization</div>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Schedule during production downtime to minimize impact - saves 30 mins setup time
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-[#EAB308]" />
                      <div className="text-white">Preventive Action</div>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Consider scheduling similar maintenance for nearby machines to optimize technician time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-white/10 px-8 py-4 bg-gradient-to-r from-white/5 via-transparent to-white/5">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              toast.success(task.status === 'Completed' ? 'Task reopened' : 'Task marked as complete');
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 transition-all duration-180"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {task.status === 'Completed' ? 'Reopen Task' : 'Mark Complete'}
          </Button>
          <Button
            onClick={() => {
              toast.info('Reassigning task...');
            }}
            variant="outline"
            className="flex-1 border-white/10 text-white hover:bg-white/5 transition-all duration-180 bg-[rgba(255,255,255,0)]"
          >
            <User className="w-4 h-4 mr-2" />
            Reassign
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
