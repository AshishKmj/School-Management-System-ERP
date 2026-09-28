import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from './Modal';
import { formatINR, createWhatsAppUrl, formatDate } from '../../utils/formatters';
import { Payment, PaymentMode } from '../../types';
import { Search, CheckCircle, Printer, MessageSquare, Zap, Barcode, ArrowRight } from 'lucide-react';
import { FeeReceiptModal } from '../fees/FeeReceiptModal';

export const QuickFeeCollectModal: React.FC = () => {
  const { isQuickFeeOpen, closeQuickFee, quickFeeGrNo, showToast, activeSession, school } = useAppStore();
  const { students, recordPayment, payments } = useDataStore();
  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState(quickFeeGrNo || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [reference, setReference] = useState('');
  const [autoPrint, setAutoPrint] = useState<boolean>(() => {
    return localStorage.getItem('dc_quick_fee_autoprint') === 'true';
  });
  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQuickFeeOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isQuickFeeOpen]);

  useEffect(() => {
    if (quickFeeGrNo) {
      setSearchTerm(quickFeeGrNo);
      const matched = students.find(
        (s) =>
          s.grNumber.toLowerCase() === quickFeeGrNo.toLowerCase() ||
          s.admissionNo?.toLowerCase() === quickFeeGrNo.toLowerCase()
      );
      if (matched) {
        setSelectedStudentId(matched.id);
        setAmount(matched.totalFeeDue && matched.totalFeeDue > 0 ? matched.totalFeeDue : 2500);
      }
    }
  }, [quickFeeGrNo, students]);

  // Mode shortcut listeners
  useEffect(() => {
    if (!isQuickFeeOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isQuickFeeOpen]);

  if (!isQuickFeeOpen) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const filteredStudents = searchTerm.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.grNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.parentPhone.includes(searchTerm)
      )
    : students.slice(0, 4);

  const handleSelectStudent = (s: (typeof students)[0]) => {
    setSelectedStudentId(s.id);
    setAmount(s.totalFeeDue && s.totalFeeDue > 0 ? s.totalFeeDue : 2500);
    setSearchTerm(s.admissionNo || s.fullName);
  };

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      showToast({ message: 'Please select a student first.', type: 'warning' });
      return;
    }
    if (amount <= 0) {
      showToast({ message: 'Please enter a valid amount greater than ₹0.', type: 'warning' });
      return;
    }

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
        feeHeadsCovered: ['Quick POS Fee Collection'],
        notes: `Quick Desk Collection [${paymentMode}]`,
        subtotal: amount,
        balanceRemaining: Math.max(0, (selectedStudent.totalFeeDue || 0) - amount),
      },
      user?.name || 'Counter Operator'
    );

    showToast({
      title: 'Fee Collected Successfully',
      message: `Receipt ${payment.receiptNo} generated for ${formatINR(amount)}.`,
      type: 'success',
    });

    if (autoPrint) {
      setCreatedPayment(payment);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCreatedPayment(null);
    setSelectedStudentId('');
    setSearchTerm('');
    setAmount(0);
    closeQuickFee();
  };

  return (
    <>
      <Modal
        isOpen={isQuickFeeOpen && !createdPayment}
        onClose={handleClose}
        title="Quick Fee Collect Desk (F2)"
        subtitle="One-screen rapid POS entry for counter fee collection"
        maxWidth="lg"
      >
        <form onSubmit={handleCollect} className="space-y-4">
          {/* Search bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                1. Scan Barcode or Type ADM / Mobile No
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <input
                  type="checkbox"
                  id="autoprint_modal"
                  checked={autoPrint}
                  onChange={(e) => {
                    setAutoPrint(e.target.checked);
                    localStorage.setItem('dc_quick_fee_autoprint', String(e.target.checked));
                  }}
                  className="w-3.5 h-3.5 rounded text-teal-600 accent-teal-600 cursor-pointer"
                />
                <label htmlFor="autoprint_modal" className="cursor-pointer font-medium">
                  Auto-print
                </label>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  const matched = students.find(
                    (s) =>
                      s.admissionNo?.toLowerCase() === e.target.value.trim().toLowerCase() ||
                      s.grNumber.toLowerCase() === e.target.value.trim().toLowerCase()
                  );
                  if (matched) {
                    setSelectedStudentId(matched.id);
                    setAmount(matched.totalFeeDue && matched.totalFeeDue > 0 ? matched.totalFeeDue : 2500);
                  }
                }}
                placeholder="Scan barcode or type student name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none focus:border-teal-500"
              />
            </div>

            {/* Suggestions */}
            {!selectedStudent && searchTerm && (
              <div className="mt-1.5 max-h-36 overflow-y-auto divide-y divide-slate-100 bg-white border border-slate-200 rounded-xl shadow-md">
                {filteredStudents.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectStudent(st)}
                    className="w-full text-left p-2 hover:bg-teal-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{st.fullName}</span>{' '}
                      <span className="text-[10px] text-slate-500 font-mono">({st.admissionNo || st.grNumber})</span>
                    </div>
                    <span className="font-bold text-rose-600">Due: {formatINR(st.totalFeeDue || 0)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Student Banner */}
          {selectedStudent && (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{selectedStudent.fullName}</span>
                  <span className="text-[10px] font-mono bg-teal-200 text-teal-900 px-1.5 rounded">
                    {selectedStudent.admissionNo || selectedStudent.grNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {selectedStudent.class} • Father: {selectedStudent.fatherName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Due</span>
                <span className="text-sm font-black text-rose-600">
                  {formatINR(selectedStudent.totalFeeDue || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Payment Mode Pills with Shortcuts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Payment Mode (Shortcuts: 1-Cash, 2-UPI, 3-Cheque, 4-Card)
            </label>
            <div className="grid grid-cols-4 gap-2">
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
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    paymentMode === id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{id}</span>
                  <kbd className="text-[9px] bg-black/10 px-1 rounded">[{num}]</kbd>
                </button>
              ))}
            </div>
          </div>

          {paymentMode !== 'Cash' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {paymentMode === 'UPI' ? 'UPI UTR No' : 'Cheque / Card Reference'}
              </label>
              <input
                type="text"
                placeholder="UTR or Cheque Ref..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 outline-none focus:bg-white"
              />
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              3. Amount Received (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min={1}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                placeholder="Enter amount..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-teal-900 outline-none focus:bg-white focus:border-teal-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!selectedStudent || amount <= 0}
              className="w-full py-3 bg-[#0B5D4B] hover:bg-[#073B30] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-emerald-300 text-emerald-300" />
              <span>Collect Fee ({formatINR(amount)}) & Generate Receipt</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Instant Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={!!createdPayment}
        onClose={handleClose}
        payment={createdPayment}
      />
    </>
  );
};
