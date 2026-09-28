import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  MessageSquare,
  Building,
  Smartphone,
  Mail,
  Calendar,
  CheckCircle2,
  Lock,
  Headphones,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  ChevronRight,
  Info,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [schoolCode, setSchoolCode] = useState('DPA-2024');
  const [identifier, setIdentifier] = useState('+91 98765 43210');
  const [session, setSession] = useState('2027-28');
  const [otpSentViaWhatsapp, setOtpSentViaWhatsapp] = useState(true);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      showToast({
        title: 'OTP Dispatched',
        message: '6-digit OTP sent to your registered WhatsApp & SMS.',
        type: 'success',
      });
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      showToast({ message: 'Please enter a valid OTP code.', type: 'warning' });
      return;
    }
    setStep(3);
    showToast({
      title: 'Identity Verified',
      message: 'Now set a new secure password.',
      type: 'success',
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast({ message: 'Password must be at least 6 characters long.', type: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    showToast({
      title: 'Password Reset Successful',
      message: 'You can now login with your new password.',
      type: 'success',
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F1F8F6] flex flex-col justify-between selection:bg-[#14B8A6] selection:text-white">
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-12 min-h-[660px] border border-emerald-950/10">
          {/* ================= LEFT 50% PANEL: Branding & Security Badges ================= */}
          <div className="lg:col-span-6 relative overflow-hidden bg-gradient-to-b from-[#0B5D4B] via-[#084B3D] to-[#073B30] p-6 sm:p-10 flex flex-col justify-between text-white">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi-974d7W-4N2BFQiVhZ9V3wHkblJHeiHgorFPdc45KQBRaZpQGmWGQPt9JQzAyGYAG8Zkb4ZkUUAQd_FeFMcBZCB96KN7sVZs1HHGFsPT3fm6QTd1gT66CuAZrGcqbSusf0b5QCYappZtvZ_k_i2HUymY_RJJ2-EatQllgHhWOChqu8wyOK1k36oXPfd6ydlVxOCgstzuBhp6RSLK6EqNLK6mi6v2PneeiiFB_rHbCff3VL1BQN_ZzA"
                    alt="Data Click Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                    Data Click Education
                  </h1>
                  <p className="text-[10px] font-semibold text-teal-200 uppercase tracking-widest">
                    Institutional Management Suite
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-[#71F8E4] leading-snug">
                Secure Account Recovery for School Administrators & Staff
              </p>
            </div>

            {/* Campus Graphic Illustration */}
            <div className="relative z-10 my-4 flex flex-col items-center">
              <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl bg-emerald-950/60 p-2 backdrop-blur-sm border border-white/10">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI9Ba8X_odDyAtwlW5ro9X4-oR_FJO_e5-7A7V3xR9fAEE2dNZbqiILYS1O0le6SkhhIfBAkBbQKBSWN3jwMmBCnNl03xloDBAwkuRcvuG-bJJQXF6tV5CN2VnJZls7vO6xrN8FwoFJhvW440B3XdzZ6JLILDQeG8mtP0-8D5HJgFW02KWb__OmGFSilhbvMeYFlpG53LbReDb-H4py8byOMYYijh7sGGV82i5XbHTUi0QqmtzFbe9QQ"
                  alt="Campus illustration"
                  className="w-full h-44 object-cover rounded-lg"
                />
              </div>
              <div className="w-full max-w-md mt-2 flex items-center justify-between text-teal-200 text-xs px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Central Board & State Synced
                </span>
                <span className="text-[#71F8E4] font-semibold">Active Session: 2027-28</span>
              </div>
            </div>

            {/* 3 Security Guarantee Badges */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#71F8E4] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">256-bit OTP</span>
                  <span className="text-[10px] text-teal-200">End-to-End Safe</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#71F8E4] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">Instant WhatsApp</span>
                  <span className="text-[10px] text-teal-200">Verified Delivery</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#71F8E4] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">Audit Logged</span>
                  <span className="text-[10px] text-teal-200">Admin Guard</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT 50% PANEL: Recovery Form Wizard ================= */}
          <div className="lg:col-span-6 bg-slate-50/50 p-6 sm:p-10 flex flex-col justify-between">
            {/* Top Navigation Back */}
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5D4B] hover:text-[#073B30] transition-colors py-1 px-2 rounded hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-100 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
                <span>Secure Auth Portal</span>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Forgot Password?</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step === 1 && 'Enter your registered Mobile Number or School Email ID to receive a secure OTP.'}
                    {step === 2 && 'Enter the 6-digit OTP sent to your registered device.'}
                    {step === 3 && 'Choose a strong new password for school portal access.'}
                  </p>
                </div>
              </div>

              {/* 3-Step Wizard Indicator */}
              <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between text-xs">
                <div className={`flex items-center gap-1.5 ${step === 1 ? 'font-bold text-emerald-900' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-[#0B5D4B] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    1
                  </span>
                  <span>Verify Identity</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-1.5 ${step === 2 ? 'font-bold text-emerald-900' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-[#0B5D4B] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    2
                  </span>
                  <span>Enter OTP</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-1.5 ${step === 3 ? 'font-bold text-emerald-900' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-[#0B5D4B] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    3
                  </span>
                  <span>New Password</span>
                </div>
              </div>

              {/* STEP 1: Verify Identity */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        School Code <span className="normal-case font-normal">(Optional for single campus)</span>
                      </label>
                      <span className="text-[11px] text-teal-700 font-semibold">e.g. DPA-2024</span>
                    </div>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 text-sm focus:border-[#0B5D4B] outline-none"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        placeholder="Enter 6-digit School Code"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Registered Mobile / Email ID <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1 bg-slate-200/60 p-0.5 rounded-md text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setMode('phone');
                            setIdentifier('+91 98765 43210');
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            mode === 'phone' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Mobile
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('email');
                            setIdentifier('principal@dataclick.edu.in');
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            mode === 'email' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Email
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      {mode === 'phone' ? (
                        <Smartphone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      ) : (
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      )}
                      <input
                        type={mode === 'phone' ? 'tel' : 'email'}
                        required
                        className="w-full pl-10 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 text-sm focus:border-[#0B5D4B] outline-none font-medium"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Academic Session <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <select
                        className="w-full pl-10 pr-8 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 text-sm focus:border-[#0B5D4B] outline-none cursor-pointer"
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                      >
                        <option value="2027-28">2027-28 (Current Session)</option>
                        <option value="2026-27">2026-27 (Previous Session)</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Checkbox */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={otpSentViaWhatsapp}
                        onChange={(e) => setOtpSentViaWhatsapp(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0B5D4B] accent-[#0B5D4B]"
                      />
                      <span>
                        Send OTP via <strong className="text-emerald-900">WhatsApp & SMS</strong>
                      </span>
                    </label>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      WhatsApp Active
                    </span>
                  </div>

                  {/* Hinglish note */}
                  <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/60 text-teal-900 flex items-center gap-2 text-xs">
                    <Info className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Registered mobile number par 6-digit OTP turant bhej diya jayega.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send OTP & Reset Link</span>
                  </button>
                </form>
              )}

              {/* STEP 2: Enter OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-bold">OTP Dispatched to {identifier}</span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      For testing, you can enter <code className="font-bold">123456</code>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      6-Digit Security OTP *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      className="w-full tracking-widest text-center text-xl font-mono font-bold py-2 bg-white rounded-lg border border-slate-200 focus:border-[#0B5D4B] outline-none"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      ← Change Mobile / Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtp('123456')}
                      className="text-teal-700 font-bold hover:underline"
                    >
                      Autofill Demo Code (123456)
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow-md transition-all"
                  >
                    Verify OTP Code
                  </button>
                </form>
              )}

              {/* STEP 3: Set New Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:border-[#0B5D4B] outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:border-[#0B5D4B] outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow-md transition-all"
                  >
                    Save Password & Login
                  </button>
                </form>
              )}

              {/* Help & Return links */}
              <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <Headphones className="w-3.5 h-3.5 text-[#0B5D4B]" />
                  Need immediate help?
                  <a href="tel:+917310095239" className="text-[#0B5D4B] font-bold hover:underline">
                    +91 7310095239
                  </a>
                  <span className="text-slate-400 text-[10px]">(Mon-Sat, 9AM-7PM)</span>
                </p>
                <p>
                  Remember your password?{' '}
                  <Link to="/login" className="text-[#0B5D4B] font-bold hover:underline">
                    Back to Login →
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-4">
              Official School Portal • Encrypted Session Auth • Data Click EDU v4.8
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#1E1B6B] text-white py-2 px-4 sm:px-8 text-xs">
        <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Need help? Call: +91 7310095239 (Toll-Free Support)</span>
          <div className="flex items-center gap-3 text-white/80">
            <a href="https://dataclick.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              dataclick.edu.in
            </a>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 hover:text-white" />
              <Facebook className="w-4 h-4 hover:text-white" />
              <Instagram className="w-4 h-4 hover:text-white" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
