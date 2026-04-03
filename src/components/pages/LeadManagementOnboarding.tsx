import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Upload, Mail, Target, Sparkles, ArrowRight, ArrowLeft,
  CheckCircle, AlertCircle, Loader2, FileText, Globe, 
  Database, Settings, Link as LinkIcon, Zap, Brain, Rocket, ChevronRight, Lightbulb, X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import marbimLogoMark from '../../assets/marbim-logo.png';

interface LeadManagementOnboardingProps {
  onNavigate: (page: string) => void;
  onAskMarbim: (prompt: string) => void;
}

export function LeadManagementOnboarding({ onNavigate, onAskMarbim }: LeadManagementOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [leadSource, setLeadSource] = useState('');
  const [emailProvider, setEmailProvider] = useState('');
  const [scoringPriority, setScoringPriority] = useState('');
  const [autoFollowup, setAutoFollowup] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'Upload Leads', icon: Upload, color: '#57ACAF', desc: 'Import your existing leads' },
    { number: 2, title: 'Connect Email', icon: Mail, color: '#EAB308', desc: 'Integrate your email' },
    { number: 3, title: 'AI Scoring', icon: Target, color: '#57ACAF', desc: 'Configure lead scoring' },
    { number: 4, title: 'Activate AI', icon: Sparkles, color: '#EAB308', desc: 'Enable automation' },
  ];

  const handleNext = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCompletedSteps([...completedSteps, currentStep]);
      setIsProcessing(false);
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }, 1500);
  };

  const handleComplete = () => {
    toast.success('🎉 Lead Management module activated!');
    setTimeout(() => {
      onNavigate('lead-management');
    }, 2000);
  };

  const getStepStatus = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
      toast.success(`${fileArray.length} file(s) uploaded successfully`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#57ACAF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-gradient-to-r from-[#EAB308]/20 to-[#57ACAF]/20 text-white border border-[#EAB308]/30 px-4 py-2 mb-6">
              <Settings className="w-4 h-4 inline mr-2" />
              Module Setup
            </Badge>
            <h1 className="text-6xl font-bold text-white mb-4">
              Let's Get You Started
            </h1>
            <p className="text-2xl text-[#6F83A7]">
              4 simple steps to activate AI-powered lead management
            </p>
          </motion.div>

          {/* Progress Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-20"
          >
            {/* Step Indicators */}
            <div className="relative mb-6">
              {/* Steps */}
              <div className="grid grid-cols-4 gap-6">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const status = getStepStatus(step.number);
                  const isActive = status === 'active';
                  const isCompleted = status === 'completed';
                  const isPending = status === 'pending';

                  return (
                    <motion.button
                      key={step.number}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: step.number * 0.15,
                        type: 'spring',
                        damping: 20
                      }}
                      onClick={() => {
                        if (isCompleted || isActive) setCurrentStep(step.number);
                      }}
                      disabled={isPending}
                      whileHover={isCompleted || isActive ? { scale: 1.02, y: -8 } : {}}
                      className={`
                        relative group text-left
                        ${(isCompleted || isActive) ? 'cursor-pointer' : 'cursor-not-allowed'}
                      `}
                    >
                      {/* Background Glow Effect */}
                      {isActive && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.1, 0.4] 
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -inset-4 rounded-3xl blur-2xl"
                          style={{ background: `radial-gradient(circle, ${step.color}50, transparent 70%)` }}
                        />
                      )}

                      {/* Main Card */}
                      <div 
                        className={`
                          relative overflow-hidden rounded-3xl transition-all duration-500
                          ${isCompleted 
                            ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-2 border-[#57ACAF]/50' 
                            : isActive
                            ? 'border-2'
                            : 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 opacity-50'
                          }
                        `}
                        style={isActive ? { 
                          borderColor: step.color,
                          background: `linear-gradient(135deg, ${step.color}12, transparent)`,
                          boxShadow: `0 24px 48px -12px ${step.color}40`
                        } : isCompleted ? {
                          boxShadow: '0 20px 40px -12px rgba(87, 172, 175, 0.3)'
                        } : {}}
                      >
                        {/* Animated Corner Accent */}
                        {isActive && (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              className="absolute -top-8 -right-8 w-32 h-32 opacity-20"
                              style={{ 
                                background: `conic-gradient(from 0deg, transparent, ${step.color}, transparent)`,
                                filter: 'blur(20px)'
                              }}
                            />
                            <div 
                              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                              style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                            />
                          </>
                        )}

                        {/* Content Container */}
                        <div className="relative p-8">
                          {/* Header: Number + Status */}
                          <div className="flex items-start justify-between mb-6">
                            {/* Step Number Badge */}
                            <motion.div 
                              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`
                                relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg
                                ${isActive ? 'text-white shadow-2xl' : ''}
                                ${isCompleted ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                                ${isPending ? 'bg-white/5 text-[#6F83A7]' : ''}
                              `}
                              style={isActive ? { 
                                background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
                                boxShadow: `0 8px 24px ${step.color}60`
                              } : {}}
                            >
                              {step.number}
                              
                              {/* Pulsing Ring for Active */}
                              {isActive && (
                                <motion.div
                                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute inset-0 rounded-2xl border-2"
                                  style={{ borderColor: step.color }}
                                />
                              )}
                            </motion.div>

                            {/* Completion Check */}
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  type: 'spring', 
                                  damping: 12,
                                  delay: 0.2
                                }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/70 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30"
                              >
                                <Check className="w-6 h-6 text-white" />
                              </motion.div>
                            )}
                          </div>

                          {/* Icon Display */}
                          <div className="mb-6">
                            <motion.div 
                              whileHover={isActive || isCompleted ? { rotate: [0, -10, 10, 0] } : {}}
                              transition={{ duration: 0.5 }}
                              className={`
                                inline-flex w-20 h-20 rounded-2xl items-center justify-center
                                ${isCompleted ? 'bg-gradient-to-br from-[#57ACAF]/25 to-[#57ACAF]/10' : ''}
                                ${isPending ? 'bg-white/5' : ''}
                              `}
                              style={isActive ? { 
                                background: `linear-gradient(135deg, ${step.color}25, ${step.color}10)`,
                                boxShadow: `0 12px 32px ${step.color}25`
                              } : {}}
                            >
                              <Icon 
                                className="w-10 h-10 transition-all"
                                style={{ 
                                  color: isCompleted 
                                    ? '#57ACAF' 
                                    : isActive 
                                    ? step.color 
                                    : '#6F83A7' 
                                }} 
                              />
                            </motion.div>
                          </div>

                          {/* Text Content */}
                          <div className="space-y-2">
                            <h3 className={`
                              font-medium text-xl transition-colors
                              ${isCompleted || isActive ? 'text-white' : 'text-[#6F83A7]'}
                            `}>
                              {step.title}
                            </h3>
                            <p className={`
                              text-sm leading-relaxed transition-colors
                              ${isActive ? 'text-white/80' : 'text-[#6F83A7]'}
                            `}>
                              {step.desc}
                            </p>
                          </div>

                          {/* Status Indicator */}
                          <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs">
                              {isCompleted && (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-[#57ACAF]" />
                                  <span className="text-[#57ACAF] font-medium">Completed</span>
                                </>
                              )}
                              {isActive && (
                                <>
                                  <motion.div 
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: step.color }}
                                  />
                                  <span className="font-medium" style={{ color: step.color }}>
                                    In Progress
                                  </span>
                                </>
                              )}
                              {isPending && (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-white/20" />
                                  <span className="text-[#6F83A7]">Pending</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Hover Shimmer Effect */}
                        {(isActive || isCompleted) && (
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                            initial={false}
                            transition={{ duration: 0.4 }}
                          >
                            <div 
                              className="absolute inset-0 rounded-3xl"
                              style={{
                                background: `linear-gradient(135deg, transparent 0%, ${step.color}08 50%, transparent 100%)`
                              }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Overall Progress</span>
                <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 px-3 py-1">
                  Step {currentStep} of 4
                </Badge>
              </div>
              <Progress value={progress} className="h-2 bg-white/10" />
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Content */}
            <div>
              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Upload Your Leads</h2>
                        <p className="text-[#6F83A7]">Import existing leads to get started</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-3 block text-lg">Import Method</Label>
                        <Select value={leadSource} onValueChange={setLeadSource}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-14 text-base">
                            <SelectValue placeholder="Choose how to import" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">Upload CSV File</SelectItem>
                            <SelectItem value="excel">Upload Excel File</SelectItem>
                            <SelectItem value="crm">Connect CRM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {leadSource && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-2 border-dashed border-[#57ACAF]/30 rounded-2xl p-12 text-center hover:border-[#57ACAF]/50 transition-all bg-[#57ACAF]/5 group cursor-pointer"
                          onClick={handleFileClick}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Upload className="w-16 h-16 text-[#57ACAF] mx-auto mb-6 group-hover:scale-110 transition-transform" />
                          <h3 className="text-white text-xl font-medium mb-3">Drop your file here</h3>
                          <p className="text-[#6F83A7] mb-6">or click to browse</p>
                          <Button 
                            variant="outline" 
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileClick();
                            }}
                          >
                            <FileText className="w-5 h-5 mr-2" />
                            Browse Files
                          </Button>
                        </motion.div>
                      )}

                      {/* Uploaded Files Display */}
                      {uploadedFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <Label className="text-white text-lg">Uploaded Files ({uploadedFiles.length})</Label>
                          {uploadedFiles.map((file, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-180"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-[#57ACAF]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate">{file.name}</p>
                                  <p className="text-sm text-[#6F83A7]">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-5 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium mb-1">Required Fields</p>
                          <p className="text-sm text-[#6F83A7]">
                            Company Name, Contact Name, Email, Phone, Industry
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Connect Your Email</h2>
                        <p className="text-[#6F83A7]">Enable automated communication</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-3 block text-lg">Email Provider</Label>
                        <Select value={emailProvider} onValueChange={setEmailProvider}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-14 text-base">
                            <SelectValue placeholder="Choose your email provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gmail">Gmail / Google Workspace</SelectItem>
                            <SelectItem value="outlook">Outlook / Microsoft 365</SelectItem>
                            <SelectItem value="smtp">Custom SMTP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {emailProvider === 'gmail' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 text-center"
                        >
                          <div className="w-20 h-20 rounded-2xl bg-[#EAB308]/20 flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-10 h-10 text-[#EAB308]" />
                          </div>
                          <h3 className="text-white text-xl font-medium mb-3">Connect Gmail</h3>
                          <p className="text-[#6F83A7] mb-6">
                            Secure OAuth 2.0 connection. We'll never store your password.
                          </p>
                          <Button className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black px-8 py-6 text-base">
                            <Globe className="w-5 h-5 mr-2" />
                            Sign in with Google
                          </Button>
                        </motion.div>
                      )}

                      <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-5 flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium mb-1">What You'll Get</p>
                          <p className="text-sm text-[#6F83A7]">
                            Automated follow-ups, email tracking, and AI-drafted messages
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Configure AI Scoring</h2>
                        <p className="text-[#6F83A7]">Set lead prioritization rules</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-3 block text-lg">Scoring Priority</Label>
                        <Select value={scoringPriority} onValueChange={setScoringPriority}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-14 text-base">
                            <SelectValue placeholder="What matters most?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Balanced (AI Recommended)</SelectItem>
                            <SelectItem value="value">Order Value Potential</SelectItem>
                            <SelectItem value="fit">Product Fit Match</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white block text-lg">Scoring Factors</Label>
                        {[
                          { name: 'Company Size', weight: 25, color: '#57ACAF' },
                          { name: 'Industry Match', weight: 20, color: '#EAB308' },
                          { name: 'Previous Orders', weight: 30, color: '#57ACAF' },
                          { name: 'Engagement Level', weight: 10, color: '#EAB308' },
                        ].map((factor, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center font-medium text-white"
                                style={{ background: `${factor.color}30` }}
                              >
                                {idx + 1}
                              </div>
                              <span className="text-white">{factor.name}</span>
                            </div>
                            <Badge 
                              className="px-3 py-1"
                              style={{
                                background: `${factor.color}20`,
                                color: factor.color,
                                border: `1px solid ${factor.color}40`
                              }}
                            >
                              {factor.weight}%
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-5 flex items-start gap-3">
                        <Brain className="w-6 h-6 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium mb-1">AI Learning</p>
                          <p className="text-sm text-[#6F83A7]">
                            MARBIM refines scoring based on which leads actually convert
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Activate AI Automation</h2>
                        <p className="text-[#6F83A7]">Configure follow-up automation</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-3 block text-lg">Automation Level</Label>
                        <Select value={autoFollowup} onValueChange={setAutoFollowup}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-14 text-base">
                            <SelectValue placeholder="Choose automation mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft Only (I review & send)</SelectItem>
                            <SelectItem value="semi">Semi-Auto (Auto for warm leads)</SelectItem>
                            <SelectItem value="full">Full Auto (AI handles all)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white mb-3 block text-lg">Brand Voice</Label>
                        <Textarea 
                          placeholder="Describe your communication style... (e.g., Professional yet friendly, focus on quality)"
                          className="min-h-[100px] bg-white/5 border-white/10 text-white resize-none"
                        />
                      </div>

                      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 border border-[#EAB308]/20 rounded-xl p-5 flex items-start gap-3">
                        <Zap className="w-6 h-6 text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium mb-1">Smart Timing</p>
                          <p className="text-sm text-[#6F83A7]">
                            MARBIM sends emails during business hours in each lead's timezone
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  onClick={() => {
                    const newStep = Math.max(1, currentStep - 1);
                    setCurrentStep(newStep);
                    setCompletedSteps(completedSteps.filter(step => step < newStep));
                  }}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 px-8 py-6 text-base"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black px-10 py-6 text-base shadow-lg shadow-[#EAB308]/30"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentStep === 4 ? (
                    <>
                      Complete Setup
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* MARBIM Tips */}
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 backdrop-blur-xl border border-[#EAB308]/30 rounded-2xl p-6 sticky top-8">
                {/* MARBIM AI Logo Header */}
                <div className="relative mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#EAB308]/20 via-[#57ACAF]/20 to-[#EAB308]/20 border border-white/10">
                    {/* Logo Container with animated glow */}
                    <motion.div 
                      className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#EAB308]/30 via-[#57ACAF]/30 to-[#EAB308]/30 border border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(234, 179, 8, 0.3)',
                          '0 0 30px rgba(87, 172, 175, 0.4)',
                          '0 0 20px rgba(234, 179, 8, 0.3)',
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <img
                        src={marbimLogoMark}
                        alt="MARBIM"
                        className="w-10 h-10 object-contain"
                      />
                    </motion.div>
                    
                    {/* MARBIM Branding */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-xl tracking-tight">MARBIM</h3>
                        <Badge className="bg-gradient-to-r from-[#EAB308] to-[#57ACAF] text-black border-0 text-xs px-2 py-0.5">
                          AI
                        </Badge>
                      </div>
                      <p className="text-[#6F83A7] text-xs">Your Intelligent Assistant</p>
                    </div>

                    {/* Sparkle decoration */}
                    <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  </div>
                </div>

                {/* Tips Section */}
                <div className="space-y-3 mb-6">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-3">Smart Tips for You</p>
                  {currentStep === 1 && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#EAB308] text-sm">💡</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">Import at least 50 leads for accurate AI models</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-sm">📊</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">Include order history for better predictions</p>
                      </div>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-sm">🔒</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">Your credentials are encrypted end-to-end</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#EAB308] text-sm">⚡</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">OAuth takes 30 seconds to connect</p>
                      </div>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#EAB308] text-sm">🎯</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">"Balanced" mode works best for new users</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-sm">📈</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">Refine scoring rules anytime</p>
                      </div>
                    </>
                  )}
                  {currentStep === 4 && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-sm">✉️</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">Start with "Draft Only" to build confidence</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-6 h-6 rounded-full bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#EAB308] text-sm">⏰</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">AI optimizes send times by timezone</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Ask MARBIM Button */}
                <button
                  onClick={() => onAskMarbim(`Help me with step ${currentStep} of onboarding. What should I configure?`)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-[#EAB308]/10 to-[#57ACAF]/10 border border-white/20 text-white hover:from-[#EAB308]/20 hover:to-[#57ACAF]/20 hover:border-[#EAB308]/40 transition-all flex items-center justify-between group shadow-lg hover:shadow-[#EAB308]/20"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-sm font-medium">Ask MARBIM for Help</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6F83A7] group-hover:text-[#EAB308] group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Progress Checklist */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-medium mb-4">Checklist</h3>
                <div className="space-y-3">
                  {steps.map((step) => {
                    const status = getStepStatus(step.number);
                    return (
                      <div key={step.number} className="flex items-center gap-3">
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center
                          ${status === 'completed' ? 'bg-[#57ACAF]/20' : 'bg-white/5 border border-white/10'}
                        `}>
                          {status === 'completed' && <Check className="w-3 h-3 text-[#57ACAF]" />}
                          {status === 'active' && <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />}
                        </div>
                        <span className={`text-sm ${status === 'pending' ? 'text-[#6F83A7]' : 'text-white'}`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}