import { useState, useRef } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MarbimAIButton } from './MarbimAIButton';
import {
  X,
  AlertTriangle,
  FileText,
  Upload,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Users,
  Package,
  Calendar,
  Flag,
  ClipboardList,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

interface LogIssueDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (issueData: any) => void;
  onAskMarbim?: (prompt: string) => void;
  buyers?: Array<{ id: string; buyerName: string; tier: string }>;
}

export function LogIssueDrawer({ open, onClose, onSubmit, onAskMarbim, buyers = [] }: LogIssueDrawerProps) {
  const [formData, setFormData] = useState({
    issueTitle: '',
    buyerId: '',
    buyerName: '',
    category: '',
    severity: '',
    priority: '',
    description: '',
    dateOccurred: new Date().toISOString().split('T')[0],
    affectedOrder: '',
    reportedBy: 'Current User',
    suggestedAction: '',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  const handleBuyerChange = (value: string) => {
    const selectedBuyer = buyers.find(b => b.id === value);
    setFormData({
      ...formData,
      buyerId: value,
      buyerName: selectedBuyer?.buyerName || '',
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.issueTitle || !formData.buyerId || !formData.category || !formData.severity || !formData.description) {
      toast.error('Please fill in all required fields (Title, Buyer, Category, Severity, Description)');
      return;
    }

    // Create issue data object
    const issueData = {
      ...formData,
      id: `issue-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: attachedFiles.map(f => f.name),
      resolutionTime: null,
      assignedTo: 'Unassigned',
    };

    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(issueData);
    }

    toast.success('Issue logged successfully');
    onClose();
    
    // Reset form
    setFormData({
      issueTitle: '',
      buyerId: '',
      buyerName: '',
      category: '',
      severity: '',
      priority: '',
      description: '',
      dateOccurred: new Date().toISOString().split('T')[0],
      affectedOrder: '',
      reportedBy: 'Current User',
      suggestedAction: '',
    });
    setAttachedFiles([]);
  };

  const handleAIRecommendation = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `Based on the issue "${formData.issueTitle}" for buyer ${formData.buyerName} (${formData.category} category, ${formData.severity} severity), recommend immediate actions, suggest root cause analysis approach, provide similar past issue resolutions, and create a step-by-step resolution plan. Issue description: ${formData.description}`
      );
    }
  };

  const issueCategories = [
    'Quality Issues',
    'Delivery Delays',
    'Communication Problems',
    'Payment Disputes',
    'Product Specifications',
    'Compliance Issues',
    'Documentation Errors',
    'Sample Rejections',
    'Order Changes',
    'Other',
  ];

  const severityLevels = [
    { value: 'Low', color: '#6F83A7', description: 'Minor impact, can be resolved later' },
    { value: 'Medium', color: '#EAB308', description: 'Moderate impact, needs attention' },
    { value: 'High', color: '#F97316', description: 'Significant impact, requires prompt action' },
    { value: 'Critical', color: '#D0342C', description: 'Severe impact, immediate action required' },
  ];

  const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[900px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#D0342C]/5 via-transparent to-[#EAB308]/5 p-6">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                  }}
                />
              </div>

              <div className="relative flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D0342C] to-[#D0342C]/60 flex items-center justify-center shadow-lg shadow-[#D0342C]/20">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white mb-1">Log New Issue</h2>
                    <p className="text-sm text-[#6F83A7]">Report a buyer-related issue or problem</p>
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
              <div className="relative grid grid-cols-4 gap-3">
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Total Issues</div>
                  <div className="text-lg text-white">47</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Open</div>
                  <div className="text-lg text-[#D0342C]">12</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Resolution</div>
                  <div className="text-lg text-white">2.3d</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">This Month</div>
                  <div className="text-lg text-white">8</div>
                </div>
              </div>
            </div>

            {/* Content with Scroll */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                <div className="space-y-6">
                  {/* AI Recommendation Card */}
                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-1">MARBIM Smart Insights</h4>
                          <p className="text-xs text-[#6F83A7]">
                            Get AI-powered recommendations for issue resolution, root cause analysis, and prevention strategies
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton onClick={handleAIRecommendation} />
                    </div>
                    {formData.issueTitle && formData.buyerName && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                          <div className="text-sm text-white">
                            AI will analyze "{formData.issueTitle}" for {formData.buyerName} and suggest resolution steps
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Issue Details */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="w-5 h-5 text-[#D0342C]" />
                      <h3 className="text-white">Issue Details</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Issue Title <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          value={formData.issueTitle}
                          onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                          placeholder="e.g., Quality defects in latest shipment"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Buyer <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select
                          value={formData.buyerId}
                          onValueChange={handleBuyerChange}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select buyer" />
                          </SelectTrigger>
                          <SelectContent>
                            {buyers.length > 0 ? (
                              buyers.map(buyer => (
                                <SelectItem key={buyer.id} value={buyer.id}>
                                  {buyer.buyerName} ({buyer.tier})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-buyers" disabled>No buyers available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Category <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {issueCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Severity <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select
                          value={formData.severity}
                          onValueChange={(value) => setFormData({ ...formData, severity: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            {severityLevels.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: level.color }}
                                  />
                                  {level.value}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.severity && (
                          <p className="text-xs text-[#6F83A7] mt-1">
                            {severityLevels.find(l => l.value === formData.severity)?.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityLevels.map(priority => (
                              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Date Occurred</Label>
                        <Input
                          type="date"
                          value={formData.dateOccurred}
                          onChange={(e) => setFormData({ ...formData, dateOccurred: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Affected Order/RFQ (Optional)</Label>
                        <Input
                          value={formData.affectedOrder}
                          onChange={(e) => setFormData({ ...formData, affectedOrder: e.target.value })}
                          placeholder="e.g., RFQ-2024-001 or PO-12345"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Description <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the issue in detail, including what happened, when it occurred, and impact..."
                          rows={5}
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Suggested Action/Resolution</Label>
                        <Textarea
                          value={formData.suggestedAction}
                          onChange={(e) => setFormData({ ...formData, suggestedAction: e.target.value })}
                          placeholder="What actions do you recommend to resolve this issue?"
                          rows={3}
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Attachments */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Attachments</h3>
                    </div>

                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files (Photos, documents, emails, etc.)
                      </Button>

                      {attachedFiles.length > 0 && (
                        <div className="space-y-2">
                          {attachedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-[#57ACAF] shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-white truncate">{file.name}</p>
                                  <p className="text-xs text-[#6F83A7]">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#D0342C] hover:text-[#D0342C] hover:bg-[#D0342C]/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Information Note */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#57ACAF] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-white text-sm mb-1">Issue Tracking</h4>
                        <p className="text-xs text-[#6F83A7]">
                          Once logged, this issue will be tracked and assigned to the appropriate team member. 
                          You'll receive notifications on status updates and resolution progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-t from-black/20 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <AlertCircle className="w-4 h-4" />
                  <span>Fields marked with * are required</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#D0342C] to-[#D0342C]/80 text-white hover:from-[#D0342C]/90 hover:to-[#D0342C]/70 shadow-lg shadow-[#D0342C]/20"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Log Issue
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
