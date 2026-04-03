import { motion } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { X, Settings, FileText, Sparkles, TrendingUp, AlertTriangle, Wrench, Calendar, DollarSign, Clock, CheckCircle2, Activity, ThermometerSun, Zap } from 'lucide-react';
import { useState, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarbimAIButton } from './MarbimAIButton';
import { toast } from 'sonner';

interface MachineDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  machine: any;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export function MachineDetailDrawer({ isOpen, onClose, machine }: MachineDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !machine) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'maintenance', label: 'Maintenance History', icon: Wrench },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: 'bg-[#57ACAF]/10', border: 'border-[#57ACAF]/30', text: 'text-[#57ACAF]' };
      case 'Under Maintenance':
        return { bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]/30', text: 'text-[#EAB308]' };
      case 'Breakdown':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      default:
        return { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white' };
    }
  };

  const statusColors = getStatusColor(machine.status);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${files.length} document(s) uploaded successfully`);
    
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('Document removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-white mb-1">{machine.id}</h2>
                <p className="text-sm text-[#6F83A7]">{machine.type} • {machine.location}</p>
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
                {machine.status}
              </Badge>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Uptime</div>
              <div className="text-lg text-white">{machine.uptime}%</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Last Service</div>
              <div className="text-sm text-white">{machine.lastService}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Next Service</div>
              <div className="text-sm text-white">{machine.nextService}</div>
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
                    layoutId="activeMachineTabIndicator"
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
              {/* Machine Specifications */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Machine Specifications</h3>
                  <MarbimAIButton 
                    prompt={`Provide detailed analysis of ${machine.type} machine ${machine.id}. Include maintenance recommendations and optimization opportunities.`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Machine ID</span>
                      <span className="text-sm text-white">{machine.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Type</span>
                      <span className="text-sm text-white">{machine.type}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Brand</span>
                      <span className="text-sm text-white">{machine.brand}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[#6F83A7]">Model</span>
                      <span className="text-sm text-white">{machine.model || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Location</span>
                      <span className="text-sm text-white">{machine.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Technician</span>
                      <span className="text-sm text-white">{machine.technician}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-[#6F83A7]">Service Interval</span>
                      <span className="text-sm text-white">{machine.serviceInterval}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[#6F83A7]">Install Date</span>
                      <span className="text-sm text-white">{machine.installDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Performance Metrics</h3>
                  </div>
                  <MarbimAIButton 
                    prompt={`Analyze performance metrics for ${machine.id}. Compare uptime ${machine.uptime}% with industry benchmarks and suggest improvements.`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                      <div className="text-xs text-[#6F83A7]">Uptime</div>
                    </div>
                    <div className="text-2xl text-white">{machine.uptime}%</div>
                    <div className="text-xs text-[#6F83A7] mt-1">Last 30 days</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#EAB308]" />
                      <div className="text-xs text-[#6F83A7]">Efficiency</div>
                    </div>
                    <div className="text-2xl text-white">{machine.efficiency || '92%'}</div>
                    <div className="text-xs text-[#6F83A7] mt-1">Current cycle</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      <div className="text-xs text-[#6F83A7]">Downtime</div>
                    </div>
                    <div className="text-2xl text-white">{machine.downtime || '2.3h'}</div>
                    <div className="text-xs text-[#6F83A7] mt-1">This month</div>
                  </div>
                </div>
              </div>

              {/* IoT Sensor Data */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-[#EAB308]" />
                    <h3 className="text-white">Real-time IoT Sensor Data</h3>
                  </div>
                  <MarbimAIButton 
                    prompt={`Analyze IoT sensor readings for ${machine.id}. Temperature: ${machine.temperature || '72°C'}, Vibration: ${machine.vibration || 'Normal'}, Current: ${machine.currentDraw || '8.2A'}. Identify anomalies and predict potential failures.`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Temperature</div>
                    <div className="text-lg text-white">{machine.temperature || '72°C'}</div>
                    <Badge className="mt-2 bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Normal</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Vibration</div>
                    <div className="text-lg text-white">{machine.vibration || 'Normal'}</div>
                    <Badge className="mt-2 bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Stable</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Current Draw</div>
                    <div className="text-lg text-white">{machine.currentDraw || '8.2A'}</div>
                    <Badge className="mt-2 bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Normal</Badge>
                  </div>
                </div>
              </div>

              {/* Maintenance Cost */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Maintenance Cost Overview</h3>
                  </div>
                  <MarbimAIButton 
                    prompt={`Analyze maintenance cost trends for ${machine.id}. Current month: $${machine.monthlyMaintCost || '450'}, YTD: $${machine.ytdMaintCost || '5,200'}. Suggest cost optimization strategies.`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">This Month</div>
                    <div className="text-2xl text-white">${machine.monthlyMaintCost || '450'}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Year to Date</div>
                    <div className="text-2xl text-white">${machine.ytdMaintCost || '5,200'}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Avg. per Month</div>
                    <div className="text-2xl text-white">${machine.avgMaintCost || '520'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Maintenance History</h3>
                <MarbimAIButton 
                  prompt={`Analyze maintenance history for ${machine.id}. Identify patterns in service frequency, parts replacement, and suggest preventive maintenance schedule optimization.`}
                />
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#57ACAF] via-[#EAB308] to-transparent" />

                {/* Timeline Events */}
                <div className="space-y-6">
                  <div className="relative pl-14">
                    <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white">Preventive Maintenance</h4>
                        <span className="text-xs text-[#6F83A7]">{machine.lastService}</span>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Routine lubrication, calibration check, belt tension adjustment
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                        <span>Technician: {machine.technician}</span>
                        <span>•</span>
                        <span>Cost: $180</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-14">
                    <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white">Parts Replacement</h4>
                        <span className="text-xs text-[#6F83A7]">2024-09-15</span>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Replaced drive belt and motor bearings
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                        <span>Technician: John Smith</span>
                        <span>•</span>
                        <span>Cost: $420</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-14">
                    <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-500/60 flex items-center justify-center shadow-lg shadow-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white">Emergency Repair</h4>
                        <span className="text-xs text-[#6F83A7]">2024-08-22</span>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Motor overheating issue - replaced cooling fan
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                        <span>Technician: Mike Johnson</span>
                        <span>•</span>
                        <span>Downtime: 4.5 hrs</span>
                        <span>•</span>
                        <span>Cost: $650</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Machine Documents</h3>
                <MarbimAIButton 
                  prompt={`What essential documentation should be maintained for ${machine.type} machines? Suggest missing documents and compliance requirements.`}
                />
              </div>

              <div className="space-y-3">
                {['Operation Manual', 'Service Manual', 'Warranty Certificate', 'Safety Procedures'].map((doc, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div>
                          <div className="text-white">{doc}</div>
                          <div className="text-xs text-[#6F83A7]">PDF • 2.4 MB</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-[rgb(255,255,255)] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-180 bg-[rgba(255,255,255,0)]"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div>
                          <div className="text-white">{file.name}</div>
                          <div className="text-xs text-[#6F83A7]">{file.type} • {formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-[rgb(255,255,255)] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-180 bg-[rgb(255,255,255)]"
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/10 text-red-500 hover:bg-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-180 bg-[rgb(255,255,255)]"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileChange}
              />

              <Button
                variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                onClick={handleFileUpload}
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              {/* Health Score */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">AI Health Score</h3>
                  </div>
                  <MarbimAIButton 
                    prompt={`Calculate comprehensive health score for ${machine.id}. Analyze all performance metrics, maintenance history, IoT sensor data, and predict remaining useful life.`}
                  />
                </div>
                <div className="text-center py-6">
                  <div className="text-6xl mb-2 bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                    {machine.healthScore || '87'}
                  </div>
                  <div className="text-[#6F83A7]">Overall Health Score</div>
                  <Badge className="mt-4 bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                    Good Condition
                  </Badge>
                </div>
              </div>

              {/* Predicted Issues */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Predicted Maintenance Needs</h3>
                  <MarbimAIButton 
                    prompt={`Predict upcoming maintenance needs for ${machine.id} based on historical patterns, current performance, and IoT sensor trends. Provide timeline and cost estimates.`}
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white">Belt Replacement</div>
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                        In 45 days
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Drive belt showing 78% wear based on vibration analysis
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white">Calibration Service</div>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                        In 21 days
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Scheduled calibration check due per service interval
                    </p>
                  </div>
                </div>
              </div>

              {/* Optimization Recommendations */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">AI Optimization Recommendations</h3>
                  <MarbimAIButton 
                    prompt={`Provide optimization recommendations for ${machine.id}. Include energy efficiency improvements, maintenance schedule optimization, and operational best practices.`}
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#57ACAF]" />
                      <div className="text-white">Energy Efficiency</div>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Reduce idle time by 15% during shift changes - potential savings: $280/month
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#EAB308]" />
                      <div className="text-white">Maintenance Schedule</div>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Shift preventive maintenance to off-peak hours for minimal production impact
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
              toast.success('Maintenance task scheduled');
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 transition-all duration-180"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
          <Button
            onClick={() => {
              toast.info('Generating health report...');
            }}
            variant="outline"
            className="flex-1 border-white/10 text-white hover:bg-white/5 transition-all duration-180 bg-[rgba(255,255,255,0)]"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </motion.div>
  );
}