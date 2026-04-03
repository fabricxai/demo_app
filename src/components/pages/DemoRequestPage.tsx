import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  User,
  Building2,
  Phone,
  Briefcase,
  Users,
  MapPin,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Shield,
  Rocket,
  Calendar,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { fabricxaiLogoDark } from "../../config/branding";
import type { DemoRequestPayload } from "../../utils/demoRequest";
import { submitDemoRequest } from "../../utils/demoRequest";
import { useIsMobileErpLayout } from "../../hooks/useMediaQuery";
import { MobileDemoRequestForm } from "../auth/MobileDemoRequestForm";

/** @deprecated use DemoRequestPayload from utils/demoRequest */
export type DemoRequestData = DemoRequestPayload;

export function DemoRequestPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileErpLayout();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState<DemoRequestPayload>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    companySize: "",
    industry: "",
    location: "",
    useCase: "",
    hearAboutUs: "",
    notes: "",
    requestedAt: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const updateField = (field: keyof DemoRequestPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field === "email" || field === "phone") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  // Validate phone format
  const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    // Accept various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
      // Validate email and phone
      const isEmailValid = validateEmail(formData.email);
      const isPhoneValid = validatePhone(formData.phone);
      
      if (!isEmailValid || !isPhoneValid) {
        toast.error("Please fix the errors before continuing");
        return;
      }
    } else if (step === 2) {
      if (!formData.companyName || !formData.jobTitle || !formData.companySize) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.industry || !formData.useCase) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const completeData: DemoRequestPayload = {
        ...formData,
        requestedAt: new Date().toISOString(),
      };

      const response = await submitDemoRequest(completeData);

      if (!response.ok) {
        throw new Error("Failed to submit demo request");
      }

      setIsSubmitted(true);
      toast.success("Request received — check your email for next steps.");
    } catch (error) {
      console.error("Demo request error:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const industries = [
    "Apparel Manufacturing",
    "Textile Manufacturing",
    "Fashion & Retail",
    "Home Textiles",
    "Technical Textiles",
    "Sportswear",
    "Intimate Apparel",
    "Other",
  ];

  const useCases = [
    "Production Management",
    "Quality Control",
    "Supply Chain Optimization",
    "Compliance & Sustainability",
    "Cost Management",
    "Full ERP Solution",
  ];

  const jobTitles = [
    "CEO / Managing Director",
    "COO / Operations Director",
    "Production Manager",
    "Quality Control Manager",
    "Supply Chain Manager",
    "Procurement Manager",
    "Finance Director",
    "Compliance Manager",
    "Sustainability Manager",
    "IT Manager",
    "Other",
  ];

  const hearAboutOptions = [
    "Google Search",
    "LinkedIn",
    "Industry Conference",
    "Referral",
    "Social Media",
    "Other",
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] px-4 py-10 pb-28">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-9 w-auto max-w-[200px] object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-white">FabricXAI</h1>
              <p className="text-xs text-[#6F83A7]">Garments intelligent platform</p>
            </div>
          </div>
          <p className="text-sm text-[#6F83A7] leading-relaxed">
            Explore the story on mobile—when you’re ready, request demo access with your work email. We’ll send credentials so you can sign in on a PC or laptop and use FabricXAI chat.
          </p>
          <MobileDemoRequestForm />
          <Button
            type="button"
            variant="outline"
            className="w-full border-white/15 text-white hover:bg-white/10"
            onClick={() => navigate("/login")}
          >
            Already a user? Log in
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#57ACAF]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#EAB308]/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-2xl shadow-[#57ACAF]/50">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-4 border-4 border-[#57ACAF]/30 rounded-full animate-ping" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Request received
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-[#6F83A7] mb-8"
          >
            Thank you for your interest. We’ll email login credentials to the address you provided once your
            workspace is ready. Use a desktop or laptop for the full ERP and FabricXAI assistant.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              className="bg-[#57ACAF] text-[#0D1117] hover:bg-[#57ACAF]/90"
              onClick={() => navigate("/login")}
            >
              Back to login
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate("/signup")}
            >
              Company signup (desktop)
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-[#6F83A7]">
              Our team may reach out to confirm details. Didn’t get an email? Check spam or contact your FabricXAI
              representative.
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#57ACAF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#EAB308]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#57ACAF]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-10 sm:h-11 w-auto max-w-[min(100%,280px)] object-contain object-left" />
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
              <div>
                <h1 className="text-xl font-bold text-white">Garments</h1>
                <p className="text-xs text-[#6F83A7] uppercase tracking-wider">
                  Intelligent Platform
                </p>
              </div>
            </div>

            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20 px-4 py-2 mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              Request Demo Access
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Experience the Power of AI-Driven Manufacturing
            </h2>
            <p className="text-lg text-[#6F83A7] max-w-2xl mx-auto">
              Fill out the form below to get instant access to our demo
              environment. Our sales team will reach out to provide
              personalized guidance.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                      ${
                        s === step
                          ? "bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 text-white shadow-lg shadow-[#57ACAF]/40"
                          : s < step
                          ? "bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 text-black"
                          : "bg-white/10 text-[#6F83A7]"
                      }
                    `}
                  >
                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 rounded-full transition-all duration-300 ${
                        s < step ? "bg-[#EAB308]" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-[#6F83A7]">
              Step {step} of 3:{" "}
              {step === 1
                ? "Personal Information"
                : step === 2
                ? "Company Details"
                : "Business Requirements"}
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#57ACAF]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#EAB308]/10 rounded-full blur-3xl -z-10" />

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <Input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            updateField("fullName", e.target.value)
                          }
                          placeholder="John Doe"
                          className="pl-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Work Email <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="john@company.com"
                          className="pl-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl"
                          required
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Phone Number <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+1 234 567 890"
                          className="pl-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl"
                          required
                        />
                        {errors.phone && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Company Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Company Name <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <Input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) =>
                            updateField("companyName", e.target.value)
                          }
                          placeholder="Acme Garments Ltd"
                          className="pl-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Job Title <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <select
                          value={formData.jobTitle}
                          onChange={(e) =>
                            updateField("jobTitle", e.target.value)
                          }
                          className="pl-12 h-13 w-full bg-white/[0.07] border border-white/10 text-white rounded-xl focus:border-[#57ACAF] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="" className="bg-[#101725]">
                            Select job title
                          </option>
                          {jobTitles.map((title) => (
                            <option
                              key={title}
                              value={title}
                              className="bg-[#101725]"
                            >
                              {title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Company Size <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors z-10" />
                        <select
                          value={formData.companySize}
                          onChange={(e) =>
                            updateField("companySize", e.target.value)
                          }
                          className="pl-12 h-13 w-full bg-white/[0.07] border border-white/10 text-white rounded-xl focus:border-[#57ACAF] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="" className="bg-[#101725]">
                            Select company size
                          </option>
                          {companySizes.map((size) => (
                            <option
                              key={size}
                              value={size}
                              className="bg-[#101725]"
                            >
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Location (City, Country)
                      </Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <Input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            updateField("location", e.target.value)
                          }
                          placeholder="Dhaka, Bangladesh"
                          className="pl-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Business Requirements */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Industry <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors z-10" />
                        <select
                          value={formData.industry}
                          onChange={(e) =>
                            updateField("industry", e.target.value)
                          }
                          className="pl-12 h-13 w-full bg-white/[0.07] border border-white/10 text-white rounded-xl focus:border-[#57ACAF] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="" className="bg-[#101725]">
                            Select industry
                          </option>
                          {industries.map((industry) => (
                            <option
                              key={industry}
                              value={industry}
                              className="bg-[#101725]"
                            >
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Primary Use Case <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative group">
                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors z-10" />
                        <select
                          value={formData.useCase}
                          onChange={(e) =>
                            updateField("useCase", e.target.value)
                          }
                          className="pl-12 h-13 w-full bg-white/[0.07] border border-white/10 text-white rounded-xl focus:border-[#57ACAF] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="" className="bg-[#101725]">
                            Select primary use case
                          </option>
                          {useCases.map((useCase) => (
                            <option
                              key={useCase}
                              value={useCase}
                              className="bg-[#101725]"
                            >
                              {useCase}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        How did you hear about us?
                      </Label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors z-10" />
                        <select
                          value={formData.hearAboutUs}
                          onChange={(e) =>
                            updateField("hearAboutUs", e.target.value)
                          }
                          className="pl-12 h-13 w-full bg-white/[0.07] border border-white/10 text-white rounded-xl focus:border-[#57ACAF] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#101725]">
                            Select an option
                          </option>
                          {hearAboutOptions.map((option) => (
                            <option
                              key={option}
                              value={option}
                              className="bg-[#101725]"
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">
                        Additional Notes or Questions
                      </Label>
                      <div className="relative group">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                        <textarea
                          value={formData.notes}
                          onChange={(e) => updateField("notes", e.target.value)}
                          placeholder="Tell us more about your requirements..."
                          rows={4}
                          className="pl-12 pt-3 pb-3 pr-4 w-full bg-white/[0.07] border border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl resize-none"
                        />
                      </div>
                    </div>

                    {/* Benefits Reminder */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-2">
                            What you'll get:
                          </p>
                          <ul className="text-[#6F83A7] text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                              Instant demo access with all 14 modules
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                              Personalized walkthrough from our team
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                              Custom implementation roadmap
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl"
                >
                  {step === 1 ? "Back to Login" : "Previous"}
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/30 transition-all rounded-xl"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black font-semibold shadow-lg shadow-[#EAB308]/30 transition-all rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit & Access Demo
                        <Rocket className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm text-[#6F83A7]"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#57ACAF]" />
              Secure & Encrypted
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#EAB308]" />
              Instant Access
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
              No Credit Card
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}