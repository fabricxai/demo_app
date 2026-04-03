import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Mail, Phone, MapPin, Calendar, Briefcase, Award, 
  TrendingUp, Clock, Target, AlertTriangle, CheckCircle, 
  Activity, BarChart3, Users, Sparkles, BookOpen, FileText,
  UserCheck, TrendingDown, DollarSign, Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface WorkerDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  worker: any;
  onAskMarbim?: (prompt: string) => void;
}

export function WorkerDetailDrawer({ open, onClose, worker, onAskMarbim }: WorkerDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!worker) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  ];

  // Mock performance data
  const weeklyPerformanceData = [
    { day: 'Mon', efficiency: 88, target: 85 },
    { day: 'Tue', efficiency: 90, target: 85 },
    { day: 'Wed', efficiency: 87, target: 85 },
    { day: 'Thu', efficiency: 92, target: 85 },
    { day: 'Fri', efficiency: 91, target: 85 },
  ];

  const monthlyAttendanceData = [
    { month: 'Jul', attendance: 96 },
    { month: 'Aug', attendance: 94 },
    { month: 'Sep', attendance: 97 },
    { month: 'Oct', attendance: 95 },
  ];

  const skillsData = [
    { name: 'Sewing', level: worker.skillLevel || 92 },
    { name: 'Quality Control', level: 85 },
    { name: 'Machine Operation', level: 88 },
    { name: 'Pattern Matching', level: 78 },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[1000px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl mb-1">{worker.name}</h2>
                      <div className="flex items-center gap-3 text-sm text-[#6F83A7]">
                        <span>{worker.workerId}</span>
                        <span>•</span>
                        <span>{worker.department}</span>
                        <span>•</span>
                        <Badge 
                          className={`
                            ${worker.status === 'Active' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' : ''}
                            ${worker.status === 'On Leave' ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20' : ''}
                            ${worker.status === 'Inactive' ? 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20' : ''}
                          `}
                        >
                          {worker.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-[#6F83A7] hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Role</div>
                    <div className="text-lg text-white">{worker.role}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Skill Level</div>
                    <div className="text-lg text-[#57ACAF]">{worker.skillLevel}%</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Current Line</div>
                    <div className="text-lg text-white">{worker.line}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Attendance</div>
                    <div className="text-lg text-[#57ACAF]">95.5%</div>
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
                      
                      {/* Animated underline */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeWorkerTabIndicator"
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
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-[#57ACAF]" />
                          Personal Information
                        </h3>
                        <MarbimAIButton
                          marbimPrompt={`Analyze worker profile for ${worker.name} (${worker.workerId}). Provide: 1) Career development recommendations based on skills and experience, 2) Optimal role placement within organization, 3) Training priorities for skill advancement, 4) Potential for leadership or mentorship roles.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <Mail className="w-4 h-4 text-[#6F83A7]" />
                            <div>
                              <div className="text-xs text-[#6F83A7]">Email</div>
                              <div className="text-sm text-white">{worker.name.toLowerCase().replace(' ', '.')}@factory.com</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <Phone className="w-4 h-4 text-[#6F83A7]" />
                            <div>
                              <div className="text-xs text-[#6F83A7]">Phone</div>
                              <div className="text-sm text-white">+880 1712-345678</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <Calendar className="w-4 h-4 text-[#6F83A7]" />
                            <div>
                              <div className="text-xs text-[#6F83A7]">Join Date</div>
                              <div className="text-sm text-white">Jan 15, 2022</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <MapPin className="w-4 h-4 text-[#6F83A7]" />
                            <div>
                              <div className="text-xs text-[#6F83A7]">Location</div>
                              <div className="text-sm text-white">Dhaka, Bangladesh</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Assignment */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-5 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-[#57ACAF]" />
                        Current Assignment
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Production Line</div>
                            <div className="text-white">{worker.line}</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                            Day Shift
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Department</div>
                            <div className="text-white">{worker.department}</div>
                          </div>
                          <div className="text-sm text-[#6F83A7]">Primary</div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Supervisor</div>
                            <div className="text-white">Ahmed Hassan</div>
                          </div>
                          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Skills Overview */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#57ACAF]" />
                          Skills Overview
                        </h3>
                        <MarbimAIButton
                          marbimPrompt={`Analyze skill profile for ${worker.name}. Provide: 1) Skill gaps compared to role requirements, 2) Adjacent skills for cross-training, 3) Timeline for achieving proficiency targets, 4) Recommended training programs and mentors.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-4">
                        {skillsData.map((skill, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white">{skill.name}</span>
                              <span className="text-sm text-[#57ACAF]">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    {/* Performance Overview */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <div className="text-2xl text-white">{worker.skillLevel}%</div>
                            <div className="text-xs text-[#6F83A7]">Efficiency</div>
                          </div>
                        </div>
                        <div className="text-xs text-[#57ACAF]">+3.2% vs last month</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div>
                            <div className="text-2xl text-white">98.5%</div>
                            <div className="text-xs text-[#6F83A7]">Quality Score</div>
                          </div>
                        </div>
                        <div className="text-xs text-[#EAB308]">Above target</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-[#6F83A7]" />
                          </div>
                          <div>
                            <div className="text-2xl text-white">1,245</div>
                            <div className="text-xs text-[#6F83A7]">Units/Day</div>
                          </div>
                        </div>
                        <div className="text-xs text-[#6F83A7]">Avg output</div>
                      </div>
                    </div>

                    {/* Weekly Performance Chart */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-white mb-2 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                            Weekly Performance Trend
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Daily efficiency vs target over the past week</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze weekly performance trend for ${worker.name}. Provide: 1) Days with performance dips and potential causes, 2) Consistency score and reliability assessment, 3) Comparison with peer performance, 4) Recommendations for sustaining high performance.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={weeklyPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="day" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                          <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                            labelStyle={{ color: '#ffffff' }}
                            formatter={(value: any) => `${value}%`}
                          />
                          <Bar dataKey="efficiency" fill="#57ACAF" name="Efficiency" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="target" fill="#EAB308" name="Target" radius={[4, 4, 0, 0]} opacity={0.3} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Attendance Record */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-white mb-2 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-[#57ACAF]" />
                            Attendance Record
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Monthly attendance rate over time</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze attendance record for ${worker.name}. Identify: 1) Attendance patterns and reliability, 2) Any concerning absence trends, 3) Impact on team productivity, 4) Recognition opportunities for excellent attendance.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={240}>
                        <RechartsLine data={monthlyAttendanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                          <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} domain={[90, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                            labelStyle={{ color: '#ffffff' }}
                            formatter={(value: any) => `${value}%`}
                          />
                          <Line type="monotone" dataKey="attendance" stroke="#57ACAF" strokeWidth={3} dot={{ fill: '#57ACAF', r: 5 }} />
                        </RechartsLine>
                      </ResponsiveContainer>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-5 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#57ACAF]" />
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Defect Rate</div>
                            <div className="text-white">1.2%</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                            Excellent
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Rework Rate</div>
                            <div className="text-white">2.8%</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                            Good
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">On-Time Completion</div>
                            <div className="text-white">97.5%</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                            Excellent
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div className="space-y-6">
                    {/* Assignment History */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-white flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-[#57ACAF]" />
                          Assignment History
                        </h3>
                        <MarbimAIButton
                          marbimPrompt={`Analyze assignment history for ${worker.name}. Provide: 1) Performance across different lines/departments, 2) Best role fit based on historical data, 3) Adaptability and learning curve analysis, 4) Recommendations for future assignments.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-4">
                        {[
                          { line: 'Line 1', period: 'Jan 2022 - Present', role: worker.role, performance: 92 },
                          { line: 'Line 3', period: 'Jun 2023 - Dec 2023', role: 'Operator', performance: 88 },
                          { line: 'Line 2', period: 'Jan 2022 - May 2023', role: 'Junior Operator', performance: 82 },
                        ].map((assignment, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="text-white mb-1">{assignment.line}</div>
                                <div className="text-sm text-[#6F83A7]">{assignment.period}</div>
                              </div>
                              <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20">
                                {assignment.role}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <Progress value={assignment.performance} className="h-2" />
                              </div>
                              <span className="text-sm text-[#57ACAF]">{assignment.performance}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Training History */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-5 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#57ACAF]" />
                        Training & Certifications
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Advanced Sewing Techniques', date: 'Oct 2024', status: 'Completed', score: 95 },
                          { name: 'Quality Control Fundamentals', date: 'Aug 2024', status: 'Completed', score: 88 },
                          { name: 'Machine Maintenance Basics', date: 'Jun 2024', status: 'Completed', score: 92 },
                        ].map((training, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                              <div>
                                <div className="text-sm text-white">{training.name}</div>
                                <div className="text-xs text-[#6F83A7]">{training.date}</div>
                              </div>
                            </div>
                            <div className="text-sm text-[#57ACAF]">{training.score}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Reviews */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-5 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#57ACAF]" />
                        Performance Reviews
                      </h3>
                      <div className="space-y-4">
                        {[
                          { date: 'Q3 2024', rating: 4.5, feedback: 'Excellent performance with consistent high-quality output. Shows strong leadership potential.' },
                          { date: 'Q2 2024', rating: 4.2, feedback: 'Good progress in skill development. Improved efficiency and reduced defect rate.' },
                        ].map((review, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-white">{review.date}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i < Math.floor(review.rating) ? 'bg-[#EAB308]' : 'bg-white/20'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-[#6F83A7]">{review.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Insights Tab */}
                {activeTab === 'ai-insights' && (
                  <div className="space-y-6">
                    {/* AI Overview Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-6 h-6 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">AI Worker Analysis</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Comprehensive AI-powered insights for {worker.name} based on performance history, skills, attendance, and potential.
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton
                        marbimPrompt={`Provide comprehensive worker analysis for ${worker.name} (${worker.workerId}). Include: 1) Overall performance assessment and strengths, 2) Areas for improvement and development opportunities, 3) Career progression recommendations, 4) Attrition risk analysis, 5) Optimal assignment and role placement, 6) Training priorities for skill advancement, 7) Potential for leadership or specialized roles, 8) Peer comparison and ranking.`}
                        onAskMarbim={onAskMarbim}
                        size="lg"
                      />
                    </div>

                    {/* Strengths */}
                    <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                          Key Strengths
                        </h4>
                        <MarbimAIButton
                          marbimPrompt={`Analyze key strengths for ${worker.name}. Provide: 1) Detailed breakdown of top skills and capabilities, 2) How to leverage strengths for team benefit, 3) Recognition and reward recommendations, 4) Opportunities to mentor others.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                          <p className="text-sm text-[#6F83A7]">
                            <span className="text-white">High Efficiency:</span> Consistently performs above target with {worker.skillLevel}% efficiency rating, exceeding department average by 7%.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                          <p className="text-sm text-[#6F83A7]">
                            <span className="text-white">Excellent Attendance:</span> 95.5% attendance rate with minimal unplanned absences, demonstrating strong reliability.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                          <p className="text-sm text-[#6F83A7]">
                            <span className="text-white">Quality Focus:</span> 98.5% quality score with 1.2% defect rate, well below industry standards.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                          <p className="text-sm text-[#6F83A7]">
                            <span className="text-white">Fast Learner:</span> Rapidly acquired advanced skills through training programs with 91% average score.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Development Opportunities */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-[#6F83A7]" />
                          Development Opportunities
                        </h4>
                        <MarbimAIButton
                          marbimPrompt={`Identify development opportunities for ${worker.name}. Provide: 1) Specific skills to develop for career advancement, 2) Training programs and timeline, 3) Mentorship pairing recommendations, 4) Stretch assignments for growth.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-white">Pattern Matching Skills</div>
                            <span className="text-xs text-[#6F83A7]">78% proficiency</span>
                          </div>
                          <p className="text-xs text-[#6F83A7] mb-2">
                            Recommend advanced training to reach 90%+ proficiency level for promotion eligibility.
                          </p>
                          <Progress value={78} className="h-1.5" />
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-white">Leadership & Mentoring</div>
                            <span className="text-xs text-[#EAB308]">Development needed</span>
                          </div>
                          <p className="text-xs text-[#6F83A7]">
                            Strong candidate for team lead role. Recommend leadership training and junior worker mentorship.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[#EAB308]" />
                          AI Recommendations
                        </h4>
                        <MarbimAIButton
                          marbimPrompt={`Generate actionable recommendations for ${worker.name}. Provide: 1) Immediate next steps for manager, 2) 30-60-90 day development plan, 3) Career path options, 4) Resource allocation suggestions, 5) Risk mitigation for retention.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-white mb-1">Consider for Team Lead Promotion</div>
                            <p className="text-sm text-[#6F83A7]">
                              Strong performance metrics and reliability make this worker an excellent candidate for supervisory role within next 6 months.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-lg">
                          <BookOpen className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-white mb-1">Enroll in Advanced Training</div>
                            <p className="text-sm text-[#6F83A7]">
                              Schedule for Pattern Matching Advanced course to close skill gap and expand operational flexibility.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-[#6F83A7]/10 border border-[#6F83A7]/20 rounded-lg">
                          <Users className="w-5 h-5 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-white mb-1">Assign Mentorship Role</div>
                            <p className="text-sm text-[#6F83A7]">
                              Pair with 2-3 junior workers to develop leadership skills while improving team capability.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attrition Risk */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h4 className="text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#57ACAF]" />
                        Attrition Risk Assessment
                      </h4>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <Progress value={15} className="h-3" />
                        </div>
                        <span className="text-[#57ACAF]">Low Risk (15%)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <div className="text-xs text-[#6F83A7] mb-1">Engagement</div>
                          <div className="text-sm text-[#57ACAF]">High</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <div className="text-xs text-[#6F83A7] mb-1">Satisfaction</div>
                          <div className="text-sm text-[#57ACAF]">High</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <div className="text-xs text-[#6F83A7] mb-1">Growth</div>
                          <div className="text-sm text-[#EAB308]">Moderate</div>
                        </div>
                      </div>
                      <p className="text-sm text-[#6F83A7] mt-4">
                        Worker shows strong engagement and satisfaction. Provide growth opportunities through promotion or advanced training to maintain retention.
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-t from-white/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Worker
                  </Button>
                </div>
                <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Update Record
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
