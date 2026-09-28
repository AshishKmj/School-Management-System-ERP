import React, { useState, useMemo } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR, formatDate, formatDateTime, createWhatsAppUrl } from '../../utils/formatters';
import { Student, Payment, PaymentMode } from '../../types';
import {
  CreditCard,
  Search,
  Printer,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Zap,
  Download,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  Building,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Check,
  Filter,
} from 'lucide-react';
import { FeeReceiptModal } from '../../components/fees/FeeReceiptModal';
import { SoftDeleteFeeModal } from '../../components/fees/SoftDeleteFeeModal';

interface StudentFeeItem {
  id: string;
  feeType: string;
  period: string;
  amount: number;
  discount: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending';
}

export const FeeCollectionPage: React.FC = () => {
  const { students, payments, recordPayment, deletePayment } = useDataStore();
  const { activeSession, school, showToast, openQuickFee } = useAppStore();
  const { user, can } = useAuthStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01'); // preselected sample student

  // Tabs: 'pending' | 'history' | 'ledger'
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'ledger'>('pending');

  // Selected fee items for collection
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>(['fee_q3_tuition', 'fee_q3_transport']);

  // Sticky Payment Summary state
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [referenceNo, setReferenceNo] = useState('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [lateFine, setLateFine] = useState<number>(150); // Fine per day after grace days
  const [customTransport, setCustomTransport] = useState<number>(0);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [remarks, setRemarks] = useState('');

  // Modals state
  const [receiptModalPayment, setReceiptModalPayment] = useState<Payment | null>(null);
  const [deleteTargetPayment, setDeleteTargetPayment] = useState<Payment | null>(null);

  // Selected student
  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || students[0],
    [students, selectedStudentId]
  );

  // Class list for filters
  const classesList = useMemo(() => {
    const setCls = new Set(students.map((s) => s.class));
    return ['ALL', ...Array.from(setCls)];
  }, [students]);

  // Filtered student search list for dropdown
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.grNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentPhone.includes(searchQuery);

      const matchesClass = selectedClassFilter === 'ALL' || s.class === selectedClassFilter;
      const matchesSection = selectedSectionFilter === 'ALL' || s.section.includes(selectedSectionFilter);

      return matchesSearch && matchesClass && matchesSection;
    });
  }, [students, searchQuery, selectedClassFilter, selectedSectionFilter]);

  // Mock fee structure items for current selected student
  const feeItems: StudentFeeItem[] = useMemo(() => {
    if (!selectedStudent) return [];
    return [
      {
        id: 'fee_q1_tuition',
        feeType: 'Tuition Fee (Q1 Apr-Jun)',
        period: 'Q1 (Apr - Jun)',
        amount: 4500,
        discount: 0,
        paid: 4500,
        balance: 0,
        dueDate: '2027-04-10',
        status: 'Paid',
      },
      {
        id: 'fee_q2_tuition',
        feeType: 'Tuition Fee (Q2 Jul-Sep)',
        period: 'Q2 (Jul - Sep)',
        amount: 4500,
        discount: 500,
        paid: 4000,
        balance: 0,
        dueDate: '2027-07-10',
        status: 'Paid',
      },
      {
        id: 'fee_q3_tuition',
        feeType: 'Tuition Fee (Q3 Oct-Dec)',
        period: 'Q3 (Oct - Dec)',
        amount: 4500,
        discount: 0,
        paid: 2000,
        balance: 2500,
        dueDate: '2027-10-10',
        status: 'Partial',
      },
      {
        id: 'fee_q3_transport',
        feeType: 'School Bus Transport (Zone B)',
        period: 'Oct 2027',
        amount: 1800,
        discount: 0,
        paid: 0,
        balance: 1800,
        dueDate: '2027-10-15',
        status: 'Pending',
      },
      {
        id: 'fee_annual_dev',
        feeType: 'Computer Lab & STEM Robotics Charge',
        period: 'Annual Term',
        amount: 1200,
        discount: 0,
        paid: 0,
        balance: 1200,
        dueDate: '2027-11-10',
        status: 'Pending',
      },
      {
        id: 'fee_q4_tuition',
        feeType: 'Tuition Fee (Q4 Jan-Mar)',
        period: 'Q4 (Jan - Mar)',
        amount: 4500,
        discount: 0,
        paid: 0,
        balance: 4500,
        dueDate: '2028-01-10',
        status: 'Pending',
      },
    ];
  }, [selectedStudent]);

  // Compute selected items total
  const selectedItems = feeItems.filter((f) => selectedFeeIds.includes(f.id));
  const selectedBaseTotal = selectedItems.reduce((acc, curr) => acc + curr.balance, 0);

  // Grand Total calculation
  const grandTotal = Math.max(0, selectedBaseTotal - customDiscount + lateFine + customTransport);

  // Initialize or update amount received when grandTotal changes
  React.useEffect(() => {
    setAmountReceived(grandTotal);
  }, [grandTotal]);

  const balanceOrAdvance = amountReceived - grandTotal;

  // Payments for this student
  const studentPayments = useMemo(() => {
    if (!selectedStudent) return [];
    return payments.filter(
      (p) => !p.isDeleted && (p.studentId === selectedStudent.id || p.grNumber === selectedStudent.grNumber)
    );
  }, [payments, selectedStudent]);

  // Toggle select all fee items
  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFeeIds(feeItems.filter((f) => f.balance > 0).map((f) => f.id));
    } else {
      setSelectedFeeIds([]);
    }
  };

  // Toggle individual fee item
  const handleToggleFeeItem = (id: string) => {
    setSelectedFeeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Perform collection
  const executeCollection = async (andPrintReceipt = false) => {
    if (!selectedStudent) {
      showToast({ message: 'Please select a student first.', type: 'warning' });
      return;
    }
    if (amountReceived <= 0) {
      showToast({ message: 'Amount received must be greater than ₹0.', type: 'warning' });
      return;
    }

    const heads = selectedItems.map((s) => s.feeType);
    if (heads.length === 0) {
      heads.push('Tuition & General Fee Dues');
    }

    // Auto sequential receipt number
    const nextReceiptNum = 9840 + payments.length + 1;
    const sessionSuffix = activeSession.split('_')[1] ? activeSession.split('_')[1].slice(-2) : '27';
    const autoReceiptNo = `RCPT-${sessionSuffix}-${String(nextReceiptNum).slice(-4)}`;

    const newPayment = await recordPayment(
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
        amount: amountReceived,
        mode: paymentMode,
        transactionRef: referenceNo || undefined,
        collectedBy: user?.name || 'Accounts Desk',
        feeHeadsCovered: heads,
        notes: remarks || `Dis: ₹${customDiscount}, Fine: ₹${lateFine}, Mode: ${paymentMode}`,
        discount: customDiscount,
        lateFine: lateFine,
        transportFee: customTransport,
        subtotal: selectedBaseTotal,
        balanceRemaining: Math.max(0, (selectedStudent.totalFeeDue || 0) - amountReceived),
      },
      user?.name || 'Accountant'
    );

    showToast({
      title: 'Fee Collection Recorded',
      message: `Receipt ${newPayment.receiptNo} issued for ${selectedStudent.fullName}.`,
      type: 'success',
    });

    if (andPrintReceipt) {
      setReceiptModalPayment(newPayment);
    }

    // Reset fields
    setRemarks('');
    setReferenceNo('');
  };

  // Share Receipt on WhatsApp directly
  const handleShareWhatsApp = () => {
    if (!selectedStudent) return;
    const latest = studentPayments[0];
    const receiptNo = latest ? latest.receiptNo : 'PROV-RECEIPT';
    const msg = `*FEE PAYMENT RECEIPT ACKNOWLEDGEMENT*\n${school.name}\n\nDear ${selectedStudent.fatherName || 'Parent'},\nWe acknowledge receipt of *${formatINR(amountReceived || 3500)}* for *${selectedStudent.fullName}* (${selectedStudent.class} - ${selectedStudent.section}).\nReceipt No: *${receiptNo}*\nPayment Mode: ${paymentMode}\nPending Balance: *${formatINR(Math.max(0, (selectedStudent.totalFeeDue || 0) - amountReceived))}*\n\nThank you for choosing ${school.name}.\nContact Accounts: ${school.tollFreeSupport || school.phone}`;
    window.open(createWhatsAppUrl(selectedStudent.parentPhone, msg), '_blank');
  };

  // Confirm soft delete
  const handleConfirmDelete = async (reason: string, remark: string) => {
    if (!deleteTargetPayment) return;
    await deletePayment(
      deleteTargetPayment.id,
      reason,
      user?.name || 'Administrator',
      remark,
      user?.role || 'Admin'
    );
    showToast({
      title: 'Payment Soft-Deleted',
      message: `Receipt ${deleteTargetPayment.receiptNo} moved to Fee Deletion Audit Log.`,
      type: 'error',
    });
    setDeleteTargetPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
              Counter POS Desk
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Session: <strong className="text-slate-800">{activeSession.replace('ses_', '')}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fee Collection Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept multi-mode payments, calculate fines & concessions, issue GST-compliant thermal / A5 receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openQuickFee()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Fast POS Mode (F2)"
          >
            <Zap className="w-4 h-4 text-emerald-200 fill-emerald-200" />
            <span>Fast Counter POS (F2)</span>
          </button>
        </div>
      </div>

      {/* ======================= STUDENT SELECTOR BAR ======================= */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input with Instant Dropdown */}
          <div className="md:col-span-6 relative">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Search Student (Name / ADM No / Mobile)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type Aarav, ADM-26, or 98765..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-medium"
              />
            </div>

            {/* Dropdown list if searching */}
            {searchQuery && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 text-center">No student records found.</div>
                ) : (
                  filteredStudents.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(st.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 hover:bg-teal-50/60 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px]">
                          {st.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{st.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {st.admissionNo || st.grNumber} • {st.class} ({st.section})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-rose-600 block">
                          Due: {formatINR(st.totalFeeDue || 0)}
                        </span>
                        <span className="text-[10px] text-slate-400">Ph: {st.parentPhone}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Class Filter */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class Filter</label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:bg-white"
            >
              {classesList.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === 'ALL' ? 'All Classes' : cls}
                </option>
              ))}
            </select>
          </div>

          {/* Direct Select Student Dropdown */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Active Ledger</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-teal-50/50 border border-teal-200 rounded-xl text-xs font-bold text-teal-950 outline-none cursor-pointer focus:bg-white"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.class})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Student Profile Banner */}
        {selectedStudent && (
          <div className="mt-3 p-3.5 bg-gradient-to-r from-teal-50 via-emerald-50 to-white rounded-xl border border-teal-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B5D4B] text-white flex items-center justify-center font-bold text-base shadow-sm">
                {selectedStudent.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-200 text-teal-900">
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-0.5">
                  <span>
                    ADM No: <strong className="font-mono text-slate-800">{selectedStudent.admissionNo || selectedStudent.grNumber}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Class: <strong>{selectedStudent.class} ({selectedStudent.section})</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Father: <strong>{selectedStudent.fatherName}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <strong>+91 {selectedStudent.parentPhone}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Due Balance</span>
                <span className="text-lg font-black text-rose-600">
                  {formatINR(selectedStudent.totalFeeDue || 0)}
                </span>
              </div>
              <div className="border-l border-teal-200/80 pl-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cleared</span>
                <span className="text-lg font-black text-emerald-700">
                  {formatINR(selectedStudent.totalFeePaid || 0)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================= TABS & CONTENT GRID ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tabs & Tables (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative ${
                activeTab === 'pending'
                  ? 'text-[#0B5D4B] border-b-2 border-[#0B5D4B]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending Fees ({feeItems.filter((f) => f.balance > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative ${
                activeTab === 'history'
                  ? 'text-[#0B5D4B] border-b-2 border-[#0B5D4B]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Payment History ({studentPayments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative ${
                activeTab === 'ledger'
                  ? 'text-[#0B5D4B] border-b-2 border-[#0B5D4B]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Full Fee Ledger
            </button>
          </div>

          {/* TAB 1: PENDING FEES TABLE */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Outstanding Fee Heads</h3>
                  <p className="text-[11px] text-slate-500">Select installments to cover in current receipt</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-600 font-semibold flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedFeeIds.length > 0 &&
                        selectedFeeIds.length === feeItems.filter((f) => f.balance > 0).length
                      }
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded text-teal-600 accent-teal-600"
                    />
                    <span>Select All Dues</span>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">Pay</th>
                      <th className="py-3 px-3">Fee Type / Particular</th>
                      <th className="py-3 px-3">Period</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3 text-right">Paid</th>
                      <th className="py-3 px-3 text-right">Balance</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeItems.map((item) => {
                      const isSelected = selectedFeeIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          onClick={() => item.balance > 0 && handleToggleFeeItem(item.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-teal-50/50'
                              : item.balance === 0
                              ? 'bg-slate-50/40 opacity-70 cursor-default'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              disabled={item.balance === 0}
                              checked={isSelected}
                              onChange={() => handleToggleFeeItem(item.id)}
                              className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer disabled:opacity-30"
                            />
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {item.feeType}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              Due: {formatDate(item.dueDate)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{item.period}</td>
                          <td className="py-3 px-3 text-right font-medium text-slate-700">
                            {formatINR(item.amount)}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-emerald-700">
                            {formatINR(item.paid)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-rose-600">
                            {formatINR(item.balance)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'Partial'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Selected <strong className="text-slate-800">{selectedFeeIds.length}</strong> items for settlement
                </span>
                <span className="font-bold text-slate-800">
                  Subtotal: <span className="text-teal-700 font-black">{formatINR(selectedBaseTotal)}</span>
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment History for this Student</h3>
                  <p className="text-[11px] text-slate-500">Previously issued receipt vouchers</p>
                </div>
              </div>

              {studentPayments.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400">
                  No payment vouchers found for this student.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Receipt No</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Mode</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3">Collected By</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-teal-800">{p.receiptNo}</td>
                          <td className="py-2.5 px-3 text-slate-600">{formatDate(p.paidAt)}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                              {p.mode}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">
                            {formatINR(p.amount)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">{p.collectedBy}</td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setReceiptModalPayment(p)}
                                className="p-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                                title="Print / View Receipt"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              {can('delete_fees') && (
                                <button
                                  type="button"
                                  onClick={() => setDeleteTargetPayment(p)}
                                  className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                  title="Soft Delete Payment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FULL FEE LEDGER */}
          {activeTab === 'ledger' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Comprehensive Student Account Ledger</h3>
                  <p className="text-[11px] text-slate-500">Debits, credits and running balances</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Ledger</span>
                </button>
              </div>

              <div className="text-xs space-y-2">
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Opening Dues</span>
                    <p className="font-bold text-slate-800 text-sm">₹0.00</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Invoiced</span>
                    <p className="font-bold text-slate-800 text-sm">{formatINR(38500)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Closing Balance</span>
                    <p className="font-bold text-rose-600 text-sm">
                      {formatINR(selectedStudent?.totalFeeDue || 6500)}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Note: Real-time ledger entries are audited under Rule 14.1 CBSE Affiliation By-Laws.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================== RIGHT COLUMN: STICKY PAYMENT SUMMARY (5 cols) ================== */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-teal-900/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment Counter Summary</h3>
                  <p className="text-[11px] text-slate-500">Calculate totals, adjust fine & receive fee</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                Live Calculator
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Selected Base Total:</span>
                <span className="font-bold text-slate-900">{formatINR(selectedBaseTotal)}</span>
              </div>

              {/* Concession / Discount Input */}
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Concession / Discount:</span>
                <div className="w-28 relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(Number(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-xs text-emerald-700 outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Late Fine Input (auto-calculated from settings, editable) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-slate-600">
                  <span>Late Fee Fine:</span>
                  <span className="text-[10px] text-rose-500 font-bold">(Auto)</span>
                </div>
                <div className="w-28 relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={lateFine}
                    onChange={(e) => setLateFine(Number(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-xs text-rose-600 outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Optional transport fee adjustment */}
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Transport Fee Add-on:</span>
                <div className="w-28 relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={customTransport}
                    onChange={(e) => setCustomTransport(Number(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-xs text-slate-700 outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Grand Total Row */}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 font-black text-sm">
                <span className="text-slate-900">GRAND TOTAL PAYABLE:</span>
                <span className="text-teal-800 text-base">{formatINR(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Mode Pills */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Payment Mode <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['Cash', 'UPI', 'Cheque', 'Bank', 'Card'] as PaymentMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                      paymentMode === mode
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional UTR / Transaction Reference */}
            {paymentMode !== 'Cash' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {paymentMode === 'UPI' ? 'UPI UTR / Reference No' : paymentMode === 'Cheque' ? 'Cheque No & Bank Name' : 'Transaction Reference'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={paymentMode === 'UPI' ? 'e.g. UPI/429810294102' : 'e.g. Cheque #40129 SBI'}
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-teal-500"
                />
              </div>
            )}

            {/* Payment Date & Amount Received */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Received</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min={1}
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(Number(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1.5 bg-teal-50/60 border border-teal-300 rounded-lg text-xs font-black text-teal-900 outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Auto Balance / Advance Display */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                {balanceOrAdvance >= 0 ? 'Advance / Excess Adjustment:' : 'Pending Residual Balance:'}
              </span>
              <span
                className={`font-black ${
                  balanceOrAdvance >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatINR(Math.abs(balanceOrAdvance))}
              </span>
            </div>

            {/* Remarks Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Note</label>
              <input
                type="text"
                placeholder="Optional counter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => executeCollection(true)}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Collect Fee & Print Receipt</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => executeCollection(false)}
                  className="py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Collect Only</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Share Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <FeeReceiptModal
        isOpen={!!receiptModalPayment}
        onClose={() => setReceiptModalPayment(null)}
        payment={receiptModalPayment}
        student={selectedStudent}
      />

      {/* Soft-Delete Payment Modal */}
      <SoftDeleteFeeModal
        isOpen={!!deleteTargetPayment}
        onClose={() => setDeleteTargetPayment(null)}
        payment={deleteTargetPayment}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
