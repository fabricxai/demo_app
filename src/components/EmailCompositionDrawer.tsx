import { useState, useEffect } from 'react';
import { cn } from './ui/utils';
import { fabricSheetChromeClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  X, Send, Clock, User, Building2, Mail, Calendar,
  CheckCircle, AlertTriangle, Sparkles, Eye, Users,
  FileText, Zap, ChevronDown, Copy, Edit2, Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  variables?: string[];
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  country?: string;
  phone?: string;
}

interface EmailCompositionDrawerProps {
  open: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  availableLeads?: Lead[];
  preSelectedLeads?: string[];
  prefilledRecipient?: { name: string; email: string; company: string };
  prefilledSubject?: string;
  context?: string;
  compositionType?: 'new' | 'reply' | 'forward';
  onAskMarbim?: (prompt: string) => void;
}

export const EmailCompositionDrawer = ({
  open,
  onClose,
  template,
  availableLeads = [],
  preSelectedLeads = [],
  prefilledRecipient,
  prefilledSubject,
  context,
  compositionType = 'new',
  onAskMarbim,
}: EmailCompositionDrawerProps) => {
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedLeads, setSelectedLeads] = useState<string[]>(preSelectedLeads);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendOption, setSendOption] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Initialize with template data when template changes
  useEffect(() => {
    if (template) {
      setSubject(template.subject || '');
      setBody(template.content || '');
    }
  }, [template]);

  // Initialize with prefilled data when provided
  useEffect(() => {
    if (open) {
      if (prefilledSubject) {
        setSubject(prefilledSubject);
      }
      if (prefilledRecipient && compositionType === 'reply') {
        // For replies, generate AI suggested body
        const contextMessage = context || '';
        const suggestedBody = `Hi ${prefilledRecipient.name.split(' ')[0]},\n\nThank you for your message. ${contextMessage ? `Regarding your inquiry: ${contextMessage}\n\n` : ''}I'd be happy to help you with this. `;
        setBody(suggestedBody);
      }
    }
  }, [open, prefilledSubject, prefilledRecipient, context, compositionType]);

  // Filter leads based on search
  const filteredLeads = availableLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected lead objects
  const selectedLeadObjects = availableLeads.filter(lead =>
    selectedLeads.includes(lead.id)
  );

  // Toggle lead selection
  const toggleLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Select all filtered leads
  const selectAllFiltered = () => {
    const allIds = filteredLeads.map(lead => lead.id);
    setSelectedLeads(allIds);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedLeads([]);
  };

  // Handle AI generation
  const handleAIGenerate = () => {
    if (!onAskMarbim) {
      toast.error('AI Assistant not available');
      return;
    }

    const leadContext = selectedLeadObjects.length > 0
      ? `Selected leads: ${selectedLeadObjects.map(l => `${l.name} from ${l.company}`).join(', ')}`
      : 'No specific leads selected yet';

    const prompt = `Generate a professional email for a garment manufacturing business. Context: ${leadContext}. Template type: ${template?.type || 'General'}. Current subject: "${subject || 'None'}". Please provide: 1) An engaging subject line 2) Professional email body with personalization variables [Lead Name], [Company], [Country] 3) Clear call-to-action 4) Professional signature. Make it persuasive and industry-specific.`;

    setIsGenerating(true);
    onAskMarbim(prompt);

    // Simulate generation completion
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('AI suggestion sent to Marbim Assistant', {
        description: 'Check the AI panel for the generated email content',
      });
    }, 1000);
  };

  // Insert variable at cursor position
  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea[placeholder="Enter email content..."]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = body.substring(0, start) + variable + body.substring(end);
      setBody(newBody);
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);

      toast.success(`Inserted ${variable}`);
    }
  };

  // Replace template variables with actual lead data
  const personalize = (text: string, lead: Lead): string => {
    return text
      .replace(/\[Lead Name\]/g, lead.name)
      .replace(/\[Company\]/g, lead.company)
      .replace(/\[Email\]/g, lead.email)
      .replace(/\[Country\]/g, lead.country || 'N/A')
      .replace(/\[Phone\]/g, lead.phone || 'N/A');
  };

  // Handle send
  const handleSend = async () => {
    // For reply mode, we don't need selected leads validation
    if (compositionType !== 'reply' && selectedLeads.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject line');
      return;
    }

    if (!body.trim()) {
      toast.error('Please enter email content');
      return;
    }

    if (sendOption === 'schedule' && (!scheduleDate || !scheduleTime)) {
      toast.error('Please select date and time for scheduled send');
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (compositionType === 'reply') {
        toast.success(`Reply sent successfully to ${prefilledRecipient?.name}`, {
          description: 'Your response has been delivered',
          duration: 4000,
        });
      } else if (sendOption === 'now') {
        toast.success(`Email sent successfully to ${selectedLeads.length} recipient(s)`, {
          description: 'Your emails have been delivered',
          duration: 4000,
        });
      } else {
        toast.success(`Email scheduled for ${scheduleDate} at ${scheduleTime}`, {
          description: `Will be sent to ${selectedLeads.length} recipient(s)`,
          duration: 4000,
        });
      }

      // Reset and close
      onClose();
      setActiveTab('compose');
      setSelectedLeads([]);
      setSendOption('now');
      setScheduleDate('');
      setScheduleTime('');
    } catch (error) {
      toast.error('Failed to send email', {
        description: 'Please try again or contact support',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Copy personalized email for a lead
  const copyPersonalizedEmail = (lead: Lead) => {
    const personalizedSubject = personalize(subject, lead);
    const personalizedBody = personalize(body, lead);
    const fullEmail = `Subject: ${personalizedSubject}\n\nTo: ${lead.email}\n\n${personalizedBody}`;

    navigator.clipboard.writeText(fullEmail).then(() => {
      toast.success(`Copied personalized email for ${lead.name}`);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={cn(
          'w-full sm:max-w-[900px] p-0 border-l border-white/10 bg-gradient-to-br from-[#101725] to-[#182336] overflow-hidden',
          fabricSheetChromeClass(),
        )}
      >
        <SheetHeader className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl text-white flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  compositionType === 'reply' 
                    ? 'bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/5 border-[#57ACAF]/20'
                    : 'bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/5 border-[#EAB308]/20'
                }`}>
                  <Send className={`w-5 h-5 ${compositionType === 'reply' ? 'text-[#57ACAF]' : 'text-[#EAB308]'}`} />
                </div>
                <div>
                  <div>{compositionType === 'reply' ? 'Reply to Message' : 'Compose Email'}</div>
                  {template && (
                    <div className="text-sm text-white/60 mt-0.5">
                      Using template: {template.name}
                    </div>
                  )}
                  {prefilledRecipient && compositionType === 'reply' && (
                    <div className="text-sm text-white/60 mt-0.5">
                      To: {prefilledRecipient.name} ({prefilledRecipient.company})
                    </div>
                  )}
                </div>
              </SheetTitle>
              <SheetDescription className="text-white/60 mt-2">
                {compositionType === 'reply' 
                  ? 'Craft your personalized response with AI assistance'
                  : 'Compose and send personalized emails to selected leads'
                }
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-[#57ACAF]" />
              <span className="text-sm text-white/80">
                {selectedLeads.length} Selected
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <FileText className="w-4 h-4 text-[#EAB308]" />
              <span className="text-sm text-white/80">
                {template?.name || 'Custom'}
              </span>
            </div>
            {sendOption === 'schedule' && scheduleDate && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-[#6F83A7]" />
                <span className="text-sm text-white/80">
                  {scheduleDate} {scheduleTime}
                </span>
              </div>
            )}
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100vh-12rem)]">
          <TabsList className="mx-6 mt-4 grid w-auto grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger
              value="compose"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Compose
            </TabsTrigger>
            {compositionType !== 'reply' && (
              <TabsTrigger
                value="recipients"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#57ACAF] data-[state=active]:to-[#57ACAF]/80 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Recipients ({selectedLeads.length})
              </TabsTrigger>
            )}
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6F83A7] data-[state=active]:to-[#6F83A7]/80 data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6">
            <TabsContent value="compose" className="mt-4 space-y-4">
              {/* Recipient Display (for reply mode) */}
              {prefilledRecipient && compositionType === 'reply' && (
                <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-white/60">To:</span>
                          <span className="text-white">{prefilledRecipient.name}</span>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                            Reply
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {prefilledRecipient.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {prefilledRecipient.company}
                          </span>
                        </div>
                        {context && (
                          <div className="mt-2 text-xs text-white/50 italic">
                            {context}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Line */}
              <div className="space-y-2">
                <Label className="text-white/80 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Subject Line
                </Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#EAB308]/50"
                />
                <p className="text-xs text-white/50">
                  Use variables: [Lead Name], [Company], [Email], [Country], [Phone]
                </p>
              </div>

              {/* Email Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Email Content
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !onAskMarbim}
                      className="h-8 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-md shadow-[#EAB308]/20"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          AI Generate
                        </>
                      )}
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 border-[#57ACAF]/30 bg-gradient-to-r from-[#57ACAF]/10 to-transparent hover:from-[#57ACAF]/20 hover:to-transparent text-[#57ACAF] hover:text-[#57ACAF] hover:border-[#57ACAF]/50"
                        >
                          <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                          Personalize
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-64 p-3 bg-gradient-to-br from-[#101725] to-[#182336] border border-white/10"
                        align="end"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <Wand2 className="w-4 h-4 text-[#57ACAF]" />
                            <h4 className="text-sm text-white">Insert Variable</h4>
                          </div>
                          <div className="space-y-1">
                            {['[Lead Name]', '[Company]', '[Email]', '[Country]', '[Phone]'].map((variable) => (
                              <Button
                                key={variable}
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => insertVariable(variable)}
                                className="w-full justify-start h-8 text-white/80 hover:text-white hover:bg-white/10"
                              >
                                <Copy className="w-3 h-3 mr-2 text-[#57ACAF]" />
                                {variable}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter email content..."
                  className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#EAB308]/50 resize-none"
                />
                <p className="text-xs text-white/50">
                  Variables will be automatically replaced for each recipient
                </p>
              </div>

              {/* Send Options */}
              <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Label className="text-white/80 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Sending Options
                </Label>

                <div className="flex gap-4">
                  <Button
                    variant={sendOption === 'now' ? 'default' : 'outline'}
                    onClick={() => setSendOption('now')}
                    className={sendOption === 'now'
                      ? 'bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black'
                      : 'border-white/10 text-white hover:bg-white/5'
                    }
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                  <Button
                    variant={sendOption === 'schedule' ? 'default' : 'outline'}
                    onClick={() => setSendOption('schedule')}
                    className={sendOption === 'schedule'
                      ? 'bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white'
                      : 'border-white/10 text-white hover:bg-white/5'
                    }
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Send
                  </Button>
                </div>

                {sendOption === 'schedule' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <Label className="text-white/60 text-sm">Date</Label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-white/60 text-sm">Time</Label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Template Variables Help */}
              {template?.variables && template.variables.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#57ACAF] mt-0.5" />
                    <div>
                      <h4 className="text-white/90 mb-2">Available Variables</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="bg-white/5 border-white/20 text-white/80"
                          >
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recipients" className="mt-4 space-y-4">
              {/* Search and Actions */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads by name, company, or email..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={selectAllFiltered}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAllSelections}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  Clear
                </Button>
              </div>

              {/* Lead List */}
              <div className="space-y-2">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p>No leads found</p>
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleLead(lead.id)}
                          className="mt-1 border-white/20 data-[state=checked]:bg-[#EAB308] data-[state=checked]:border-[#EAB308]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white">{lead.name}</h4>
                            <Badge
                              variant="outline"
                              className="text-xs bg-white/5 border-white/20 text-white/70"
                            >
                              {lead.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5" />
                              {lead.company}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" />
                              {lead.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4 space-y-4">
              {compositionType === 'reply' && prefilledRecipient ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                      <Eye className="w-4 h-4" />
                      <span>Reply Preview</span>
                    </div>
                    <p className="text-sm text-white/60">
                      Preview of your response to {prefilledRecipient.name}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/5 flex items-center justify-center border border-[#57ACAF]/20">
                          <User className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div>
                          <h4 className="text-white">{prefilledRecipient.name}</h4>
                          <p className="text-sm text-white/60">{prefilledRecipient.email}</p>
                        </div>
                      </div>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                        Reply
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-white/40">Subject:</div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                        {subject || 'No subject'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-white/40">Message:</div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-white/90 whitespace-pre-wrap">
                        {body || 'No content'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedLeadObjects.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No recipients selected</p>
                  <p className="text-sm mt-2">Go to Recipients tab to select leads</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                      <Eye className="w-4 h-4" />
                      <span>Email Preview</span>
                    </div>
                    <p className="text-sm text-white/60">
                      Showing personalized versions for each recipient. Variables are replaced with actual data.
                    </p>
                  </div>

                  {selectedLeadObjects.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6F83A7]/20 to-[#6F83A7]/5 flex items-center justify-center border border-[#6F83A7]/20">
                            <User className="w-5 h-5 text-[#6F83A7]" />
                          </div>
                          <div>
                            <h4 className="text-white">{lead.name}</h4>
                            <p className="text-sm text-white/60">{lead.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyPersonalizedEmail(lead)}
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy
                        </Button>
                      </div>

                      <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <Label className="text-xs text-white/50 mb-1 block">Subject</Label>
                          <p className="text-white/90">{personalize(subject, lead)}</p>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div>
                          <Label className="text-xs text-white/50 mb-1 block">Body</Label>
                          <p className="text-white/80 text-sm whitespace-pre-wrap">
                            {personalize(body, lead)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <CheckCircle className="w-4 h-4" />
              <span>Ready to send to {selectedLeads.length} recipient(s)</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSending}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending || selectedLeads.length === 0}
                className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
              >
                {isSending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {compositionType === 'reply' 
                      ? 'Send Reply' 
                      : (sendOption === 'now' ? 'Send Now' : 'Schedule Send')
                    }
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
