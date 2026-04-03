import { X, Calendar, Clock, User, AlertCircle, Wrench, FileText, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface ScheduleMaintenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskMarbim?: (question: string) => void;
}

export function ScheduleMaintenanceDrawer({ isOpen, onClose, onAskMarbim }: ScheduleMaintenanceDrawerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Maintenance task scheduled successfully');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
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
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.05),transparent_50%)]" />
              
              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl mb-1">Schedule Maintenance</h2>
                      <p className="text-sm text-[#6F83A7]">Create a new maintenance task</p>
                    </div>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-[#6F83A7] hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAskMarbim?.('Analyze machine health data and recommend which machines need urgent maintenance scheduling based on sensor readings and usage patterns.')}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Sparkles className="w-3 h-3 mr-2" />
                    AI Recommendations
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAskMarbim?.('Suggest optimal maintenance schedule for next week considering production deadlines, machine criticality, and technician availability.')}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Target className="w-3 h-3 mr-2" />
                    Optimize Schedule
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* AI Insights Card */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white">AI Scheduling Assistant</h4>
                        <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                          Smart
                        </Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Based on current production schedule and machine health data, the optimal maintenance window is during low-demand periods (weekends or night shifts).
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          3 machines need attention
                        </Badge>
                        <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Saturday 8 AM optimal
                        </Badge>
                        <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Minimize downtime by 40%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#57ACAF]" />
                    Basic Information
                  </h3>

                  {/* Task Title */}
                  <div className="space-y-2">
                    <Label htmlFor="taskTitle" className="text-sm text-[#6F83A7]">
                      Task Title *
                    </Label>
                    <Input
                      id="taskTitle"
                      placeholder="e.g., Quarterly Preventive Maintenance"
                      className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]"
                      required
                    />
                  </div>

                  {/* Machine Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="machine" className="text-sm text-[#6F83A7]">
                      Select Machine *
                    </Label>
                    <Select required>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]">
                        <SelectValue placeholder="Choose a machine" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#182336] border-white/10">
                        <SelectItem value="MCH-001" className="text-white hover:bg-white/5">
                          MCH-001 - Brother Single Needle
                        </SelectItem>
                        <SelectItem value="MCH-002" className="text-white hover:bg-white/5">
                          MCH-002 - Juki Overlock
                        </SelectItem>
                        <SelectItem value="MCH-003" className="text-white hover:bg-white/5">
                          MCH-003 - Yamato Coverstitch
                        </SelectItem>
                        <SelectItem value="MCH-004" className="text-white hover:bg-white/5">
                          MCH-004 - Singer Buttonhole
                        </SelectItem>
                        <SelectItem value="MCH-005" className="text-white hover:bg-white/5">
                          MCH-005 - Pfaff Flatlock
                        </SelectItem>
                        <SelectItem value="MCH-006" className="text-white hover:bg-white/5">
                          MCH-006 - Janome Bartack
                        </SelectItem>
                        <SelectItem value="MCH-007" className="text-white hover:bg-white/5">
                          MCH-007 - Brother Button Attach
                        </SelectItem>
                        <SelectItem value="MCH-008" className="text-white hover:bg-white/5">
                          MCH-008 - Cutting Machine
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Maintenance Type */}
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceType" className="text-sm text-[#6F83A7]">
                      Maintenance Type *
                    </Label>
                    <Select required>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#182336] border-white/10">
                        <SelectItem value="preventive" className="text-white hover:bg-white/5">
                          Preventive Maintenance
                        </SelectItem>
                        <SelectItem value="repair" className="text-white hover:bg-white/5">
                          Repair Work
                        </SelectItem>
                        <SelectItem value="inspection" className="text-white hover:bg-white/5">
                          Routine Inspection
                        </SelectItem>
                        <SelectItem value="calibration" className="text-white hover:bg-white/5">
                          Calibration
                        </SelectItem>
                        <SelectItem value="cleaning" className="text-white hover:bg-white/5">
                          Deep Cleaning
                        </SelectItem>
                        <SelectItem value="upgrade" className="text-white hover:bg-white/5">
                          System Upgrade
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm text-[#6F83A7]">
                      Task Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the maintenance work to be performed..."
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF] resize-none"
                    />
                  </div>
                </div>

                {/* Scheduling Details */}
                <div className="space-y-4">
                  <h3 className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#57ACAF]" />
                    Scheduling Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Scheduled Date */}
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate" className="text-sm text-[#6F83A7]">
                        Scheduled Date *
                      </Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        className="bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]"
                        required
                      />
                    </div>

                    {/* Scheduled Time */}
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime" className="text-sm text-[#6F83A7]">
                        Scheduled Time *
                      </Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        className="bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Estimated Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm text-[#6F83A7]">
                        Estimated Duration (hours) *
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="0.5"
                        step="0.5"
                        placeholder="e.g., 2"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]"
                        required
                      />
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm text-[#6F83A7]">
                        Priority Level *
                      </Label>
                      <Select required>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#182336] border-white/10">
                          <SelectItem value="critical" className="text-white hover:bg-white/5">
                            Critical
                          </SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-white/5">
                            High
                          </SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-white/5">
                            Medium
                          </SelectItem>
                          <SelectItem value="low" className="text-white hover:bg-white/5">
                            Low
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                <div className="space-y-4">
                  <h3 className="text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#57ACAF]" />
                    Task Assignment
                  </h3>

                  {/* Assigned Technician */}
                  <div className="space-y-2">
                    <Label htmlFor="technician" className="text-sm text-[#6F83A7]">
                      Assign Technician *
                    </Label>
                    <Select required>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]">
                        <SelectValue placeholder="Choose a technician" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#182336] border-white/10">
                        <SelectItem value="john-smith" className="text-white hover:bg-white/5">
                          John Smith - Senior Technician
                        </SelectItem>
                        <SelectItem value="sarah-johnson" className="text-white hover:bg-white/5">
                          Sarah Johnson - Maintenance Lead
                        </SelectItem>
                        <SelectItem value="mike-chen" className="text-white hover:bg-white/5">
                          Mike Chen - Technician
                        </SelectItem>
                        <SelectItem value="emily-davis" className="text-white hover:bg-white/5">
                          Emily Davis - Junior Technician
                        </SelectItem>
                        <SelectItem value="david-wilson" className="text-white hover:bg-white/5">
                          David Wilson - Specialist
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm text-[#6F83A7]">
                      Additional Notes / Requirements
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special tools, parts, or considerations needed..."
                      rows={3}
                      className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF] resize-none"
                    />
                  </div>
                </div>

                {/* AI Recommendation Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white text-sm mb-1">Smart Suggestion</h4>
                      <p className="text-xs text-[#6F83A7]">
                        Consider scheduling maintenance for MCH-002 (Juki Overlock) alongside this task. 
                        Both machines are in the same production line and can be serviced together to minimize downtime.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
