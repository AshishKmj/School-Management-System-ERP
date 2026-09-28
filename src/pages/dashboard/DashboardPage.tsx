import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import { formatINR, formatTime, createWhatsAppUrl } from '../../utils/formatters';
import {
  UserPlus,
  Zap,
  MessageSquare,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Receipt,
  Search,
  Download,
  Printer,
  Phone,
  CheckCircle2,
  Clock,
  Palette,
  Check,
  ArrowRight,
  FileText,
  Volume2,
  Send,
  Eye,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, openQuickFee, showToast } = useAppStore();
  const { students, payments, enquiries, notices, getKPIs } = useDataStore();

  const kpis = getKPIs();
  const [tableFilterClass, setTableFilterClass] = useState('ALL');
  const [tableSearch, setTableSearch] = useState('');
  const [deskGr, setDeskGr] = useState('GR-2024-0412');
  const [deskQuarter, setDeskQuarter] = useState('Quarter 3 (Oct - Dec 2027)');

  // Filter payments
  const displayedPayments = payments.filter((p) => {
    const matchesClass = tableFilterClass === 'ALL' || p.className.includes(tableFilterClass);
    const matchesSearch =
      !tableSearch ||
      p.studentName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.grNumber.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleFetchChallan = () => {
    const matched = students.find((s) => s.grNumber.toLowerCase() === deskGr.toLowerCase());
    if (matched) {
      openQuickFee(matched.grNumber);
    } else {
      openQuickFee(deskGr);
    }
  };

  const handlePrintReceipt = (receiptNo: string, studentName: string) => {
    showToast({
      title: 'Printing Challan',
      message: `Preparing printable receipt document for ${receiptNo} (${studentName}).`,
      type: 'info',
    });
    window.print();
  };

  const handleWhatsAppChallan = (phone: string, studentName: string, amount: number) => {
    const msg = `Namaste! Fee payment of ${formatINR(amount)} received for ${studentName} at Delhi Public Academy. Thank you.`;
    window.open(createWhatsAppUrl(phone, msg), '_blank');
  };

  const handleBulkReminders = () => {
    showToast({
      title: 'WhatsApp Blast Queued',
      message: '18 fee reminder notifications dispatched via WhatsApp Cloud API.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* ================= 1. TOP OPERATIONAL BANNER & QUICK ACTIONS ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#004435] via-[#0B5D4B] to-[#073B30] text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#14B8A6]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-24 w-60 h-60 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#71F8E4] animate-ping" />
              <span>Session 2027-28 • Live Campus Operations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, Administrator!
            </h2>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              Here is what's happening at <strong className="text-white">Delhi Public Academy</strong> today. All morning buses reported on time and 1st shift attendance is synced.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/students/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006B5F] hover:bg-[#005248] text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ New Admission</span>
            </button>

            <button
              onClick={() => openQuickFee()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg active:scale-95 group"
            >
              <Zap className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>⚡ Quick Fee Collect</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/25 text-emerald-100">
                F2
              </span>
            </button>

            <button
              onClick={() => navigate('/notices')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs transition-all backdrop-blur-sm border border-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Notice</span>
            </button>

            <button
              onClick={() => navigate('/academics/attendance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all backdrop-blur-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. KEY PERFORMANCE INDICATORS (4 KPI CARDS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Students (Teal Top) */}
        <div className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border border-emerald-950/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#14B8A6]" />
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Students
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +4.2%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[28px] font-bold tracking-tight text-slate-900 tabular-nums">
                {kpis.activeStudents.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">registered</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Active: 1,810
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Inactive: 32
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <span className="truncate">🇮🇳 Kul registered vidhyarthi</span>
            <span className="font-bold text-[#0B5D4B]">Class Nursery - XII</span>
          </div>
        </div>

        {/* Card 2: Fee Collected (Green Top) */}
        <div className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border border-emerald-950/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Fee Collected (Oct)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className="text-[28px] font-bold tracking-tight text-slate-900 tabular-nums">
                {formatINR(kpis.totalCollected)}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Target: ₹30,00,000</span>
                <span className="font-bold text-emerald-800">82.8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: '82.8%' }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <span>Daily Avg: {formatINR(kpis.todayCollected)}</span>
            <span className="text-emerald-700 font-semibold">18 Days Left</span>
          </div>
        </div>

        {/* Card 3: Pending Defaulters (Red Top) */}
        <div className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border border-emerald-950/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]" />
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                Pending Defaulters
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold">
                Action Req.
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[28px] font-bold tracking-tight text-rose-600 tabular-nums">
                {formatINR(kpis.pendingFees)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Across <strong className="text-slate-900">{kpis.defaultersCount} students</strong> with &gt;30 days delay.
            </p>
          </div>
          <div className="mt-4 pt-3">
            <button
              onClick={() => navigate('/fees/whatsapp-reminder')}
              className="w-full py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp Reminders</span>
            </button>
          </div>
        </div>

        {/* Card 4: Monthly Expenses (Orange Top) */}
        <div className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border border-emerald-950/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F97316]" />
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Monthly Expenses
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">
                Within Budget
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[28px] font-bold tracking-tight text-slate-900 tabular-nums">
                {formatINR(kpis.totalExpenses)}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              Staff Payroll, Utilities, Science Lab Maintenance
            </p>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <span>Balance Pool:</span>
            <span className="font-bold text-[#0B5D4B]">₹3,57,820 remaining</span>
          </div>
        </div>
      </div>

      {/* ================= 3. TWO-COLUMN OPERATIONAL GRID (65% / 35%) ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Grid & Enquiries (~65% = 8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Recent Fee Collection & Receipts Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-emerald-950/5">
            {/* Table Header & Controls */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#0B5D4B]" />
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Fee Collection & Receipts
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live audit ledger of offline counters, UPI QR, and online portal
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B5D4B]"
                    placeholder="Filter receipt or student..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>

                <select
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  value={tableFilterClass}
                  onChange={(e) => setTableFilterClass(e.target.value)}
                >
                  <option value="ALL">All Classes</option>
                  <option value="Class 10">Class X-A</option>
                  <option value="Class 9">Class IX-B</option>
                  <option value="Class 7">Class VII-C</option>
                  <option value="Class 12">Class XII-Sci</option>
                </select>

                <button
                  type="button"
                  onClick={() => showToast({ message: 'Exporting recent payments to Excel...', type: 'info' })}
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors"
                  title="Export Excel"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 z-10">
                  <tr>
                    <th className="py-2.5 px-4">Receipt #</th>
                    <th className="py-2.5 px-4">Student & GR</th>
                    <th className="py-2.5 px-4">Class/Sec</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Mode</th>
                    <th className="py-2.5 px-4">Time</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {displayedPayments.slice(0, 5).map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0B5D4B]">
                        {pay.receiptNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{pay.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{pay.grNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {pay.section || pay.className}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800 tabular-nums">
                        {formatINR(pay.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              pay.mode === 'UPI'
                                ? 'bg-blue-500'
                                : pay.mode === 'Cash'
                                ? 'bg-emerald-500'
                                : pay.mode === 'NetBanking'
                                ? 'bg-purple-500'
                                : 'bg-slate-500'
                            }`}
                          />
                          {pay.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {formatTime(pay.paidAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-emerald-800 bg-[#DCFCE7] font-bold text-[10px]">
                          Paid
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(pay.receiptNo, pay.studentName)}
                            className="p-1 hover:bg-slate-100 rounded text-[#0B5D4B] transition-colors"
                            title="Print Challan"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleWhatsAppChallan('9876543210', pay.studentName, pay.amount)
                            }
                            className="p-1 hover:bg-slate-100 rounded text-emerald-600 transition-colors"
                            title="WhatsApp Receipt"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {displayedPayments.length} transactions recorded</span>
              <Link
                to="/fees/collection"
                className="text-[#0B5D4B] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>View Complete Audit Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Admission Enquiry Widget (4 Inquiries) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#006B5F]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Fresh Admission Enquiries
                  </h3>
                  <p className="text-xs text-slate-500">Recent parent walk-ins & web enquiry forms</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold">
                14 Uncontacted
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {enquiries.slice(0, 4).map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors flex flex-col justify-between border border-slate-100"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{enq.studentName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.status === 'Form Issued'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'Campus Tour Done'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'Admitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Father: <strong className="text-slate-700">{enq.fatherName}</strong> • Target:{' '}
                      <span className="text-[#0B5D4B] font-bold">{enq.targetClass}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" /> +91 {enq.phone}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60">
                    <span className="text-[11px] truncate max-w-[150px]">
                      {enq.remarks || 'Standard prospectus issued'}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/enquiries')}
                      className="text-[#006B5F] font-bold hover:underline shrink-0 text-xs"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Theme Showcase, WhatsApp Drawer & Attendance (~35% = 4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Today's Attendance Pulse (Visual Gauge) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#0B5D4B]" />
                <h3 className="text-sm font-bold text-slate-900">Daily Attendance Pulse</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Biometric
              </span>
            </div>

            <div className="space-y-4">
              {/* Student attendance progress */}
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-semibold text-slate-700">Students Present</span>
                  <span className="font-bold text-[#0B5D4B]">
                    94.6% <span className="font-normal text-slate-500">(1,742 / 1,842)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-[#0B5D4B] h-2.5 rounded-full"
                    style={{ width: '94.6%' }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                  <span>Absent: 100 students</span>
                  <span className="text-teal-700 font-medium">SMS alerts dispatched</span>
                </div>
              </div>

              {/* Staff attendance progress */}
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-semibold text-slate-700">Faculty & Staff</span>
                  <span className="font-bold text-emerald-700">
                    98.2% <span className="font-normal text-slate-500">(74 / 75)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-600 h-2.5 rounded-full"
                    style={{ width: '98.2%' }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                  <span>1 on approved maternity leave</span>
                  <span className="text-emerald-700 font-semibold">100% Substitution covered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Fee Reminder Drawer / Panel */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Automated WhatsApp Reminder</h3>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Preview message template sent directly via WhatsApp Cloud API with one-click payment UPI link:
            </p>

            {/* WhatsApp Chat Bubble Preview */}
            <div className="bg-[#ECE5DD] p-3 rounded-xl text-[#111B21] text-xs shadow-inner font-sans mb-3">
              <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                  <span>Delhi Public Academy Accounts</span>
                  <span className="text-slate-400">10:30 AM</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Dear Parent, reminder for pending Q3 fees of <strong className="text-rose-700">₹6,500</strong> for{' '}
                  <strong className="text-emerald-900">Aarav Sharma (Class 10-A)</strong>. Kindly pay online before 15th Nov to avoid late fee.
                </p>
                <div className="pt-1 flex items-center gap-1 text-blue-600 font-semibold text-[11px]">
                  <span>pay.dataclick.edu.in/q3/dce842</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBulkReminders}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Bulk Send Reminders (18 Pending Today)</span>
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2">
              ⚡ Hinglish text included for maximum parent reach
            </p>
          </div>

          {/* Campus Theme Profiles Showcase */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#0B5D4B]" />
                <h3 className="text-sm font-bold text-slate-900">Campus Theme Profiles</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Multi-Brand ERP
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              One-click chromatic adaptation according to institutional school house branding:
            </p>

            <div className="space-y-2">
              {/* Theme 1 */}
              <div
                onClick={() => setTheme('emerald')}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                  theme === 'emerald'
                    ? 'bg-emerald-50/80 ring-2 ring-[#0B5D4B] border-transparent'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center -space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#0B5D4B]" />
                    <span className="w-4 h-4 rounded-full bg-[#14B8A6]" />
                    <span className="w-4 h-4 rounded-full bg-[#E8EFED]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Emerald School</div>
                    <div className="text-[10px] text-slate-500">Deep Green & Bright Mint</div>
                  </div>
                </div>
                {theme === 'emerald' ? (
                  <Check className="w-4 h-4 text-[#0B5D4B]" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">Apply</span>
                )}
              </div>

              {/* Theme 2 */}
              <div
                onClick={() => setTheme('indigo')}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                  theme === 'indigo'
                    ? 'bg-blue-50/80 ring-2 ring-indigo-700 border-transparent'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center -space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#1E1B6B]" />
                    <span className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                    <span className="w-4 h-4 rounded-full bg-[#EFF6FF]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Royal Indigo-Navy</div>
                    <div className="text-[10px] text-slate-500">Cobalt & Electric Blue</div>
                  </div>
                </div>
                {theme === 'indigo' ? (
                  <Check className="w-4 h-4 text-indigo-700" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">Apply</span>
                )}
              </div>

              {/* Theme 3 */}
              <div
                onClick={() => setTheme('berry')}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                  theme === 'berry'
                    ? 'bg-pink-50/80 ring-2 ring-purple-600 border-transparent'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center -space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#6617D7]" />
                    <span className="w-4 h-4 rounded-full bg-[#EC4899]" />
                    <span className="w-4 h-4 rounded-full bg-[#FDF2F8]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Berry Twilight</div>
                    <div className="text-[10px] text-slate-500">Purple-Pink & Amber</div>
                  </div>
                </div>
                {theme === 'berry' ? (
                  <Check className="w-4 h-4 text-purple-600" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">Apply</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. FAST DESK ENTRY & SYSTEM VALIDATION STRIP ================= */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Fast Desk Entry & System Validation
            </h4>
            <p className="text-xs text-slate-500">
              Floating inputs for quick fee desk counter operator
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
              Auto-suggest active
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Cloud Synced
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center pt-3">
          <div className="relative">
            <span className="absolute text-[10px] uppercase font-bold text-[#0B5D4B] top-1.5 left-3">
              Student GR Number *
            </span>
            <input
              type="text"
              className="w-full h-12 pt-4 px-3 rounded-lg bg-slate-50 text-slate-900 font-semibold text-sm border border-slate-200 focus:bg-white focus:border-[#0B5D4B] outline-none"
              value={deskGr}
              onChange={(e) => setDeskGr(e.target.value)}
            />
          </div>

          <div className="relative">
            <span className="absolute text-[10px] uppercase font-bold text-slate-400 top-1.5 left-3 pointer-events-none">
              Billing Quarter
            </span>
            <select
              className="w-full h-12 pt-4 px-3 rounded-lg bg-slate-50 text-slate-900 font-semibold text-sm border border-slate-200 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
              value={deskQuarter}
              onChange={(e) => setDeskQuarter(e.target.value)}
            >
              <option>Quarter 3 (Oct - Dec 2027)</option>
              <option>Quarter 4 (Jan - Mar 2028)</option>
              <option>Annual Transport Pass</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleFetchChallan}
            className="h-12 rounded-lg bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Fetch Due Challan</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/fees/collection')}
            className="h-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Past Transactions</span>
          </button>
        </div>

        {/* Hinglish Operator Helper Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700">Tips for Counter Operators:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
            Raseed turant WhatsApp par bhej di gayi hai
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
            Press [F2] any time for new counter payment
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
            Offline cash receipt automatically syncs with central bank ledger
          </span>
        </div>
      </div>

      {/* ================= 5. LATEST NOTICES CIRCULAR ================= */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">Latest Circulars & Notices</h3>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600 font-semibold">
              Official Circulars
            </span>
          </div>
          <Link
            to="/notices"
            className="text-[#0B5D4B] font-bold text-xs hover:underline flex items-center gap-1"
          >
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {notices.slice(0, 2).map((notice) => (
            <div
              key={notice.id}
              className="p-4 rounded-xl bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                  <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                  <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                    {notice.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notice.message}</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-800">Audience: {notice.audience}</span>
                  <span>•</span>
                  <span>Author: {notice.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => showToast({ message: 'Downloading official PDF circular...', type: 'info' })}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Download PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <Link
                  to="/notices"
                  className="px-3 py-1.5 rounded-lg bg-[#0B5D4B] hover:bg-[#073B30] text-white text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Full</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
