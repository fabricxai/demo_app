import { useState } from 'react';
import { Mail, User, Building2, Phone, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { buildDemoPayload, submitDemoRequest } from '../../utils/demoRequest';
import { isValidEmail } from '../../utils/auth';

interface MobileDemoRequestFormProps {
  className?: string;
  /** Pre-fill company (e.g. from signup step 1 on desktop) */
  defaultCompanyName?: string;
  onSuccess?: () => void;
}

export function MobileDemoRequestForm({
  className = '',
  defaultCompanyName = '',
  onSuccess,
}: MobileDemoRequestFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState(defaultCompanyName);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !companyName.trim()) {
      toast.error('Please add your name, email, and company.');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid work email.');
      return;
    }

    setLoading(true);
    try {
      const payload = buildDemoPayload({
        fullName,
        email,
        companyName,
        phone,
        notes,
        useCase: 'Mobile demo access — credentials by email',
      });
      const res = await submitDemoRequest(payload);
      if (!res.ok) throw new Error('Request failed');
      setDone(true);
      toast.success('Request received');
      onSuccess?.();
    } catch {
      toast.error('Could not submit. Try again or use a desktop browser.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={`rounded-2xl border border-[#57ACAF]/30 bg-[#57ACAF]/10 p-6 text-center ${className}`}>
        <CheckCircle2 className="w-12 h-12 text-[#57ACAF] mx-auto mb-3" />
        <p className="text-white font-medium mb-2">You’re on the list</p>
        <p className="text-sm text-[#6F83A7] leading-relaxed">
          We’ll email your login details when your workspace is ready. The full ERP experience works best on a
          PC or laptop—use those credentials there to open FabricXAI and chat with the assistant.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-white">Your name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white"
            autoComplete="name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white">Work email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white">Company</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white"
            autoComplete="organization"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#6F83A7]">Phone (optional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 …"
            className="pl-10 h-11 bg-white/5 border-white/10 text-white"
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#6F83A7]">Anything we should know? (optional)</Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#6F83A7]" />
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Role, region, priorities…"
            className="pl-10 min-h-[80px] bg-white/5 border-white/10 text-white resize-none"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#57ACAF] text-[#0D1117] hover:bg-[#57ACAF]/90 font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending…
          </>
        ) : (
          'Request demo access'
        )}
      </Button>
      <p className="text-[11px] text-[#6F83A7] text-center leading-relaxed">
        FabricXAI is built for desktop and laptop. We’ll send credentials to this email when approved.
      </p>
    </form>
  );
}
