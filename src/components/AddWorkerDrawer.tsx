import { useState } from 'react';
import { fabricRightDrawerClassWithZ } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, UserPlus, Upload, Briefcase, MapPin, Calendar,
  Phone, Mail, Award, Clock, DollarSign, FileText,
  Sparkles, AlertCircle, Shield, Target
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarbimAIButton } from './MarbimAIButton';
import { toast } from 'sonner';
import { useDatabase, MODULE_NAMES } from '../utils/supabase';

interface AddWorkerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerAdded?: () => void;
}

export function AddWorkerDrawer({ isOpen, onClose, onWorkerAdded }: AddWorkerDrawerProps) {
  const db = useDatabase();
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Employment Details
    department: '',
    role: '',
    shift: '',
    joiningDate: '',
    employmentType: '',
    reportingManager: '',
    workLocation: '',
    
    // Compensation
    baseSalary: '',
    allowances: '',
    paymentFrequency: 'monthly',
    
    // Skills & Certifications
    skills: [] as string[],
    certifications: [] as string[],
    experience: '',
    
    // Additional
    notes: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        skills: [...prev.skills, currentSkill.trim()] 
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(s => s !== skill) 
    }));
  };

  const addCertification = () => {
    if (currentCertification.trim() && !formData.certifications.includes(currentCertification.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        certifications: [...prev.certifications, currentCertification.trim()] 
      }));
      setCurrentCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData(prev => ({ 
      ...prev, 
      certifications: prev.certifications.filter(c => c !== cert) 
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.employeeId.trim()) {
      toast.error('Employee ID is required');
      return false;
    }
    if (!formData.department) {
      toast.error('Department is required');
      return false;
    }
    if (!formData.role) {
      toast.error('Role is required');
      return false;
    }
    if (!formData.joiningDate) {
      toast.error('Joining date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const workerId = `worker-${Date.now()}`;
      
      // Calculate initial performance score (default)
      const initialPerformance = 75;
      
      const workerData = {
        id: workerId,
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        photo: photoPreview || null,
        status: 'active',
        performance: initialPerformance,
        attendanceRate: 100,
        productivity: 85,
        safetyScore: 100,
        attachments: attachments.map(f => ({ name: f.name, size: f.size })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in database
      await db.store(workerId, workerData, MODULE_NAMES.WORKFORCE_MANAGEMENT);

      // Store in vector DB for AI search
      const searchableContent = `
        Worker: ${workerData.fullName}
        Employee ID: ${formData.employeeId}
        Department: ${formData.department}
        Role: ${formData.role}
        Skills: ${formData.skills.join(', ')}
        Certifications: ${formData.certifications.join(', ')}
        Experience: ${formData.experience}
        Shift: ${formData.shift}
        Location: ${formData.workLocation}
        Notes: ${formData.notes}
      `;
      
      await db.storeVector(workerId, searchableContent, MODULE_NAMES.WORKFORCE_MANAGEMENT);

      toast.success(`Worker ${workerData.fullName} added successfully!`);
      
      onWorkerAdded?.();
      onClose();
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', employeeId: '', email: '', phone: '',
        dateOfBirth: '', address: '', emergencyContact: '', emergencyPhone: '',
        department: '', role: '', shift: '', joiningDate: '', employmentType: '',
        reportingManager: '', workLocation: '', baseSalary: '', allowances: '',
        paymentFrequency: 'monthly', skills: [], certifications: [], experience: '', notes: ''
      });
      setPhotoFile(null);
      setPhotoPreview('');
      setAttachments([]);
      
    } catch (error) {
      console.error('Failed to add worker:', error);
      toast.error('Failed to add worker. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      firstName: '', lastName: '', employeeId: '', email: '', phone: '',
      dateOfBirth: '', address: '', emergencyContact: '', emergencyPhone: '',
      department: '', role: '', shift: '', joiningDate: '', employmentType: '',
      reportingManager: '', workLocation: '', baseSalary: '', allowances: '',
      paymentFrequency: 'monthly', skills: [], certifications: [], experience: '', notes: ''
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setAttachments([]);
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
            onClick={handleCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClassWithZ('max-w-[900px]', 'z-[101]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-50" />
              
              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl text-white mb-1">Add New Worker</h2>
                      <p className="text-sm text-[#6F83A7]">Onboard a new team member to the workforce</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-white/5 rounded-lg transition-all duration-180"
                  >
                    <X className="w-5 h-5 text-[#6F83A7]" />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Form Progress</div>
                    <div className="text-lg text-white">
                      {Math.round(
                        (Object.values(formData).filter(v => 
                          Array.isArray(v) ? v.length > 0 : v !== ''
                        ).length / Object.keys(formData).length) * 100
                      )}%
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Attachments</div>
                    <div className="text-lg text-white">{attachments.length}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Status</div>
                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20 text-xs">
                      Draft
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-8">
                
                {/* AI Recommendation Card */}
                <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div>
                        <div className="text-white font-medium">AI-Powered Onboarding</div>
                        <div className="text-xs text-[#EAB308]">Smart recommendations available</div>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 ml-12">
                      MARBIM can suggest optimal department placement, training programs, and salary benchmarks based on skills and experience.
                    </p>
                  </div>
                  <MarbimAIButton
                    variant="floating"
                    promptText={`Analyze worker onboarding for: ${formData.firstName} ${formData.lastName}, Department: ${formData.department}, Role: ${formData.role}, Skills: ${formData.skills.join(', ')}, Experience: ${formData.experience}. Suggest optimal placement, training needs, and compensation benchmarks.`}
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Worker Photo</h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Worker preview"
                          className="w-24 h-24 rounded-xl object-cover border border-white/10"
                        />
                        <button
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview('');
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-[#6F83A7]" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="worker-photo"
                      />
                      <label
                        htmlFor="worker-photo"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all duration-180 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </label>
                      <p className="text-xs text-[#6F83A7] mt-2">
                        Recommended: 400x400px, JPG or PNG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Personal Information</h3>
                    </div>
                    <MarbimAIButton
                      variant="icon"
                      promptText="What are best practices for collecting worker personal information while maintaining privacy compliance?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">
                        Employee ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        placeholder="e.g., EMP-2024-001"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="worker@example.com"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm text-[#6F83A7] mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter full address"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Contact person name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Emergency Phone</label>
                      <input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Employment Details</h3>
                    </div>
                    <MarbimAIButton
                      variant="icon"
                      promptText={`Suggest optimal department placement and role assignment for a worker with skills: ${formData.skills.join(', ')} and ${formData.experience} experience.`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">
                        Department <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Select Department</option>
                        <option value="Production" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Production</option>
                        <option value="Quality Control" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Quality Control</option>
                        <option value="Finishing" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Finishing</option>
                        <option value="Cutting" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Cutting</option>
                        <option value="Packing" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Packing</option>
                        <option value="Maintenance" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">
                        Role <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Select Role</option>
                        <option value="Operator" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Operator</option>
                        <option value="Supervisor" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Supervisor</option>
                        <option value="Quality Inspector" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Quality Inspector</option>
                        <option value="Technician" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Technician</option>
                        <option value="Line Manager" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Line Manager</option>
                        <option value="Helper" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Helper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Shift</label>
                      <select
                        value={formData.shift}
                        onChange={(e) => handleInputChange('shift', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Select Shift</option>
                        <option value="Morning" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Morning (6AM - 2PM)</option>
                        <option value="Day" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Day (8AM - 5PM)</option>
                        <option value="Evening" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Evening (2PM - 10PM)</option>
                        <option value="Night" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Night (10PM - 6AM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">
                        Joining Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Employment Type</label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => handleInputChange('employmentType', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Select Type</option>
                        <option value="Full-time" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Full-time</option>
                        <option value="Part-time" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Part-time</option>
                        <option value="Contract" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Contract</option>
                        <option value="Temporary" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Temporary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Work Location</label>
                      <input
                        type="text"
                        value={formData.workLocation}
                        onChange={(e) => handleInputChange('workLocation', e.target.value)}
                        placeholder="e.g., Factory Floor A, Building 2"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm text-[#6F83A7] mb-2">Reporting Manager</label>
                      <input
                        type="text"
                        value={formData.reportingManager}
                        onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                        placeholder="Manager name or ID"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Compensation */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Compensation</h3>
                    </div>
                    <MarbimAIButton
                      variant="icon"
                      promptText={`What is the market rate for a ${formData.role} in ${formData.department} department with ${formData.experience} experience in the garment industry?`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Base Salary (BDT)</label>
                      <input
                        type="number"
                        value={formData.baseSalary}
                        onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                        placeholder="e.g., 25000"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Allowances (BDT)</label>
                      <input
                        type="number"
                        value={formData.allowances}
                        onChange={(e) => handleInputChange('allowances', e.target.value)}
                        placeholder="e.g., 5000"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Payment Frequency</label>
                      <select
                        value={formData.paymentFrequency}
                        onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="monthly" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Monthly</option>
                        <option value="bi-weekly" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Bi-weekly</option>
                        <option value="weekly" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Weekly</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <div className="p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                        <div className="text-xs text-[#57ACAF] mb-1">Total Package</div>
                        <div className="text-lg text-white">
                          ৳{((parseFloat(formData.baseSalary) || 0) + (parseFloat(formData.allowances) || 0)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills & Certifications */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Skills & Certifications</h3>
                    </div>
                    <MarbimAIButton
                      variant="icon"
                      promptText={`Recommend training programs and skill development paths for a ${formData.role} in ${formData.department} department.`}
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Skills */}
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Skills</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          placeholder="e.g., Sewing, Pattern Making"
                          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        />
                        <Button
                          onClick={addSkill}
                          className="px-4 bg-[#57ACAF]/20 border border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/30"
                        >
                          Add
                        </Button>
                      </div>
                      {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20 flex items-center gap-2"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Certifications</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={currentCertification}
                          onChange={(e) => setCurrentCertification(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                          placeholder="e.g., ISO Quality Certification"
                          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                        />
                        <Button
                          onClick={addCertification}
                          className="px-4 bg-[#EAB308]/20 border border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/30"
                        >
                          Add
                        </Button>
                      </div>
                      {formData.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications.map((cert, index) => (
                            <Badge
                              key={index}
                              className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20 flex items-center gap-2"
                            >
                              {cert}
                              <button
                                onClick={() => removeCertification(cert)}
                                className="hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Total Experience</label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 5 years in garment production"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Attachments */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Documents</h3>
                  </div>

                  <div>
                    <input
                      type="file"
                      multiple
                      accept="*/*"
                      onChange={handleAttachmentUpload}
                      className="hidden"
                      id="worker-attachments"
                    />
                    <label
                      htmlFor="worker-attachments"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all duration-180 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Attach Documents
                    </label>
                    <p className="text-xs text-[#6F83A7] mt-2">
                      ID proof, certificates, resume, etc.
                    </p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-[#57ACAF]" />
                            </div>
                            <div>
                              <div className="text-sm text-white">{file.name}</div>
                              <div className="text-xs text-[#6F83A7]">
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Additional Notes</h3>
                  </div>

                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information about the worker..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6F83A7] focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF] transition-all resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 bg-gradient-to-b from-white/5 to-transparent px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <AlertCircle className="w-4 h-4" />
                  <span>Required fields marked with *</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20 transition-all duration-180"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Adding Worker...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Worker
                      </>
                    )}
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
