import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Settings, Save, Building, Phone, Mail, Globe, Share2, DollarSign } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { school, updateSchool, showToast } = useAppStore();

  const [formData, setFormData] = useState({
    name: school.name,
    code: school.code,
    boardAffiliation: school.boardAffiliation,
    affiliationNumber: school.affiliationNumber,
    address: school.address,
    city: school.city,
    state: school.state,
    pincode: school.pincode,
    phone: school.phone,
    tollFreeSupport: school.tollFreeSupport,
    email: school.email,
    website: school.website,
    admissionPrefix: school.admissionPrefix,
    admissionFormPrice: school.admissionFormPrice,
    principalName: school.principalName,
    youtube: school.socialLinks?.youtube || '',
    facebook: school.socialLinks?.facebook || '',
    instagram: school.socialLinks?.instagram || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name: formData.name,
      code: formData.code,
      boardAffiliation: formData.boardAffiliation,
      affiliationNumber: formData.affiliationNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      phone: formData.phone,
      tollFreeSupport: formData.tollFreeSupport,
      email: formData.email,
      website: formData.website,
      admissionPrefix: formData.admissionPrefix,
      admissionFormPrice: Number(formData.admissionFormPrice),
      principalName: formData.principalName,
      socialLinks: {
        youtube: formData.youtube,
        facebook: formData.facebook,
        instagram: formData.instagram,
      },
    });

    showToast({
      title: 'Institutional Settings Saved',
      message: 'Global parameters, branding, and contact channels updated across ERP.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Institution Dossier
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin & School Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure school profile, board affiliation numbers, receipt parameters, and social channels
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Institution Profile */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>School Identification & Affiliation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Official School Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                School Institution Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Board Affiliation
              </label>
              <input
                type="text"
                value={formData.boardAffiliation}
                onChange={(e) => setFormData({ ...formData, boardAffiliation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Affiliation Number
              </label>
              <input
                type="text"
                value={formData.affiliationNumber}
                onChange={(e) => setFormData({ ...formData, affiliationNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Principal In-charge
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Contact & Campus Location</span>
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Campus Postal Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Front Office Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Website URL
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Admissions & Fiscal Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Admissions & Form Pricing Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Admission Number Prefix (e.g. ADM-)
              </label>
              <input
                type="text"
                value={formData.admissionPrefix}
                onChange={(e) => setFormData({ ...formData, admissionPrefix: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Admission Prospectus / Form Fee (₹)
              </label>
              <input
                type="number"
                value={formData.admissionFormPrice}
                onChange={(e) => setFormData({ ...formData, admissionFormPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Links & Footer Channels */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Social Media Channels (Applies to Footer & Receipts)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
