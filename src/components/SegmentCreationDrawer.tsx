import { useState } from 'react';
import { cn } from './ui/utils';
import { fabricSheetChromeClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MarbimAIButton } from './MarbimAIButton';
import {
  X, Plus, Trash2, Users, Building2, MapPin, TrendingUp,
  DollarSign, Activity, Calendar, Sparkles, Target, Zap,
  CheckCircle, AlertCircle, Filter, ChevronDown, Save
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SegmentCriterion {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SegmentCreationDrawerProps {
  open: boolean;
  onClose: () => void;
  onAskMarbim?: (prompt: string) => void;
}

const FIELD_OPTIONS = [
  { value: 'industry', label: 'Industry', icon: Building2 },
  { value: 'company_size', label: 'Company Size', icon: Users },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'engagement_score', label: 'Engagement Score', icon: Activity },
  { value: 'revenue', label: 'Annual Revenue', icon: DollarSign },
  { value: 'lead_score', label: 'Lead Score', icon: TrendingUp },
  { value: 'last_activity', label: 'Last Activity', icon: Calendar },
  { value: 'campaign_response', label: 'Campaign Response', icon: Target },
];

const OPERATOR_OPTIONS: Record<string, { value: string; label: string }[]> = {
  industry: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not equals' },
    { value: 'contains', label: 'Contains' },
  ],
  company_size: [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
  ],
  location: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does not contain' },
  ],
  engagement_score: [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' },
  ],
  revenue: [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' },
  ],
  lead_score: [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'equals', label: 'Equals' },
  ],
  last_activity: [
    { value: 'within_days', label: 'Within last X days' },
    { value: 'more_than_days', label: 'More than X days ago' },
  ],
  campaign_response: [
    { value: 'responded', label: 'Responded' },
    { value: 'not_responded', label: 'Did not respond' },
    { value: 'opened', label: 'Opened' },
  ],
};

const SEGMENT_TEMPLATES = [
  {
    name: 'High-Value Prospects',
    icon: DollarSign,
    color: '#EAB308',
    criteria: [
      { field: 'lead_score', operator: 'greater_than', value: '80' },
      { field: 'revenue', operator: 'greater_than', value: '1000000' },
    ],
  },
  {
    name: 'Recently Engaged',
    icon: Zap,
    color: '#57ACAF',
    criteria: [
      { field: 'last_activity', operator: 'within_days', value: '30' },
      { field: 'engagement_score', operator: 'greater_than', value: '60' },
    ],
  },
  {
    name: 'Enterprise Targets',
    icon: Building2,
    color: '#6F83A7',
    criteria: [
      { field: 'company_size', operator: 'greater_than', value: '500' },
      { field: 'industry', operator: 'equals', value: 'Technology' },
    ],
  },
  {
    name: 'Warm Leads',
    icon: Activity,
    color: '#EAB308',
    criteria: [
      { field: 'lead_score', operator: 'between', value: '50-80' },
      { field: 'campaign_response', operator: 'responded', value: 'true' },
    ],
  },
];

export function SegmentCreationDrawer({ open, onClose, onAskMarbim }: SegmentCreationDrawerProps) {
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState<SegmentCriterion[]>([]);
  const [estimatedLeads, setEstimatedLeads] = useState(0);

  const addCriterion = () => {
    const newCriterion: SegmentCriterion = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: '',
      label: '',
    };
    setCriteria([...criteria, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    // Recalculate estimated leads
    const newEstimate = Math.max(0, estimatedLeads - Math.floor(Math.random() * 50 + 20));
    setEstimatedLeads(newEstimate);
  };

  const updateCriterion = (id: string, field: keyof SegmentCriterion, value: string) => {
    setCriteria(criteria.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        // Update label
        if (field === 'field') {
          const fieldOption = FIELD_OPTIONS.find(f => f.value === value);
          updated.label = fieldOption?.label || '';
          updated.operator = '';
          updated.value = '';
        }
        return updated;
      }
      return c;
    }));
    
    // Simulate lead count estimation
    if (field === 'value') {
      setEstimatedLeads(Math.floor(Math.random() * 500 + 100));
    }
  };

  const applyTemplate = (template: typeof SEGMENT_TEMPLATES[0]) => {
    setSegmentName(template.name);
    setDescription(`Auto-generated segment for ${template.name.toLowerCase()}`);
    
    const newCriteria = template.criteria.map((c, idx) => {
      const fieldOption = FIELD_OPTIONS.find(f => f.value === c.field);
      return {
        id: `${Date.now()}_${idx}`,
        field: c.field,
        operator: c.operator,
        value: c.value,
        label: fieldOption?.label || '',
      };
    });
    
    setCriteria(newCriteria);
    setEstimatedLeads(Math.floor(Math.random() * 300 + 150));
    toast.success(`Applied ${template.name} template`);
  };

  const handleSave = () => {
    if (!segmentName.trim()) {
      toast.error('Please enter a segment name');
      return;
    }
    
    if (criteria.length === 0) {
      toast.error('Please add at least one criterion');
      return;
    }
    
    const invalidCriteria = criteria.some(c => !c.field || !c.operator || !c.value);
    if (invalidCriteria) {
      toast.error('Please complete all criteria fields');
      return;
    }
    
    toast.success(`Segment "${segmentName}" created successfully with ${estimatedLeads} leads`);
    
    // Reset and close
    setSegmentName('');
    setDescription('');
    setCriteria([]);
    setEstimatedLeads(0);
    onClose();
  };

  const handleClose = () => {
    setSegmentName('');
    setDescription('');
    setCriteria([]);
    setEstimatedLeads(0);
    onClose();
  };

  const getFieldIcon = (fieldValue: string) => {
    const field = FIELD_OPTIONS.find(f => f.value === fieldValue);
    return field?.icon || Filter;
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        hideClose={true}
        className={cn(
          'w-full sm:max-w-2xl p-0 bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10 overflow-hidden',
          fabricSheetChromeClass(),
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 to-transparent">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#57ACAF]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/5 border border-[#57ACAF]/30">
                  <Users className="w-6 h-6 text-[#57ACAF]" />
                </div>
                <div>
                  <SheetTitle className="text-xl text-white mb-1">
                    Create New Segment
                  </SheetTitle>
                  <p className="text-sm text-[#6F83A7]">
                    Define criteria to group leads into targeted segments
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-[#6F83A7] hover:text-white hover:bg-white/5 transition-all duration-180"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#57ACAF] rounded-full" />
                  Basic Information
                </h3>
                <MarbimAIButton
                  prompt={`I'm creating a lead segment. Based on our current lead data and common segmentation strategies, suggest effective segment names and criteria combinations. Consider factors like: lead scores, engagement levels, company size, industry, revenue potential, and recent activity. Provide 3-5 specific segment ideas with clear criteria and expected benefits.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                  variant="icon"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-[#6F83A7] mb-2 block">Segment Name *</label>
                  <Input
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="e.g., High-Value Enterprise Prospects"
                    className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/50 focus:border-[#57ACAF]/50 focus:ring-[#57ACAF]/20"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#6F83A7] mb-2 block">Description (Optional)</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this segment"
                    className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/50 focus:border-[#57ACAF]/50 focus:ring-[#57ACAF]/20"
                  />
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#EAB308] rounded-full" />
                <h3 className="text-white">Quick Templates</h3>
                <Sparkles className="w-4 h-4 text-[#EAB308]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SEGMENT_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.name}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTemplate(template)}
                      className="relative group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-left transition-all duration-180"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-180 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${template.color}10, transparent)`,
                        }}
                      />
                      <div className="relative">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${template.color}20, ${template.color}10)`,
                            border: `1px solid ${template.color}30`,
                          }}
                        >
                          <Icon className="w-4 h-4" style={{ color: template.color }} />
                        </div>
                        <div className="text-sm text-white mb-1">{template.name}</div>
                        <div className="text-xs text-[#6F83A7]">
                          {template.criteria.length} criteria
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Criteria Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#6F83A7] rounded-full" />
                  <h3 className="text-white">Segment Criteria</h3>
                  {criteria.length > 0 && (
                    <Badge variant="outline" className="text-[#57ACAF] border-[#57ACAF]/30">
                      {criteria.length} {criteria.length === 1 ? 'rule' : 'rules'}
                    </Badge>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    onClick={addCriterion}
                    className="h-8 bg-gradient-to-r from-[#6F83A7]/20 to-[#6F83A7]/10 hover:from-[#6F83A7]/30 hover:to-[#6F83A7]/20 text-[#6F83A7] hover:text-white border border-[#6F83A7]/30 hover:border-[#6F83A7]/50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Criteria
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence mode="popLayout">
                {criteria.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 px-4 rounded-xl bg-white/5 border border-dashed border-white/10"
                  >
                    <Filter className="w-12 h-12 text-[#6F83A7]/30 mx-auto mb-3" />
                    <p className="text-sm text-[#6F83A7] mb-4">
                      No criteria added yet. Click "Add Criteria" to start building your segment.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {criteria.map((criterion, index) => {
                      const FieldIcon = getFieldIcon(criterion.field);
                      return (
                        <motion.div
                          key={criterion.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="relative group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-180"
                        >
                          {/* Rule number badge */}
                          <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10 border border-[#57ACAF]/30 flex items-center justify-center">
                            <span className="text-xs text-[#57ACAF]">{index + 1}</span>
                          </div>

                          <div className="pl-4 space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                              {/* Field */}
                              <div>
                                <label className="text-xs text-[#6F83A7] mb-1.5 block">Field</label>
                                <Select
                                  value={criterion.field}
                                  onValueChange={(value) => updateCriterion(criterion.id, 'field', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#0D1117] border-white/10">
                                    {FIELD_OPTIONS.map((option) => {
                                      const Icon = option.icon;
                                      return (
                                        <SelectItem key={option.value} value={option.value} className="text-white">
                                          <div className="flex items-center gap-2">
                                            <Icon className="w-3.5 h-3.5 text-[#6F83A7]" />
                                            {option.label}
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Operator */}
                              <div>
                                <label className="text-xs text-[#6F83A7] mb-1.5 block">Operator</label>
                                <Select
                                  value={criterion.operator}
                                  onValueChange={(value) => updateCriterion(criterion.id, 'operator', value)}
                                  disabled={!criterion.field}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white disabled:opacity-50">
                                    <SelectValue placeholder="Select operator" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#0D1117] border-white/10">
                                    {criterion.field && OPERATOR_OPTIONS[criterion.field]?.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-white">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Value */}
                              <div>
                                <label className="text-xs text-[#6F83A7] mb-1.5 block">Value</label>
                                <Input
                                  value={criterion.value}
                                  onChange={(e) => updateCriterion(criterion.id, 'value', e.target.value)}
                                  placeholder="Enter value"
                                  disabled={!criterion.operator}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/50 disabled:opacity-50"
                                />
                              </div>
                            </div>

                            {/* Remove button */}
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCriterion(criterion.id)}
                                className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview */}
            {criteria.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                    <h4 className="text-white">Segment Preview</h4>
                  </div>
                  <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                    Estimated: {estimatedLeads} leads
                  </Badge>
                </div>

                <div className="space-y-2">
                  {criteria.map((c, idx) => (
                    <div key={c.id} className="flex items-center gap-2 text-sm">
                      {idx > 0 && (
                        <span className="px-2 py-0.5 rounded bg-[#57ACAF]/20 text-[#57ACAF] text-xs">
                          AND
                        </span>
                      )}
                      <span className="text-[#6F83A7]">{c.label}</span>
                      <span className="text-white">{c.operator.replace('_', ' ')}</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[#EAB308]">{c.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-[#0D1117]/40">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                {criteria.length > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-[#6F83A7]">
                      Ready to create with <span className="text-white">{criteria.length}</span> criteria
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-[#6F83A7]">Add criteria to continue</span>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    disabled={!segmentName.trim() || criteria.length === 0}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white border-0 shadow-lg shadow-[#57ACAF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Segment
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
