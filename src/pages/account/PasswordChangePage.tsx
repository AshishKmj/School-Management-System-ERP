import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { KeyRound, ShieldCheck, Eye, EyeOff, Check, X } from 'lucide-react';

export const PasswordChangePage: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useAppStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLength || !hasUpper || !hasNumber) {
      showToast({ message: 'Password does not meet institutional complexity guidelines.', type: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    showToast({
      title: 'Security Password Updated',
      message: 'Workstation credentials refreshed successfully. Use new password on next login.',
      type: 'success',
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Account Security
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Change Password</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your workstation login credentials for user {user?.email}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password..."
                className="w-full px-3 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              New Password *
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter at least 8 characters with uppercase and numbers..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Confirm New Password *
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password to verify..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Guidelines */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Institutional Complexity Rules
            </span>
            <div className="flex items-center gap-2">
              {hasLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
              <span className={hasLength ? 'text-emerald-700 font-semibold' : ''}>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
              <span className={hasUpper ? 'text-emerald-700 font-semibold' : ''}>At least 1 uppercase letter (A-Z)</span>
            </div>
            <div className="flex items-center gap-2">
              {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
              <span className={hasNumber ? 'text-emerald-700 font-semibold' : ''}>At least 1 numerical digit (0-9)</span>
            </div>
            <div className="flex items-center gap-2">
              {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
              <span className={isMatch ? 'text-emerald-700 font-semibold' : ''}>Passwords match exactly</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Update Security Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
