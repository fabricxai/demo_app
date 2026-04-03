import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, FileText, Plus, Trash2, Settings, Zap, Clock,
  Bell, List, DollarSign, CreditCard, Wallet, PieChart, Calculator,
  TrendingDown, Users, Building2, Receipt, AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface FinanceSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  enabled: boolean;
}

interface PaymentTerm {
  id: string;
  name: string;
  days: number;
  description: string;
  enabled: boolean;
}

interface ExpenseCategory {
  id: string;
  name: string;
  budgetLimit: number;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'invoicing' | 'payment' | 'reconciliation' | 'reporting';
  enabled: boolean;
}

export function FinanceSetup({ onComplete, onClose, onAskMarbim }: FinanceSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: '1', bankName: 'HSBC Bangladesh', accountNumber: '****1234', currency: 'USD', enabled: true },
    { id: '2', bankName: 'Standard Chartered', accountNumber: '****5678', currency: 'EUR', enabled: true },
    { id: '3', bankName: 'Citibank N.A.', accountNumber: '****9012', currency: 'BDT', enabled: true },
  ]);
  
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { id: '1', name: '30% Advance, 70% Before Shipment', days: 30, description: 'Standard export terms', enabled: true },
    { id: '2', name: 'LC at Sight', days: 0, description: 'Letter of Credit', enabled: true },
    { id: '3', name: 'Net 30', days: 30, description: '30 days after invoice', enabled: true },
    { id: '4', name: 'Net 60', days: 60, description: '60 days after invoice', enabled: true },
  ]);
  
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([
    { id: '1', name: 'Raw Materials', budgetLimit: 500000, enabled: true },
    { id: '2', name: 'Labor & Wages', budgetLimit: 200000, enabled: true },
    { id: '3', name: 'Utilities', budgetLimit: 50000, enabled: true },
    { id: '4', name: 'Maintenance', budgetLimit: 30000, enabled: true },
  ]);
  
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Automated Invoice Generation', 
      description: 'AI creates professional invoices from orders with tax calculations',
      category: 'invoicing',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Payment Reminder System', 
      description: 'Automatic reminders to buyers before and after payment due dates',
      category: 'payment',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Smart Payment Tracking', 
      description: 'Track payments, aging receivables, and overdue invoices automatically',
      category: 'payment',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Bank Reconciliation AI', 
      description: 'Automatically match bank transactions with invoices and orders',
      category: 'reconciliation',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Expense Categorization', 
      description: 'AI automatically categorizes expenses and flags budget overruns',
      category: 'reconciliation',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Cash Flow Forecasting', 
      description: 'Predict cash flow for next 90 days based on orders and payments',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Profit Margin Analysis', 
      description: 'Real-time tracking of profit margins per buyer, order, and product',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Tax Compliance Helper', 
      description: 'Calculate VAT, GST, and export taxes automatically',
      category: 'invoicing',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Multi-Currency Management', 
      description: 'Handle USD, EUR, GBP transactions with automatic exchange rate updates',
      category: 'payment',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Financial Reports Dashboard', 
      description: 'P&L, Balance Sheet, Cash Flow statements with AI insights',
      category: 'reporting',
      enabled: true 
    },
  ]);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Bank Accounts', icon: Building2, color: '#EAB308', desc: 'Financial accounts' },
    { number: 2, title: 'Payment Terms', icon: CreditCard, color: '#57ACAF', desc: 'Billing terms' },
    { number: 3, title: 'Expenses', icon: Receipt, color: '#EAB308', desc: 'Cost tracking' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'automated-invoicing', 
      title: 'Automated Invoicing', 
      desc: 'AI generates professional invoices with tax calculations',
      icon: FileText 
    },
    { 
      id: 'payment-tracking', 
      title: 'Payment Tracking', 
      desc: 'Track receivables, overdue amounts, and payment status',
      icon: CreditCard 
    },
    { 
      id: 'bank-reconciliation', 
      title: 'Bank Reconciliation', 
      desc: 'Automatically match bank transactions with records',
      icon: Building2 
    },
    { 
      id: 'cash-flow-forecast', 
      title: 'Cash Flow Forecast', 
      desc: 'AI predicts cash flow for next 90 days',
      icon: TrendingUp 
    },
    { 
      id: 'expense-management', 
      title: 'Expense Management', 
      desc: 'Categorize expenses and track budget compliance',
      icon: Receipt 
    },
    { 
      id: 'financial-reports', 
      title: 'Financial Reports', 
      desc: 'P&L, Balance Sheet, and Cash Flow with AI insights',
      icon: BarChart3 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Finance Module. This module provides automated invoicing, payment tracking, bank reconciliation, and cash flow forecasting to ensure financial health. Let's build your intelligent finance system!",
      "Let's configure your bank accounts. Add your business accounts (HSBC, Standard Chartered, etc.) so we can track incoming payments and reconcile transactions automatically.",
      "Now let's set up payment terms. Define standard terms (30% advance, LC at sight, Net 30/60) so MARBIM can auto-generate invoices with correct payment schedules.",
      "Let's configure expense categories and budgets. Define spending categories (materials, labor, utilities) so AI can track expenses and alert you when budgets are exceeded.",
      "Finally, let's enable AI-powered finance workflows! From automated invoicing to payment tracking, bank reconciliation, and cash flow forecasting - I'll help you achieve complete financial visibility!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCompletedSteps([...completedSteps, currentStep]);
    setIsProcessing(false);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCompletedSteps(completedSteps.filter(step => step < currentStep - 1));
    }
  };

  const handleComplete = () => {
    toast.success('🎉 Finance module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateBankAccount = (id: string, field: keyof BankAccount, value: any) => {
    setBankAccounts(prev => prev.map(b =>
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const addBankAccount = () => {
    setBankAccounts(prev => [...prev, {
      id: Date.now().toString(),
      bankName: 'New Bank',
      accountNumber: '****0000',
      currency: 'USD',
      enabled: true
    }]);
  };

  const removeBankAccount = (id: string) => {
    if (bankAccounts.length > 1) {
      setBankAccounts(prev => prev.filter(b => b.id !== id));
    }
  };

  const updatePaymentTerm = (id: string, field: keyof PaymentTerm, value: any) => {
    setPaymentTerms(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addPaymentTerm = () => {
    setPaymentTerms(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Term',
      days: 30,
      description: 'Custom payment term',
      enabled: true
    }]);
  };

  const removePaymentTerm = (id: string) => {
    if (paymentTerms.length > 1) {
      setPaymentTerms(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateExpenseCategory = (id: string, field: keyof ExpenseCategory, value: any) => {
    setExpenseCategories(prev => prev.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const addExpenseCategory = () => {
    setExpenseCategories(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Category',
      budgetLimit: 10000,
      enabled: true
    }]);
  };

  const removeExpenseCategory = (id: string) => {
    if (expenseCategories.length > 1) {
      setExpenseCategories(prev => prev.filter(e => e.id !== id));
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomationWorkflows(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const progress = currentStep === 0 ? 0 : ((currentStep) / steps.length) * 100;

  const getWorkflowIcon = (category: string) => {
    switch (category) {
      case 'invoicing': return FileText;
      case 'payment': return CreditCard;
      case 'reconciliation': return CheckCircle;
      case 'reporting': return BarChart3;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'invoicing': return '#57ACAF';
      case 'payment': return '#EAB308';
      case 'reconciliation': return '#6F83A7';
      case 'reporting': return '#D0342C';
      default: return '#57ACAF';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#57ACAF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[100px]" />
      </div>

      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-6 right-6 z-10 text-white/60 hover:text-white hover:bg-white/10"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="relative h-full overflow-auto custom-scrollbar px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <Badge className="bg-gradient-to-r from-[#57ACAF]/20 to-[#EAB308]/20 text-white border border-[#57ACAF]/30 px-4 py-2 mb-4">
              <Settings className="w-4 h-4 inline mr-2" />
              Finance Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Intelligent Finance System
            </h1>
            <p className="text-lg text-[#6F83A7]">
              MARBIM will guide you through the setup process
            </p>
          </motion.div>

          {currentStep > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="grid grid-cols-5 gap-2 mb-3">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.number);
                  const isActive = currentStep === step.number;
                  
                  return (
                    <div key={step.number} className="relative">
                      <div className={`
                        relative overflow-hidden rounded-lg p-3 transition-all duration-300 border
                        ${isCompleted 
                          ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50' 
                          : isActive
                          ? 'border-2 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-lg'
                          : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 opacity-50'
                        }
                      `}
                      style={isActive ? { 
                        borderColor: step.color,
                        boxShadow: `0 0 20px ${step.color}40`
                      } : undefined}
                      >
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-all
                            ${isCompleted 
                              ? 'bg-[#57ACAF]/20' 
                              : isActive 
                              ? 'bg-gradient-to-br from-white/10 to-white/5'
                              : 'bg-white/5'
                            }
                          `}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                            ) : (
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#6F83A7]'}`} />
                            )}
                          </div>
                          <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-[#6F83A7]'}`}>
                            {step.title}
                          </span>
                          <span className={`text-[10px] ${isActive ? 'text-[#6F83A7]' : 'text-[#6F83A7]/60'}`}>
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">MARBIM</span>
                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-[10px] px-2 py-0">
                      AI Assistant
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6F83A7] leading-relaxed">
                    {getMarbimMessage(currentStep)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Welcome Screen */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#57ACAF]/10 via-white/5 to-[#EAB308]/10 border border-white/10 rounded-2xl p-8">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#57ACAF]/20 blur-2xl rounded-full" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 flex items-center justify-center shadow-lg">
                            <DollarSign className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Finance Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build an intelligent finance system with automated invoicing, payment tracking, 
                        bank reconciliation, and AI-powered cash flow forecasting for complete financial visibility.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <FileText className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Auto Invoicing</h3>
                          <p className="text-xs text-[#6F83A7]">AI-powered billing</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <CreditCard className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Payment Tracking</h3>
                          <p className="text-xs text-[#6F83A7]">Real-time status</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Cash Flow Forecast</h3>
                          <p className="text-xs text-[#6F83A7]">AI predictions</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {features.map((feature) => {
                        const Icon = feature.icon;
                        const isSelected = selectedFeatures.includes(feature.id);
                        
                        return (
                          <motion.button
                            key={feature.id}
                            onClick={() => toggleFeature(feature.id)}
                            className={`
                              relative overflow-hidden text-left p-4 rounded-xl border transition-all duration-300
                              ${isSelected 
                                ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'bg-[#57ACAF]/20' : 'bg-white/5'}
                              `}>
                                <Icon className={`w-5 h-5 ${isSelected ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                                  {feature.title}
                                </h4>
                                <p className="text-xs text-[#6F83A7] leading-relaxed">
                                  {feature.desc}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">Quick Setup</h3>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Complete setup in just 5-10 minutes. MARBIM will guide you through configuring bank accounts, 
                          payment terms, expense categories, and enabling AI-powered finance workflows.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-[#6F83A7]">5 simple steps</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-[#6F83A7]">AI-powered defaults</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-[#6F83A7]">Instant activation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Bank Accounts */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#EAB308]" />
                      Configure Bank Accounts
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {bankAccounts.map((account) => (
                        <div key={account.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{account.bankName}</h4>
                              <Switch
                                checked={account.enabled}
                                onCheckedChange={(checked) => updateBankAccount(account.id, 'enabled', checked)}
                              />
                            </div>
                            {bankAccounts.length > 1 && (
                              <Button
                                onClick={() => removeBankAccount(account.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Bank Name</Label>
                              <Input
                                value={account.bankName}
                                onChange={(e) => updateBankAccount(account.id, 'bankName', e.target.value)}
                                placeholder="e.g., HSBC Bangladesh"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Account Number</Label>
                              <Input
                                value={account.accountNumber}
                                onChange={(e) => updateBankAccount(account.id, 'accountNumber', e.target.value)}
                                placeholder="****1234"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Currency</Label>
                              <Select
                                value={account.currency}
                                onValueChange={(value) => updateBankAccount(account.id, 'currency', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="BDT">BDT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addBankAccount}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Bank Account
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Terms */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#EAB308]" />
                      Configure Payment Terms
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {paymentTerms.map((term) => (
                        <div key={term.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{term.name}</h4>
                              <Switch
                                checked={term.enabled}
                                onCheckedChange={(checked) => updatePaymentTerm(term.id, 'enabled', checked)}
                              />
                            </div>
                            {paymentTerms.length > 1 && (
                              <Button
                                onClick={() => removePaymentTerm(term.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Term Name</Label>
                              <Input
                                value={term.name}
                                onChange={(e) => updatePaymentTerm(term.id, 'name', e.target.value)}
                                placeholder="e.g., Net 30"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Days</Label>
                              <Input
                                type="number"
                                value={term.days}
                                onChange={(e) => updatePaymentTerm(term.id, 'days', parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Description</Label>
                              <Input
                                value={term.description}
                                onChange={(e) => updatePaymentTerm(term.id, 'description', e.target.value)}
                                placeholder="Payment terms description"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addPaymentTerm}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Term
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Expense Categories */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#EAB308]" />
                      Configure Expense Categories
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {expenseCategories.map((category) => (
                        <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{category.name}</h4>
                              <Switch
                                checked={category.enabled}
                                onCheckedChange={(checked) => updateExpenseCategory(category.id, 'enabled', checked)}
                              />
                            </div>
                            {expenseCategories.length > 1 && (
                              <Button
                                onClick={() => removeExpenseCategory(category.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Category Name</Label>
                              <Input
                                value={category.name}
                                onChange={(e) => updateExpenseCategory(category.id, 'name', e.target.value)}
                                placeholder="e.g., Raw Materials"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Monthly Budget Limit ($)</Label>
                              <Input
                                type="number"
                                value={category.budgetLimit}
                                onChange={(e) => updateExpenseCategory(category.id, 'budgetLimit', parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addExpenseCategory}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense Category
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Automation Workflows */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#EAB308]" />
                      Enable AI-Powered Finance Workflows
                    </h3>
                    
                    <div className="space-y-3">
                      {automationWorkflows.map((workflow) => {
                        const Icon = getWorkflowIcon(workflow.category);
                        const color = getWorkflowColor(workflow.category);
                        
                        return (
                          <div
                            key={workflow.id}
                            className={`
                              bg-white/5 border rounded-xl p-4 transition-all duration-300
                              ${workflow.enabled ? 'border-white/20' : 'border-white/10 opacity-60'}
                            `}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="w-5 h-5" style={{ color }} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="text-white font-medium mb-1">{workflow.name}</h4>
                                    <p className="text-sm text-[#6F83A7] leading-relaxed">
                                      {workflow.description}
                                    </p>
                                  </div>
                                  <Switch
                                    checked={workflow.enabled}
                                    onCheckedChange={() => toggleAutomation(workflow.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 0 || isProcessing}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === 0 && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                >
                  Skip Setup
                </Button>
              )}
              
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                >
                  Save & Exit
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isProcessing}
                className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 min-w-[140px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    {currentStep === 0 ? 'Start Setup' : 'Next Step'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
