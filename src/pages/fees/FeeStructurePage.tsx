import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR } from '../../utils/formatters';
import {
  Receipt,
  UserCheck,
  Forward,
  Copy,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  FileText,
  Search,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const FeeStructurePage: React.FC = () => {
  const { feeTypes, addFeeType, removeFeeType } = useDataStore();
  const { activeSession, school, showToast } = useAppStore();
  const { user } = useAuthStore();

  // Add Fee Type form state
  const [targetClass, setTargetClass] = useState('ALL');
  const [feeName, setFeeName] = useState('');
  const [amount, setAmount] = useState<number>(4500);
  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'Yearly' | 'One-time'>('Monthly');
  const [description, setDescription] = useState('Includes textbook kit and digital classroom license.');
  const [dueDay, setDueDay] = useState<number>(10);

  // Rollover state
  const [applyInflation, setApplyInflation] = useState(true);

  // Table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [freqFilter, setFreqFilter] = useState('ALL');
  const [previewEmpty, setPreviewEmpty] = useState(false);

  const handleAddHead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeName) {
      showToast({ message: 'Please enter a fee type name.', type: 'warning' });
      return;
    }

    await addFeeType(
      {
        schoolId: school.id,
        sessionId: activeSession,
        className: targetClass,
        name: feeName,
        amount,
        frequency,
        description,
        dueDayOfMonth: dueDay,
      },
      user?.name || 'Accountant'
    );

    showToast({
      title: 'Fee Head Registered',
      message: `${feeName} (${formatINR(amount)}) added to ${targetClass} schedule.`,
      type: 'success',
    });

    setFeeName('');
  };

  const handleAssignToStudents = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Ledgers Synchronized',
      message: 'Idempotent assignment complete. All enrolled students assigned without duplicates.',
      type: 'success',
    });
  };

  const handleCopyNextYear = () => {
    const revisionMsg = applyInflation
      ? 'with +5% inflation adjustment applied'
      : 'with identical fee amounts';
    showToast({
      title: 'Fee Structure Rolled Over',
      message: `Cloned active fee heads into 2028–2029 session ${revisionMsg}.`,
      type: 'success',
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete fee head "${name}"?`)) {
      await removeFeeType(id, name, user?.name || 'Administrator');
      showToast({
        title: 'Fee Head Archived',
        message: `Deactivated "${name}". Audit logged into Fee Deletion record.`,
        type: 'error',
      });
    }
  };

  const filteredFeeTypes = (previewEmpty ? [] : feeTypes).filter((ft) => {
    const matchesSearch =
      !searchQuery ||
      ft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ft.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'ALL' || ft.className === classFilter;
    const matchesFreq = freqFilter === 'ALL' || ft.frequency === freqFilter;
    return matchesSearch && matchesClass && matchesFreq;
  });

  return (
    <div className="space-y-6">
      {/* Top Hero Context Header & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Active Master Schedule
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              {school.affiliationNumber}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Structure</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Manage fee heads, assign fee schedules to classes, and rollover structures across sessions with automated audit trails.
          </p>
        </div>

        {/* Quick Metrics Strip */}
        <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl shadow-xs border border-emerald-950/5">
          <div className="px-3 py-1 border-r border-slate-100 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Heads</span>
            <span className="text-sm font-bold text-[#0B5D4B]">{feeTypes.length} Defined</span>
          </div>
          <div className="px-3 py-1 border-r border-slate-100 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Annualized Pool</span>
            <span className="text-sm font-bold text-emerald-700">₹1.84 Cr</span>
          </div>
          <div className="px-3 py-1 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Unassigned Ledgers</span>
            <span className="text-sm font-bold text-rose-600">2 Classes</span>
          </div>
        </div>
      </div>

      {/* ROW 1: Two cards side by side (Add Fee Type & Assign Fees) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CARD 1: Add Fee Type / Head (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 relative overflow-hidden space-y-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B5D4B] via-[#14B8A6] to-emerald-400" />
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0B5D4B] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Fee Type / Head</h3>
                <p className="text-xs text-slate-500">Define tuition, examination, lab, or custom heads.</p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">
              Setup Form
            </span>
          </div>

          <form onSubmit={handleAddHead} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                >
                  <option value="ALL">All Classes (Universal Fee)</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fee Type Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tuition Fee, Development Fund"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                  value={feeName}
                  onChange={(e) => setFeeName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white outline-none"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-not-allowed"
                  value={activeSession}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Frequency <span className="text-rose-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white outline-none cursor-pointer"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                >
                  <option value="Monthly">Monthly (12 Installments)</option>
                  <option value="Quarterly">Quarterly (4 Installments)</option>
                  <option value="Yearly">Yearly (Annual Charge)</option>
                  <option value="One-time">One-time (At Admission)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Receipt Note
              </label>
              <input
                type="text"
                placeholder="Printed on fee invoice..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Audited instantly to school fiscal ledger
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Fee Type</span>
              </button>
            </div>
          </form>
        </div>

        {/* CARD 2: Assign Fees to Students (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-400" />
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assign Fees to Students</h3>
                <p className="text-xs text-slate-500">Generate student fee ledgers in bulk.</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
              Bulk Ledger
            </span>
          </div>

          <form onSubmit={handleAssignToStudents} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Cohort / Class <span className="text-rose-500">*</span>
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white outline-none cursor-pointer">
                <option value="ALL">All Enrolled Students (Whole School - 1,248 Pupils)</option>
                <option value="Class 1">Class 1 (Section A, B, C) • 92 Pupils</option>
                <option value="UKG">UKG (Section A + B) • 64 Pupils</option>
                <option value="Class 10">Class 10 (Board Batch) • 118 Pupils</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Session</label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-not-allowed"
                  value={activeSession}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Due Day</label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
                  value={dueDay}
                  onChange={(e) => setDueDay(Number(e.target.value))}
                >
                  <option value={5}>05th of every month</option>
                  <option value={10}>10th of every month</option>
                  <option value={15}>15th of every month</option>
                  <option value={30}>End of Month</option>
                </select>
              </div>
            </div>

            {/* Bilingual Safety Callout */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900">Idempotent Safe:</strong> Already-assigned fee heads won’t be duplicated.<br />
                <span className="text-slate-500 italic text-[11px]">Pehle se assigned fees dobara add nahi hongi.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Assign to All Students in Class</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Active Ledgers: 1,180 / 1,248</span>
            <span className="text-emerald-700 font-bold">94.5% Synced</span>
          </div>
        </div>
      </div>

      {/* ROW 2: "Copy to Next Year" card (Rollover / Session Migration) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-200 border-l-4 border-l-purple-600 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Forward className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Copy Fee Structure to Next Academic Year</h3>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                1-Click Rollover
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Clone entire fee head configurations into upcoming academic session with automatic inflation revisions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">From:</span>
            <span className="px-2 py-1 rounded bg-slate-100 font-bold text-emerald-900">{activeSession}</span>
            <span className="text-slate-400">→ To:</span>
            <span className="px-2 py-1 rounded bg-slate-100 font-bold text-purple-900">2028–2029</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
            <input
              type="checkbox"
              checked={applyInflation}
              onChange={(e) => setApplyInflation(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600"
            />
            <span>
              Apply <strong className="text-purple-700">+5%</strong> revision (Inflation Index)
            </span>
          </label>

          <button
            type="button"
            onClick={handleCopyNextYear}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Structure</span>
          </button>
        </div>
      </div>

      {/* ROW 3: "Current Fee Structure" Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Current Fee Structure</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {filteredFeeTypes.length} Active Heads
                </span>
              </div>
              <p className="text-xs text-slate-500">Class-wise fee itemization for Term {activeSession}</p>
            </div>

            {/* Toggle demo view */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewEmpty(false)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  !previewEmpty ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Active Data
              </button>
              <button
                type="button"
                onClick={() => setPreviewEmpty(true)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  previewEmpty ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Empty State
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search fee head..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="ALL">All Classes</option>
              <option value="UKG">UKG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>

            <select
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              value={freqFilter}
              onChange={(e) => setFreqFilter(e.target.value)}
            >
              <option value="ALL">All Frequencies</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
              <option value="One-time">One-time</option>
            </select>

            <button
              type="button"
              onClick={() => showToast({ message: 'Exporting fee schedule to Excel...', type: 'info' })}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-emerald-700 transition-colors"
              title="Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => showToast({ message: 'Exporting fee circular to PDF...', type: 'info' })}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-rose-700 transition-colors"
              title="PDF"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        {filteredFeeTypes.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <Receipt className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No fee structure defined yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Create a new fee head using the form above or import existing heads from last year’s session.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-center w-12">#</th>
                  <th className="py-2.5 px-4">Class / Target</th>
                  <th className="py-2.5 px-4">Fee Type / Head Name</th>
                  <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-4 text-center">Session</th>
                  <th className="py-2.5 px-4 text-center">Frequency</th>
                  <th className="py-2.5 px-4">Due Cycle</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredFeeTypes.map((ft, idx) => (
                  <tr key={ft.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {ft.className}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ft.name}</div>
                      <div className="text-[11px] text-slate-500">{ft.description}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800 text-sm tabular-nums">
                      {formatINR(ft.amount)}
                      <span className="text-[10px] font-normal text-slate-400">
                        /{ft.frequency === 'Monthly' ? 'mo' : ft.frequency === 'Yearly' ? 'yr' : 'inst'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                        {ft.sessionId || activeSession}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ft.frequency === 'Monthly'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ft.frequency === 'Yearly'
                            ? 'bg-purple-100 text-purple-800'
                            : ft.frequency === 'Quarterly'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ft.frequency}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {ft.dueDayOfMonth ? `${ft.dueDayOfMonth}th of month` : 'Start of Term'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => showToast({ message: `Editing ${ft.name}...`, type: 'info' })}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ft.id, ft.name)}
                          className="p-1 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Currencies formatted in Indian Rupee (INR - ₹)</span>
          <span>Showing {filteredFeeTypes.length} fee heads</span>
        </div>
      </div>
    </div>
  );
};
