import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { 
  Zap, TrendingUp, Clock, CheckCircle, Play, Pause, Settings, 
  BarChart3, Target, Sparkles, Activity, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

interface AgentTask {
  id: number;
  module: string;
  task: string;
  status: 'running' | 'completed' | 'paused' | 'pending';
  progress: number;
  completedAt?: string;
  savings?: string;
}

const agentTasks: AgentTask[] = [
  {
    id: 1,
    module: 'RFQ & Quotation',
    task: 'Auto-respond to standard RFQ inquiries',
    status: 'running',
    progress: 65,
  },
  {
    id: 2,
    module: 'Supplier Evaluation',
    task: 'Evaluate and rank supplier quotes',
    status: 'completed',
    progress: 100,
    completedAt: '2 hours ago',
    savings: '4.5 hours',
  },
  {
    id: 3,
    module: 'Machine Maintenance',
    task: 'Schedule preventive maintenance',
    status: 'running',
    progress: 45,
  },
  {
    id: 4,
    module: 'Lead Management',
    task: 'Follow up with cold leads',
    status: 'paused',
    progress: 30,
  },
  {
    id: 5,
    module: 'Inventory Management',
    task: 'Generate reorder recommendations',
    status: 'pending',
    progress: 0,
  },
];

export function AgentModeDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(agentTasks);

  const runningCount = tasks.filter(t => t.status === 'running').length;
  const completedToday = tasks.filter(t => t.status === 'completed').length;
  const totalTimeSaved = tasks
    .filter(t => t.savings)
    .reduce((acc, t) => acc + parseFloat(t.savings?.replace(/[^0-9.]/g, '') || '0'), 0);

  const handlePauseTask = (id: number) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, status: 'paused' as const } : t)
    );
    toast.info('Agent task paused');
  };

  const handleResumeTask = (id: number) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, status: 'running' as const } : t)
    );
    toast.success('Agent task resumed');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      running: 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20',
      completed: 'bg-green-500/10 text-green-400 border-green-500/20',
      paused: 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20',
      pending: 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20',
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <PageLayout breadcrumbs={[{ label: 'Agent Mode Dashboard' }]}>
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Agent Mode Dashboard</h1>
            </div>
            <p className="text-[#6F83A7] text-lg">
              Monitor and control AI agents working across your modules
            </p>
          </div>
          <Button
            onClick={() => navigate('/settings')}
            variant="outline"
            className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Agents
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Agents"
          value={runningCount.toString()}
          icon={Activity}
          subtitle="Currently running tasks"
        />
        <KPICard
          title="Completed Today"
          value={completedToday.toString()}
          change={25}
          icon={CheckCircle}
          trend="up"
          subtitle="Tasks finished"
        />
        <KPICard
          title="Time Saved"
          value={`${totalTimeSaved.toFixed(1)}h`}
          change={18}
          icon={Clock}
          trend="up"
          subtitle="This week"
        />
        <KPICard
          title="Efficiency"
          value="94%"
          change={5}
          icon={TrendingUp}
          trend="up"
          subtitle="Agent accuracy rate"
        />
      </div>

      {/* Agent Tasks */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Active Agent Tasks</h2>
          <Badge variant="outline" className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
            <Sparkles className="w-3 h-3 mr-1" />
            {runningCount} Running
          </Badge>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-medium">{task.task}</h3>
                    <Badge variant="outline" className={getStatusBadge(task.status)}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-[#6F83A7] text-sm mb-3">{task.module}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-[#57ACAF] to-[#EAB308] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F83A7]">{task.progress}% complete</span>
                    {task.completedAt && (
                      <span className="text-[#6F83A7]">Completed {task.completedAt}</span>
                    )}
                    {task.savings && (
                      <span className="text-green-400">Saved {task.savings}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {task.status === 'running' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePauseTask(task.id)}
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  {task.status === 'paused' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResumeTask(task.id)}
                      className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const moduleRoutes: Record<string, string> = {
                        'RFQ & Quotation': '/sales/rfq',
                        'Supplier Evaluation': '/resources/suppliers',
                        'Machine Maintenance': '/resources/machines',
                        'Lead Management': '/crm/leads',
                        'Inventory Management': '/operations/inventory',
                      };
                      navigate(moduleRoutes[task.module] || '/');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6 bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#EAB308]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2">AI Recommendation</h3>
            <p className="text-[#6F83A7] mb-4">
              Enable Agent Mode for Finance module to automate invoice processing and payment reminders. 
              Estimated time savings: 12 hours/week.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
            >
              <Target className="w-4 h-4 mr-2" />
              Enable Finance Agent
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
