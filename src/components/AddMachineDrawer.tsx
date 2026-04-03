import { useState, useRef } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, Upload, Package, MapPin, Calendar,
  FileText, DollarSign, Sparkles, AlertCircle, Activity,
  Cpu, Zap, ThermometerSun, Gauge, Info, CheckCircle,
  Wrench, Plus, XCircle, BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarbimAIButton } from './MarbimAIButton';
import { toast } from 'sonner';
import { useDatabase, MODULE_NAMES } from '../utils/supabase';

interface AddMachineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMachineAdded?: () => void;
}

export function AddMachineDrawer({ isOpen, onClose, onMachineAdded }: AddMachineDrawerProps) {
  const db = useDatabase();
  const manualFileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    machineId: '',
    machineName: '',
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    yearOfManufacture: '',
    
    // Purchase Details
    purchaseCondition: '', // new, 1st-hand, 2nd-hand, 3rd-hand
    purchaseDate: '',
    purchasePrice: '',
    supplier: '',
    warrantyExpiry: '',
    
    // Location & Assignment
    productionLine: '',
    location: '',
    operator: '',
    
    // Technical Specifications
    capacity: '',
    powerRating: '',
    voltage: '',
    dimensions: '',
    weight: '',
    
    // Operational Details
    maxSpeed: '',
    operatingTemperature: '',
    maintenanceInterval: '',
    
    // Initial Setup
    installationDate: '',
    calibrationDate: '',
    initialHealthScore: '100',
    
    // Additional
    notes: ''
  });

  const [manualFiles, setManualFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setManualFiles(prev => [...prev, ...files]);
  };

  const removeManualFile = (index: number) => {
    setManualFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.machineId.trim()) {
      toast.error('Machine ID is required');
      return false;
    }
    if (!formData.machineName.trim()) {
      toast.error('Machine name is required');
      return false;
    }
    if (!formData.type) {
      toast.error('Machine type is required');
      return false;
    }
    if (!formData.manufacturer.trim()) {
      toast.error('Manufacturer is required');
      return false;
    }
    if (!formData.purchaseCondition) {
      toast.error('Purchase condition is required');
      return false;
    }
    if (!formData.purchaseDate) {
      toast.error('Purchase date is required');
      return false;
    }
    if (!formData.productionLine) {
      toast.error('Production line is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const machineId = `machine-${Date.now()}`;
      
      // Calculate initial metrics
      const healthScore = parseInt(formData.initialHealthScore) || 100;
      const status = healthScore >= 90 ? 'operational' : healthScore >= 75 ? 'active' : 'needs-attention';
      
      const machineData = {
        id: machineId,
        machineId: formData.machineId,
        name: formData.machineName,
        type: formData.type,
        manufacturer: formData.manufacturer,
        model: formData.model,
        serialNumber: formData.serialNumber,
        yearOfManufacture: formData.yearOfManufacture,
        
        // Purchase info
        purchaseCondition: formData.purchaseCondition,
        purchaseDate: formData.purchaseDate,
        purchasePrice: formData.purchasePrice,
        supplier: formData.supplier,
        warrantyExpiry: formData.warrantyExpiry,
        
        // Location
        line: formData.productionLine,
        location: formData.location,
        operator: formData.operator,
        
        // Specifications
        capacity: formData.capacity,
        powerRating: formData.powerRating,
        voltage: formData.voltage,
        dimensions: formData.dimensions,
        weight: formData.weight,
        maxSpeed: formData.maxSpeed,
        operatingTemperature: formData.operatingTemperature,
        maintenanceInterval: formData.maintenanceInterval || '30 days',
        
        // Initial setup
        installationDate: formData.installationDate || formData.purchaseDate,
        calibrationDate: formData.calibrationDate || formData.purchaseDate,
        
        // Performance metrics
        healthScore: healthScore,
        status: status,
        uptime: 100,
        efficiency: 85,
        utilizationRate: 0,
        lastMaintenanceDate: formData.calibrationDate || formData.purchaseDate,
        nextMaintenanceDate: calculateNextMaintenance(formData.installationDate || formData.purchaseDate, formData.maintenanceInterval || '30'),
        
        // Files
        manualFiles: manualFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
        
        // Metadata
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in database
      await db.store(machineId, machineData, MODULE_NAMES.MACHINE_MAINTENANCE);

      // Store in vector DB for AI search
      const searchableContent = `
        Machine: ${formData.machineId} - ${formData.machineName}
        Type: ${formData.type}
        Manufacturer: ${formData.manufacturer}
        Model: ${formData.model}
        Serial Number: ${formData.serialNumber}
        Purchase Condition: ${formData.purchaseCondition}
        Production Line: ${formData.productionLine}
        Location: ${formData.location}
        Operator: ${formData.operator}
        Capacity: ${formData.capacity}
        Power Rating: ${formData.powerRating}
        Specifications: ${formData.dimensions}, ${formData.weight}
        Maintenance Interval: ${formData.maintenanceInterval}
        Notes: ${formData.notes}
      `;
      
      await db.storeVector(machineId, searchableContent, MODULE_NAMES.MACHINE_MAINTENANCE);

      toast.success(`Machine ${formData.machineId} added successfully!`);
      
      onMachineAdded?.();
      handleClose();
    } catch (error) {
      console.error('Failed to add machine:', error);
      toast.error('Failed to add machine. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNextMaintenance = (startDate: string, intervalDays: string) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    const days = parseInt(intervalDays) || 30;
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      machineId: '',
      machineName: '',
      type: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      yearOfManufacture: '',
      purchaseCondition: '',
      purchaseDate: '',
      purchasePrice: '',
      supplier: '',
      warrantyExpiry: '',
      productionLine: '',
      location: '',
      operator: '',
      capacity: '',
      powerRating: '',
      voltage: '',
      dimensions: '',
      weight: '',
      maxSpeed: '',
      operatingTemperature: '',
      maintenanceInterval: '',
      installationDate: '',
      calibrationDate: '',
      initialHealthScore: '100',
      notes: ''
    });
    setManualFiles([]);
    setAttachments([]);
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
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
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5 p-8">
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              />
              
              <div className="relative flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-xl mb-1">Add New Machine</h2>
                    <p className="text-sm text-[#6F83A7]">Register new equipment to your production floor</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MarbimAIButton
                    onClick={() => {
                      // This would integrate with onAskMarbim if passed as prop
                      toast.info('Ask MARBIM for equipment recommendations');
                    }}
                    variant="icon"
                  />
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="sm"
                    className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-3 relative">
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Condition</div>
                  <div className="text-lg text-white">
                    {formData.purchaseCondition || '-'}
                  </div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Production Line</div>
                  <div className="text-lg text-white">
                    {formData.productionLine || '-'}
                  </div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Health Score</div>
                  <div className="text-lg text-[#57ACAF]">
                    {formData.initialHealthScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-8">
                
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                      <Info className="w-4 h-4 text-[#57ACAF]" />
                    </div>
                    <h3 className="text-white">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Machine ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.machineId}
                        onChange={(e) => handleInputChange('machineId', e.target.value)}
                        placeholder="MCH-001"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Machine Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.machineName}
                        onChange={(e) => handleInputChange('machineName', e.target.value)}
                        placeholder="Industrial Sewing Machine"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Machine Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      >
                        <option value="" className="bg-[#182336] text-white">Select Type</option>
                        <option value="Sewing Machine" className="bg-[#182336] text-white">Sewing Machine</option>
                        <option value="Cutting Machine" className="bg-[#182336] text-white">Cutting Machine</option>
                        <option value="Pressing Machine" className="bg-[#182336] text-white">Pressing Machine</option>
                        <option value="Embroidery Machine" className="bg-[#182336] text-white">Embroidery Machine</option>
                        <option value="Overlock Machine" className="bg-[#182336] text-white">Overlock Machine</option>
                        <option value="Button Attaching" className="bg-[#182336] text-white">Button Attaching</option>
                        <option value="Buttonhole Machine" className="bg-[#182336] text-white">Buttonhole Machine</option>
                        <option value="Packaging Machine" className="bg-[#182336] text-white">Packaging Machine</option>
                        <option value="Quality Inspection" className="bg-[#182336] text-white">Quality Inspection</option>
                        <option value="Other" className="bg-[#182336] text-white">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Manufacturer <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.manufacturer}
                        onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        placeholder="Juki, Brother, Singer, etc."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Model Number</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        placeholder="DDL-8700-7"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Serial Number</label>
                      <input
                        type="text"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                        placeholder="SN123456789"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Year of Manufacture</label>
                      <input
                        type="text"
                        value={formData.yearOfManufacture}
                        onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)}
                        placeholder="2023"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Purchase Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-[#EAB308]" />
                    </div>
                    <h3 className="text-white">Purchase Details</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Purchase Condition <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.purchaseCondition}
                        onChange={(e) => handleInputChange('purchaseCondition', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      >
                        <option value="" className="bg-[#182336] text-white">Select Condition</option>
                        <option value="New" className="bg-[#182336] text-white">New (Brand New)</option>
                        <option value="1st Hand" className="bg-[#182336] text-white">1st Hand (Used - Excellent)</option>
                        <option value="2nd Hand" className="bg-[#182336] text-white">2nd Hand (Used - Good)</option>
                        <option value="3rd Hand" className="bg-[#182336] text-white">3rd Hand (Used - Fair)</option>
                        <option value="Refurbished" className="bg-[#182336] text-white">Refurbished</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Purchase Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Purchase Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F83A7]">$</span>
                        <input
                          type="number"
                          value={formData.purchasePrice}
                          onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                          placeholder="15000"
                          className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Supplier</label>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                        placeholder="Supplier name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Warranty Expiry Date</label>
                      <input
                        type="date"
                        value={formData.warrantyExpiry}
                        onChange={(e) => handleInputChange('warrantyExpiry', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Assignment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#6F83A7]" />
                    </div>
                    <h3 className="text-white">Location & Assignment</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">
                        Production Line <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.productionLine}
                        onChange={(e) => handleInputChange('productionLine', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      >
                        <option value="" className="bg-[#182336] text-white">Select Line</option>
                        <option value="Line A" className="bg-[#182336] text-white">Line A</option>
                        <option value="Line B" className="bg-[#182336] text-white">Line B</option>
                        <option value="Line C" className="bg-[#182336] text-white">Line C</option>
                        <option value="Line D" className="bg-[#182336] text-white">Line D</option>
                        <option value="Finishing" className="bg-[#182336] text-white">Finishing</option>
                        <option value="Quality" className="bg-[#182336] text-white">Quality Control</option>
                        <option value="Packing" className="bg-[#182336] text-white">Packing</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Floor 2, Station 12"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm text-[#6F83A7] mb-2 block">Primary Operator</label>
                      <input
                        type="text"
                        value={formData.operator}
                        onChange={(e) => handleInputChange('operator', e.target.value)}
                        placeholder="Operator name or ID"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-[#57ACAF]" />
                    </div>
                    <h3 className="text-white">Technical Specifications</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Capacity</label>
                      <input
                        type="text"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        placeholder="5000 stitches/min"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Power Rating</label>
                      <input
                        type="text"
                        value={formData.powerRating}
                        onChange={(e) => handleInputChange('powerRating', e.target.value)}
                        placeholder="550W"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Voltage</label>
                      <input
                        type="text"
                        value={formData.voltage}
                        onChange={(e) => handleInputChange('voltage', e.target.value)}
                        placeholder="220V / 50Hz"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Max Speed</label>
                      <input
                        type="text"
                        value={formData.maxSpeed}
                        onChange={(e) => handleInputChange('maxSpeed', e.target.value)}
                        placeholder="5000 rpm"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Dimensions (L×W×H)</label>
                      <input
                        type="text"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange('dimensions', e.target.value)}
                        placeholder="120cm × 60cm × 110cm"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Weight</label>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="45 kg"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Operating Temperature</label>
                      <input
                        type="text"
                        value={formData.operatingTemperature}
                        onChange={(e) => handleInputChange('operatingTemperature', e.target.value)}
                        placeholder="15°C - 35°C"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Maintenance Interval (days)</label>
                      <input
                        type="number"
                        value={formData.maintenanceInterval}
                        onChange={(e) => handleInputChange('maintenanceInterval', e.target.value)}
                        placeholder="30"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Initial Setup */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#EAB308]" />
                    </div>
                    <h3 className="text-white">Initial Setup</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Installation Date</label>
                      <input
                        type="date"
                        value={formData.installationDate}
                        onChange={(e) => handleInputChange('installationDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Initial Calibration Date</label>
                      <input
                        type="date"
                        value={formData.calibrationDate}
                        onChange={(e) => handleInputChange('calibrationDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#57ACAF]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Initial Health Score</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.initialHealthScore}
                          onChange={(e) => handleInputChange('initialHealthScore', e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-white w-12 text-center">{formData.initialHealthScore}%</span>
                      </div>
                      <p className="text-xs text-[#6F83A7] mt-2">
                        Set based on machine condition (New: 100%, 1st Hand: 90%, 2nd Hand: 75%, 3rd Hand: 60%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manuals & Documentation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#6F83A7]" />
                      </div>
                      <h3 className="text-white">Manuals & Documentation</h3>
                    </div>
                    <Button
                      onClick={() => manualFileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Upload className="w-3 h-3 mr-2" />
                      Upload Files
                    </Button>
                  </div>

                  <input
                    ref={manualFileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleManualUpload}
                    className="hidden"
                  />

                  {manualFiles.length > 0 && (
                    <div className="space-y-2">
                      {manualFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-4 h-4 text-[#6F83A7]" />
                            <div className="flex-1">
                              <div className="text-sm text-white">{file.name}</div>
                              <div className="text-xs text-[#6F83A7]">
                                {(file.size / 1024).toFixed(2)} KB
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeManualFile(index)}
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {manualFiles.length === 0 && (
                    <div className="p-6 rounded-xl border border-dashed border-white/20 text-center">
                      <Upload className="w-8 h-8 text-[#6F83A7] mx-auto mb-2" />
                      <p className="text-sm text-[#6F83A7]">
                        Upload user manuals, service guides, or technical documentation
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#6F83A7]" />
                    </div>
                    <h3 className="text-white">Additional Notes</h3>
                  </div>

                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information about the machine..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#6F83A7]/50 focus:outline-none focus:border-[#57ACAF]/50 transition-all resize-none"
                  />
                </div>

                {/* AI Recommendation Card */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-1">AI Equipment Assistant</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        MARBIM can help optimize machine placement, predict maintenance schedules, and recommend ideal operators based on skills and performance data.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => toast.info('Ask MARBIM for equipment optimization advice')}
                        className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Get Recommendations
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-b from-transparent to-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6F83A7]">
                  <span className="text-red-400">*</span> Required fields
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Adding Machine...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Add Machine
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