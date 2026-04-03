import { useState } from 'react';
import { PageLayout } from '../PageLayout';
import { User, Mail, Building2, Shield, Calendar, MapPin, Phone, Globe, Edit, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { getCurrentSession } from '../../utils/supabase/rbac';

export function Profile() {
  const session = getCurrentSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@fabricxai.com',
    phone: '+1 (555) 123-4567',
    role: session.role,
    department: 'Operations',
    location: 'New York, USA',
    timezone: 'EST (UTC-5)',
    company: 'FabricXAI Demo',
    joinDate: 'January 2024',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.info('Changes cancelled');
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    manager: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    sales: 'bg-green-500/10 text-green-400 border-green-500/30',
    production: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    finance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    viewer: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };

  return (
    <PageLayout breadcrumbs={[{ label: 'Profile' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{formData.fullName}</h1>
                <p className="text-[#6F83A7] mb-3">{formData.email}</p>
                <Badge variant="outline" className={roleColors[formData.role] || roleColors.viewer}>
                  <Shield className="w-3 h-3 mr-1" />
                  {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </Badge>
              </div>
            </div>
            
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#57ACAF]"
                  />
                ) : (
                  <p className="text-white">{formData.email}</p>
                )}
              </div>

              <div>
                <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#57ACAF]"
                  />
                ) : (
                  <p className="text-white">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                  <Building2 className="w-3 h-3" />
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#57ACAF]"
                  />
                ) : (
                  <p className="text-white">{formData.department}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#57ACAF]"
                  />
                ) : (
                  <p className="text-white">{formData.location}</p>
                )}
              </div>

              <div>
                <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Timezone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#57ACAF]"
                  />
                ) : (
                  <p className="text-white">{formData.timezone}</p>
                )}
              </div>

              <div>
                <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Join Date
                </label>
                <p className="text-white">{formData.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#6F83A7] mb-1 flex items-center gap-2">
                <Building2 className="w-3 h-3" />
                Company Name
              </label>
              <p className="text-white">{formData.company}</p>
            </div>
            <div>
              <label className="text-xs text-[#6F83A7] mb-1">
                Company ID
              </label>
              <p className="text-white font-mono text-sm">{session.companyId}</p>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Security</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] ml-3"
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
