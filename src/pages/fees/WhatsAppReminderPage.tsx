import React, { useState, useMemo, useEffect } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR, formatDate, createWhatsAppUrl } from '../../utils/formatters';
import { Student } from '../../types';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Filter,
  Users,
  TrendingUp,
  Percent,
  Sparkles,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';

interface DefaulterItem extends Student {
  daysOverdue: number;
  lastPaymentDate: string;
  waStatus: 'Sent' | 'Pending' | 'Failed';
  lastSentTimestamp?: string;
  defaulterType: '1 month' | '2+ months';
}

const TEMPLATES = [
  {
    id: 'gentle',
    name: '1. Gentle Courtesy Reminder',
    text: `Namaste {father_name} ji! A gentle reminder from {school_name}. {student_name}'s academic fee of {due_amount} for {class} is due on {due_date}. Kindly clear the dues via UPI: {upi_id} or link {payment_link}. Regards, Accounts Desk.`,
  },
  {
    id: 'standard',
    name: '2. Standard Due Notice',
    text: `Dear {father_name}, this is an official fee reminder from {school_name}. A balance of {due_amount} is pending for {student_name} ({class}). Please pay before {due_date} to prevent late fine surcharges. Pay online: {payment_link}. UPI: {upi_id}.`,
  },
  {
    id: 'urgent',
    name: '3. Urgent Final Defaulter Notice',
    text: `URGENT FINAL NOTICE: Dear {father_name}, pending fee dues of {due_amount} for {student_name} ({class}) are overdue by more than 30 days. Kindly clear the outstanding amount of {due_amount} immediately at the school counter or via UPI {upi_id} / {payment_link} to avoid exam roll number hold. {school_name} Management.`,
  },
];

export const WhatsAppReminderPage: React.FC = () => {
  const { students, payments } = useDataStore();
  const { school, showToast, activeSession } = useAppStore();

  // Filters
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [minDueAmount, setMinDueAmount] = useState<number>(1000);
  const [defaulterTypeFilter, setDefaulterTypeFilter] = useState<'All' | '1 month' | '2+ months'>('All');
  const [searchName, setSearchName] = useState('');

  // Template selector
  const [selectedTemplateId, setSelectedTemplateId] = useState('gentle');
  const [templateText, setTemplateText] = useState(TEMPLATES[0].text);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewStudentId, setPreviewStudentId] = useState<string>('');

  // Bulk send queue state
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [sentHistory, setSentHistory] = useState<Record<string, { status: 'Sent' | 'Failed'; time: string }>>({
    std_01: { status: 'Sent', time: '10:15 AM today' },
  });

  // Calculate defaulters with overdue stats
  const defaulterList: DefaulterItem[] = useMemo(() => {
    return students
      .filter((s) => (s.totalFeeDue || 0) > 0)
      .map((s, idx) => {
        const studentPayments = payments.filter((p) => p.studentId === s.id);
        const lastPayment = studentPayments[0]?.paidAt || '2027-08-10';
        const days = 15 + ((idx * 17) % 65); // dynamic realistic overdue days
        const type: '1 month' | '2+ months' = days > 30 ? '2+ months' : '1 month';

        const historyRecord = sentHistory[s.id];

        return {
          ...s,
          daysOverdue: days,
          lastPaymentDate: lastPayment,
          waStatus: historyRecord ? historyRecord.status : 'Pending',
          lastSentTimestamp: historyRecord?.time,
          defaulterType: type,
        };
      });
  }, [students, payments, sentHistory]);

  // Classes list for filter
  const classesList = useMemo(() => {
    return ['ALL', ...Array.from(new Set(students.map((s) => s.class)))];
  }, [students]);

  // Filtered roster
  const filteredDefaulters = useMemo(() => {
    return defaulterList.filter((d) => {
      if (classFilter !== 'ALL' && d.class !== classFilter) return false;
      if (sectionFilter !== 'ALL' && !d.section.includes(sectionFilter)) return false;
      if ((d.totalFeeDue || 0) < minDueAmount) return false;
      if (defaulterTypeFilter !== 'All' && d.defaulterType !== defaulterTypeFilter) return false;
      if (
        searchName &&
        !d.fullName.toLowerCase().includes(searchName.toLowerCase()) &&
        !d.parentPhone.includes(searchName) &&
        !d.fatherName.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [defaulterList, classFilter, sectionFilter, minDueAmount, defaulterTypeFilter, searchName]);

  // Select all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredDefaulters.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Preview student
  const previewStudent = useMemo(() => {
    if (previewStudentId) {
      const found = defaulterList.find((d) => d.id === previewStudentId);
      if (found) return found;
    }
    return filteredDefaulters[0] || defaulterList[0];
  }, [defaulterList, filteredDefaulters, previewStudentId]);

  // Dynamic template interpolation
  const interpolateMessage = (student: DefaulterItem) => {
    const upiId = `${school.code.toLowerCase()}@icici`;
    const payLink = `https://pay.dataclick.edu.in/due/${student.id}`;

    return templateText
      .replace(/{student_name}/g, student.fullName)
      .replace(/{father_name}/g, student.fatherName || 'Parent')
      .replace(/{class}/g, `${student.class} (${student.section})`)
      .replace(/{due_amount}/g, formatINR(student.totalFeeDue || 0))
      .replace(/{due_date}/g, '15th of this month')
      .replace(/{school_name}/g, school.name)
      .replace(/{payment_link}/g, payLink)
      .replace(/{upi_id}/g, upiId);
  };

  // Template change
  const handleTemplateSelect = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setTemplateText(tpl.text);
    }
  };

  // Send single via WhatsApp Web
  const handleSendSingle = (student: DefaulterItem) => {
    const msg = interpolateMessage(student);
    const url = createWhatsAppUrl(student.parentPhone, msg);
    window.open(url, '_blank');

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setSentHistory((prev) => ({
      ...prev,
      [student.id]: { status: 'Sent', time: `${now} today` },
    }));

    showToast({
      title: 'WhatsApp Reminder Dispatched',
      message: `Opened WhatsApp chat for ${student.fullName} (${student.parentPhone}).`,
      type: 'success',
    });
  };

  // Bulk send queue simulator with safety delay
  const handleStartBulkSend = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkSending(true);
    setBulkProgress({ current: 0, total: selectedIds.length });

    for (let i = 0; i < selectedIds.length; i++) {
      const stdId = selectedIds[i];
      const target = defaulterList.find((d) => d.id === stdId);
      if (target) {
        // Log send
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        setSentHistory((prev) => ({
          ...prev,
          [stdId]: { status: 'Sent', time: `${now} today` },
        }));
      }

      setBulkProgress({ current: i + 1, total: selectedIds.length });
      // Delay to avoid WhatsApp ban
      await new Promise((r) => setTimeout(r, delaySeconds * 1000));
    }

    setIsBulkSending(false);
    showToast({
      title: 'Bulk WhatsApp Dispatch Completed',
      message: `Successfully processed reminders for ${selectedIds.length} parents with ${delaySeconds}s anti-ban cadence.`,
      type: 'success',
    });
  };

  // Top KPI Stats
  const totalDefaultersCount = defaulterList.length;
  const totalOutstandingAmount = defaulterList.reduce((acc, d) => acc + (d.totalFeeDue || 0), 0);
  const remindersSentTodayCount = Object.keys(sentHistory).length;
  const paymentRecoveryRate = 42.8; // percentage

  return (
    <div className="space-y-6">
      {/* Title & Top Stats Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-700" />
              WhatsApp Business API Gateway
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-semibold">Anti-Ban Pacing Active</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">WhatsApp Fee Reminder Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated WhatsApp reminders, templated notifications, payment links and bulk dispatch queues
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartBulkSend}
            disabled={selectedIds.length === 0 || isBulkSending}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {isBulkSending
                ? `Sending (${bulkProgress.current}/${bulkProgress.total})...`
                : `Bulk Send (${selectedIds.length} Selected)`}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Defaulters</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalDefaultersCount}</p>
          <p className="text-[11px] text-rose-600 font-semibold mt-0.5">Students with dues &gt; ₹0</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Outstanding</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalOutstandingAmount)}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Current session uncollected</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Sent Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{remindersSentTodayCount}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Dispatches completed</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Response / Recovery</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-800 mt-2">{paymentRecoveryRate}%</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Settled within 48 hours</p>
        </div>
      </div>

      {/* Bulk Send Progress Banner if Active */}
      {isBulkSending && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
            <span>
              Dispatching Bulk Queue: {bulkProgress.current} of {bulkProgress.total} processed
            </span>
            <span>{Math.round((bulkProgress.current / bulkProgress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-700">
            Pacing delay: {delaySeconds} seconds between messages to protect institutional WhatsApp reputation.
          </p>
        </div>
      )}

      {/* Main Grid: Filters & Defaulters Table (7 cols) + Template Editor & Chat Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Bar & Defaulters Table */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filters Bar Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Filter Defaulters
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Found <strong className="text-slate-900">{filteredDefaulters.length}</strong> matching students
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Class</label>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                >
                  {classesList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Section</label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                >
                  <option value="ALL">All Sections</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Min Due (₹)</label>
                <input
                  type="number"
                  step={500}
                  value={minDueAmount}
                  onChange={(e) => setMinDueAmount(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none text-right"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Overdue Age</label>
                <select
                  value={defaulterTypeFilter}
                  onChange={(e) => setDefaulterTypeFilter(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                >
                  <option value="All">All Overdue</option>
                  <option value="1 month">1 Month (Recent)</option>
                  <option value="2+ months">2+ Months (Critical)</option>
                </select>
              </div>
            </div>

            {/* Student Search */}
            <div className="relative">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by student name, father name, or mobile..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Defaulter Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length > 0 && selectedIds.length === filteredDefaulters.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Select All ({selectedIds.length}/{filteredDefaulters.length})
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Pacing Delay:</span>
                <select
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(Number(e.target.value))}
                  className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-700 outline-none"
                >
                  <option value={2}>2s delay</option>
                  <option value={3}>3s delay</option>
                  <option value={5}>5s delay (safest)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-8">#</th>
                    <th className="py-2.5 px-3">Student & Father</th>
                    <th className="py-2.5 px-3">Class/Sec</th>
                    <th className="py-2.5 px-3 text-right">Total Due</th>
                    <th className="py-2.5 px-3 text-center">Overdue</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDefaulters.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                        No fee defaulters match current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDefaulters.map((st) => {
                      const isChecked = selectedIds.includes(st.id);
                      const isPreviewing = previewStudent?.id === st.id;

                      return (
                        <tr
                          key={st.id}
                          onClick={() => setPreviewStudentId(st.id)}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                            isPreviewing ? 'bg-teal-50/60' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                setSelectedIds((prev) =>
                                  prev.includes(st.id) ? prev.filter((i) => i !== st.id) : [...prev, st.id]
                                )
                              }
                              className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{st.fullName}</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              S/O {st.fatherName} • +91 {st.parentPhone}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-semibold">{st.class}</td>
                          <td className="py-2.5 px-3 text-right font-black text-rose-600">
                            {formatINR(st.totalFeeDue || 0)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                st.daysOverdue > 30
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {st.daysOverdue} days
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                st.waStatus === 'Sent'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {st.waStatus}
                            </span>
                            {st.lastSentTimestamp && (
                              <span className="block text-[9px] text-slate-400 mt-0.5">
                                {st.lastSentTimestamp}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleSendSingle(st)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors"
                              title="Send single WhatsApp"
                            >
                              <Send className="w-3 h-3" />
                              <span>Send</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Template Selector, Editor & Live Chat Bubble Preview */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Reminder Template Editor</h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                Dynamic Tags
              </span>
            </div>

            {/* Template Selector Pills */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-slate-500">
                Choose Pre-built Template
              </label>
              <div className="space-y-1.5">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleTemplateSelect(tpl.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedTemplateId === tpl.id
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customize Template Message
              </label>
              <textarea
                rows={5}
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white outline-none leading-relaxed"
              />
              <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-500">
                <span className="font-bold text-slate-700">Placeholders:</span>
                {['{student_name}', '{father_name}', '{class}', '{due_amount}', '{due_date}', '{school_name}', '{payment_link}', '{upi_id}'].map((ph) => (
                  <button
                    key={ph}
                    type="button"
                    onClick={() => setTemplateText((prev) => `${prev} ${ph}`)}
                    className="bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-mono text-emerald-800 font-bold"
                  >
                    {ph}
                  </button>
                ))}
              </div>
            </div>

            {/* Live WhatsApp Chat Bubble Preview */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-slate-500">
                Live Preview (Targeting: {previewStudent ? previewStudent.fullName : 'Selected Student'})
              </label>
              <div className="bg-[#EFEAE2] p-4 rounded-2xl shadow-inner space-y-2">
                <div className="bg-white p-3.5 rounded-xl rounded-tl-none shadow-sm space-y-2 text-xs text-slate-900 leading-relaxed font-sans">
                  <div className="flex items-center justify-between text-[11px] text-[#075E54] font-bold border-b border-slate-100 pb-1">
                    <span>{school.name}</span>
                    <span className="text-slate-400 text-[10px]">10:42 AM</span>
                  </div>

                  <p className="whitespace-pre-line text-[11px]">
                    {previewStudent ? interpolateMessage(previewStudent) : 'Select a student to preview personalized text.'}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Click-to-Pay Ready</span>
                    <span className="text-emerald-600 font-bold">✓✓ Read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
