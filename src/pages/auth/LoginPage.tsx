import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import {
  CreditCard,
  Fingerprint,
  BarChart3,
  MessageSquare,
  Building,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  ArrowRight,
  Headphones,
  CheckCircle2,
  AlertCircle,
  X,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  ShieldCheck,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { activeSession, school, showToast } = useAppStore();

  const [schoolCode, setSchoolCode] = useState('DPA-2024');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [session, setSession] = useState(activeSession || '2027-28');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // slight authentic network feeling
      const res = await login(username, password, session);
      if (res.success) {
        showToast({
          title: 'Welcome Back!',
          message: 'Logged into Data Click Education Management Console.',
          type: 'success',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      showToast({
        title: 'Authentication Error',
        message: 'Invalid credentials. Please use admin / admin123.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = (userType: string) => {
    switch (userType) {
      case 'super_admin':
        setUsername('admin');
        setPassword('admin123');
        break;
      case 'admin':
        setUsername('principal');
        setPassword('admin123');
        break;
      case 'accountant':
        setUsername('accountant');
        setPassword('admin123');
        break;
      case 'teacher':
        setUsername('teacher');
        setPassword('admin123');
        break;
      case 'receptionist':
        setUsername('receptionist');
        setPassword('admin123');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F8F6] flex flex-col justify-between selection:bg-[#14B8A6] selection:text-white">
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-12 min-h-[680px] border border-emerald-950/10">
          {/* ================= LEFT 50% PANEL: Deep Emerald Institutional Authority ================= */}
          <div className="lg:col-span-6 relative overflow-hidden bg-gradient-to-b from-[#0B5D4B] via-[#084B3D] to-[#073B30] p-6 sm:p-10 flex flex-col justify-between text-white">
            {/* Ambient Background Circles */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#14B8A6]/10 blur-3xl pointer-events-none" />

            {/* Top Branding */}
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi-974d7W-4N2BFQiVhZ9V3wHkblJHeiHgorFPdc45KQBRaZpQGmWGQPt9JQzAyGYAG8Zkb4ZkUUAQd_FeFMcBZCB96KN7sVZs1HHGFsPT3fm6QTd1gT66CuAZrGcqbSusf0b5QCYappZtvZ_k_i2HUymY_RJJ2-EatQllgHhWOChqu8wyOK1k36oXPfd6ydlVxOCgstzuBhp6RSLK6EqNLK6mi6v2PneeiiFB_rHbCff3VL1BQN_ZzA"
                      alt="Data Click Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="block text-xl font-bold tracking-tight text-white leading-tight">
                      Data Click
                    </span>
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#8CD3BC]">
                      Education ERP
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-[#71F8E4] animate-pulse" />
                  v4.2 Enterprise
                </span>
              </div>

              <div className="space-y-1.5 pt-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  Institutional Operating System
                </h1>
                <p className="text-sm text-[#D1FAE5] leading-relaxed">
                  Fees • Students • Attendance • Exams — everything in one unified dashboard.
                </p>
              </div>

              {/* 4 Feature Pills Bento-style Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-4 h-4 text-[#71F8E4]" />
                    <span className="text-[9px] font-bold uppercase bg-emerald-400/20 text-emerald-200 px-1.5 py-0.5 rounded-full">
                      Auto-Receipt
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white">Fee Management</div>
                  <p className="text-[11px] text-emerald-100/75">Ledgers, dues & UPI alerts</p>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <Fingerprint className="w-4 h-4 text-[#71F8E4]" />
                    <span className="text-[9px] font-bold uppercase bg-teal-400/20 text-teal-200 px-1.5 py-0.5 rounded-full">
                      Live Sync
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white">Attendance Pulse</div>
                  <p className="text-[11px] text-emerald-100/75">Staff & student RFID gates</p>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="w-4 h-4 text-[#71F8E4]" />
                    <span className="text-[9px] font-bold uppercase bg-indigo-400/20 text-indigo-200 px-1.5 py-0.5 rounded-full">
                      CBSE Aligned
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white">Exams & Results</div>
                  <p className="text-[11px] text-emerald-100/75">Report card batch generator</p>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <MessageSquare className="w-4 h-4 text-[#71F8E4]" />
                    <span className="text-[9px] font-bold uppercase bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded-full">
                      Instant Alert
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white">WhatsApp Gateway</div>
                  <p className="text-[11px] text-emerald-100/75">Notice blast & fee push</p>
                </div>
              </div>
            </div>

            {/* Campus Graphic Illustration */}
            <div className="relative z-10 my-6">
              <div className="rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white/5 p-1.5">
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-emerald-950">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI9Ba8X_odDyAtwlW5ro9X4-oR_FJO_e5-7A7V3xR9fAEE2dNZbqiILYS1O0le6SkhhIfBAkBbQKBSWN3jwMmBCnNl03xloDBAwkuRcvuG-bJJQXF6tV5CN2VnJZls7vO6xrN8FwoFJhvW440B3XdzZ6JLILDQeG8mtP0-8D5HJgFW02KWb__OmGFSilhbvMeYFlpG53LbReDb-H4py8byOMYYijh7sGGV82i5XbHTUi0QqmtzFbe9QQ"
                    alt="Campus illustration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#073B30]/90 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] text-white/90 font-medium flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#71F8E4]" />
                      Delhi Public Academy (Campus HQ)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Marker */}
            <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-white/80 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#71F8E4]" />
                <span>
                  Trusted by <strong className="text-white">450+</strong> CBSE, ICSE & State Schools
                </span>
              </div>
              <div className="flex -space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#14B8A6] text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white/20">
                  CB
                </span>
                <span className="w-5 h-5 rounded-full bg-[#006B5F] text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white/20">
                  IC
                </span>
                <span className="w-5 h-5 rounded-full bg-[#073B30] text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white/20">
                  UP
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT 50% PANEL: Clean Admin Workstation Form ================= */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-10 flex flex-col justify-between">
            <div className="w-full max-w-md mx-auto space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Welcome back</span>
                    <span>👋</span>
                  </h2>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    Admin Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter credentials to access administrative dashboard & fee ledgers.
                </p>
              </div>

              {/* Dismissible Notice */}
              {showNotice && (
                <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-3 rounded-xl flex items-start justify-between gap-2.5 text-xs text-emerald-900">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Demo Login Ready:</span> Use{' '}
                      <code className="bg-emerald-100/80 px-1 py-0.2 rounded font-mono font-bold">admin / admin123</code>{' '}
                      or select below.
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotice(false)}
                    className="text-emerald-700 hover:text-emerald-950 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* School Code */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      School Code <span className="normal-case font-normal">(Optional for single campus)</span>
                    </label>
                    <span className="text-[11px] text-teal-700 font-semibold">e.g. DPA-2024</span>
                  </div>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-slate-50 text-slate-900 text-sm pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:border-[#0B5D4B] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="Enter 4-letter campus ID"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Username / Mobile */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Username / Registered Mobile <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 text-slate-900 text-sm pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:border-[#0B5D4B] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
                      placeholder="admin / 9876543210"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-teal-700 hover:text-teal-900 font-semibold transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full bg-slate-50 text-slate-900 text-sm pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:border-[#0B5D4B] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="Enter school access password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Academic Session */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Academic Session <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <select
                      className="w-full bg-slate-50 text-slate-900 text-sm pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                    >
                      <option value="2027-28">2027–2028 (Current Active Session)</option>
                      <option value="2026-27">2026–2027 (Previous Session Archive)</option>
                      <option value="2025-26">2025–2026 (Audit & History Ledger)</option>
                    </select>
                  </div>
                </div>

                {/* Remember device checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0B5D4B] accent-[#0B5D4B] cursor-pointer"
                    />
                    <span>Remember on this campus workstation</span>
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 256-bit SSL
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#0B5D4B] hover:bg-[#073B30] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Fast 1-Click Role Switchers for testing */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  1-Click Role Autofill:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoUser('super_admin')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-[11px] font-medium text-slate-700 transition-colors"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoUser('admin')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-[11px] font-medium text-slate-700 transition-colors"
                  >
                    Principal
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoUser('accountant')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-[11px] font-medium text-slate-700 transition-colors"
                  >
                    Accountant
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoUser('teacher')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-[11px] font-medium text-slate-700 transition-colors"
                  >
                    Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoUser('receptionist')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-[11px] font-medium text-slate-700 transition-colors"
                  >
                    Receptionist
                  </button>
                </div>
              </div>

              {/* Instant Support Desk */}
              <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-800 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    Instant Support Desk
                  </span>
                  <a
                    href="tel:+917310095239"
                    className="font-bold text-slate-900 hover:underline bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs"
                  >
                    +91 7310095239
                  </a>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  <strong className="text-slate-700">Agar password bhool gaye hain</strong> toh school administrator se reset karwayen ya central helpline par contact karein.
                </p>
              </div>
            </div>

            {/* Bottom Workstation Tag */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Authorized Admin Gateway
              </span>
              <span>Build 2027.4.1</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1E1B6B] text-white py-2.5 px-4 sm:px-8 text-xs z-30 shadow-[0_-2px_12px_rgba(0,0,0,0.15)]">
        <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-3.5 h-3.5 text-teal-300" />
            <span>Need help? Support call karein:</span>
            <a href="tel:+917310095239" className="text-teal-300 font-bold hover:underline">
              +91 7310095239 (Toll-Free Support)
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://dataclick.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>dataclick.edu.in</span>
            </a>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-2.5">
              <a href="#" className="hover:text-teal-300 text-white/90">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-teal-300 text-white/90">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-teal-300 text-white/90">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
