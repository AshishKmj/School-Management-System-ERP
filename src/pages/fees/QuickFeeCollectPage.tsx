import React, { useState, useEffect, useRef } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR, formatDate, createWhatsAppUrl } from '../../utils/formatters';
import { Student, Payment, PaymentMode } from '../../types';
import {
  Zap,
  Search,
  Printer,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CreditCard,
  Barcode,
  History,
  Check,
} from 'lucide-react';
import { FeeReceiptModal } from '../../components/fees/FeeReceiptModal';

export const QuickFeeCollectPage: React.FC = () => {
  const { students, payments, recordPayment } = useDataStore();
  const { activeSession, school, showToast } = useAppStore();
  const { user } = useAuthStore();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [reference, setReference] = useState('');
  const [autoPrint, setAutoPrint] = useState<boolean>(() => {
    return localStorage.getItem('dc_quick_fee_autoprint') === 'true';
  });
  const [recentReceipt, setRecentReceipt] = useState<Payment | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Focus search on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut listener for (1: Cash, 2: UPI, 3: Cheque, 4: Card)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused on an input other than search, don't trigger mode change unless Alt/Ctrl pressed
      if (e.target instanceof HTMLInputElement && e.target.type === 'text' && e.target.value.length > 0) {
        return;
      }
      if (e.key === '1') setPaymentMode('Cash');
      if (e.key === '2') setPaymentMode('UPI');
      if (e.key === '3') setPaymentMode('Cheque');
      if (e.key === '4') setPaymentMode('Card');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update auto-print preference
  const toggleAutoPrint = (checked: boolean) => {
    setAutoPrint(checked);
    localStorage.setItem('dc_quick_fee_autoprint', String(checked));
  };

  // Search / barcode scan match
  const handleQueryChange = (val: string) => {
    setInputQuery(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setSelectedStudent(null);
      setAmount(0);
      return;
    }

    const match = students.find(
      (s) =>
        s.admissionNo?.toLowerCase() === trimmed ||
        s.grNumber.toLowerCase() === trimmed ||
        s.fullName.toLowerCase() === trimmed ||
        s.parentPhone === trimmed
    );

    if (match) {
      setSelectedStudent(match);
      setAmount(match.totalFeeDue && match.totalFeeDue > 0 ? match.totalFeeDue : 2500);
      amountRef.current?.focus();
    }
  };

  // Submit quick collection
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      showToast({ message: 'Scan barcode or select a student first.', type: 'warning' });
      return;
    }
    if (amount <= 0) {
      showToast({ message: 'Enter a valid amount greater than ₹0.', type: 'warning' });
      return;
    }

    const nextReceiptNum = 9840 + payments.length + 1;
    const sessionSuffix = activeSession.split('_')[1] ? activeSession.split('_')[1].slice(-2) : '27';
    const autoReceiptNo = `RCPT-${sessionSuffix}-${String(nextReceiptNum).slice(-4)}`;

    const payment = await recordPayment(
      {
        schoolId: selectedStudent.schoolId,
        sessionId: activeSession,
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        admissionNo: selectedStudent.admissionNo,
        grNumber: selectedStudent.grNumber,
        rollNo: selectedStudent.rollNo,
        fatherName: selectedStudent.fatherName,
        className: selectedStudent.class,
        section: selectedStudent.section,
        amount,
        mode: paymentMode,
        transactionRef: reference || undefined,
        collectedBy: user?.name || 'Counter Operator',
        feeHeadsCovered: ['Rapid Counter Collection (All Current Dues)'],
        notes: `Quick POS Entry [Mode: ${paymentMode}]`,
        subtotal: amount,
        balanceRemaining: Math.max(0, (selectedStudent.totalFeeDue || 0) - amount),
      },
      user?.name || 'Counter Operator'
    );

    showToast({
      title: 'Quick Collection Saved',
      message: `Receipt ${payment.receiptNo} issued for ${formatINR(amount)}.`,
      type: 'success',
    });

    if (autoPrint) {
      setRecentReceipt(payment);
    }

    // Reset for next quick barcode scan
    setInputQuery('');
    setSelectedStudent(null);
    setAmount(0);
    setReference('');
    inputRef.current?.focus();
  };

  // Recent 5 collections
  const recentPayments = payments.slice(0, 5);

  const handleShareWhatsApp = (p: Payment) => {
    const student = students.find((s) => s.id === p.studentId);
    const phone = student?.parentPhone || '9876543210';
    const msg = `*FEE RECEIPT ACKNOWLEDGEMENT*\n${school.name}\n\nDear Parent,\nWe have received fee payment of *${formatINR(p.amount)}* for *${p.studentName}* (${p.className}).\nReceipt No: *${p.receiptNo}*\nDate: ${formatDate(p.paidAt)}\nMode: ${p.mode}\n\nThank you,\nAccounts Desk, ${school.name}`;
    window.open(createWhatsAppUrl(phone, msg), '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B5D4B] via-[#084B3D] to-[#073B30] text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-emerald-950" />
              Rapid POS Counter Mode
            </span>
            <span className="text-teal-200 text-xs">Press [F2] anywhere to summon</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Quick Fee Collect</h2>
          <p className="text-xs text-teal-100/80 mt-0.5">
            Minimal, keyboard-first fee checkout. Scan student barcode or type ADM No and hit Enter.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-2xl border border-white/10 shrink-0">
          <input
            type="checkbox"
            id="autoPrintCheck"
            checked={autoPrint}
            onChange={(e) => toggleAutoPrint(e.target.checked)}
            className="w-4 h-4 rounded text-teal-500 accent-emerald-400 cursor-pointer"
          />
          <label htmlFor="autoPrintCheck" className="text-xs font-bold text-white cursor-pointer select-none">
            Auto-open Receipt on Enter
          </label>
        </div>
      </div>

      {/* Main Fast Checkout Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <form onSubmit={handleQuickSubmit} className="space-y-6">
          {/* Step 1: Scan Barcode / ADM No */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-teal-600" />
                <span>1. Scan Student Barcode or Type ADM / Mobile No</span>
              </label>
              <span className="text-[11px] text-slate-400">Try "ADM-26-0412" or "Aarav"</span>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Scan student ID card barcode, type Admission No, or Student Name..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-600 outline-none transition-all shadow-inner"
              />
            </div>

            {/* Quick Autocomplete Chips if typing */}
            {inputQuery && !selectedStudent && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {students
                  .filter(
                    (s) =>
                      s.fullName.toLowerCase().includes(inputQuery.toLowerCase()) ||
                      s.admissionNo?.toLowerCase().includes(inputQuery.toLowerCase()) ||
                      s.grNumber.toLowerCase().includes(inputQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudent(st);
                        setInputQuery(st.admissionNo || st.fullName);
                        setAmount(st.totalFeeDue && st.totalFeeDue > 0 ? st.totalFeeDue : 2500);
                        amountRef.current?.focus();
                      }}
                      className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs font-bold text-teal-800 hover:bg-teal-100 transition-colors"
                    >
                      {st.fullName} ({st.class}) • Due: {formatINR(st.totalFeeDue || 0)}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Student Found Banner */}
          {selectedStudent && (
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-700 text-white font-black text-lg flex items-center justify-center">
                  {selectedStudent.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedStudent.fullName}</h3>
                    <span className="text-xs font-mono font-bold bg-teal-200/80 text-teal-900 px-2 py-0.2 rounded-md">
                      {selectedStudent.admissionNo || selectedStudent.grNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {selectedStudent.class} ({selectedStudent.section}) • Father: {selectedStudent.fatherName} • Ph: +91 {selectedStudent.parentPhone}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Due Balance</span>
                <span className="text-xl font-black text-rose-600">
                  {formatINR(selectedStudent.totalFeeDue || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Payment Mode Pills with Number Shortcuts */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              2. Payment Mode (Press 1: Cash, 2: UPI, 3: Cheque, 4: Card)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Cash', num: '1' },
                { id: 'UPI', num: '2' },
                { id: 'Cheque', num: '3' },
                { id: 'Card', num: '4' },
              ].map(({ id, num }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMode(id as PaymentMode)}
                  className={`py-3 px-4 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
                    paymentMode === id
                      ? 'border-teal-600 bg-teal-50 text-teal-950 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">{id}</span>
                  <kbd className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-md border border-slate-300 text-slate-500">
                    [{num}]
                  </kbd>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Reference Input */}
          {paymentMode !== 'Cash' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {paymentMode === 'UPI' ? 'UPI UTR / Reference' : 'Cheque / Card Transaction Ref'}
              </label>
              <input
                type="text"
                placeholder={paymentMode === 'UPI' ? 'e.g. UPI/429810294102' : 'e.g. Cheque #40129'}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-teal-600"
              />
            </div>
          )}

          {/* Step 3: Enter Amount & Hit Enter */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              3. Amount Received (Hit Enter to Complete)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold text-xl">₹</span>
              <input
                ref={amountRef}
                type="number"
                min={1}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                placeholder="Enter amount..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-teal-500/40 rounded-2xl text-xl font-black text-teal-900 focus:bg-white focus:border-teal-600 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Big Action Submit Button */}
          <button
            type="submit"
            disabled={!selectedStudent || amount <= 0}
            className="w-full py-4 bg-[#0B5D4B] hover:bg-[#073B30] disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Confirm & Collect Payment ({formatINR(amount)})</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* ===================== RECENT 5 COLLECTIONS ===================== */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">Recent 5 Counter Collections</h3>
          </div>
          <span className="text-xs text-slate-500">Live session transactions</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {recentPayments.map((p) => (
            <div key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 font-black flex items-center justify-center">
                  ₹
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{p.studentName}</span>
                    <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {p.receiptNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {p.className} • {p.mode} • {formatDate(p.paidAt)} by {p.collectedBy}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-900">{formatINR(p.amount)}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRecentReceipt(p)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors"
                    title="Reprint receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Reprint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(p)}
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                    title="Share receipt via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for reprint / auto-print */}
      <FeeReceiptModal
        isOpen={!!recentReceipt}
        onClose={() => setRecentReceipt(null)}
        payment={recentReceipt}
      />
    </div>
  );
};
