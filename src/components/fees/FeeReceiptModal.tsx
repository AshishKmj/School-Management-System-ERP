import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { formatINR, formatDate, formatDateTime, numberToWordsIndian, createWhatsAppUrl } from '../../utils/formatters';
import { Payment } from '../../types';
import {
  Printer,
  Download,
  Share2,
  X,
  CheckCircle2,
  FileText,
  Receipt as ReceiptIcon,
  MessageSquare,
  QrCode,
  Building,
} from 'lucide-react';

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  student?: {
    admissionNo?: string;
    grNumber?: string;
    rollNo?: string;
    fullName: string;
    fatherName?: string;
    class: string;
    section: string;
    parentPhone: string;
    totalFeeDue?: number;
  } | null;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  student,
}) => {
  const { school } = useAppStore();
  const [printFormat, setPrintFormat] = useState<'A5' | 'Thermal'>('A5');

  if (!isOpen || !payment) return null;

  const studentName = payment.studentName || student?.fullName || 'Student';
  const admissionNo = payment.admissionNo || student?.admissionNo || payment.grNumber || 'ADM-26-0000';
  const rollNo = payment.rollNo || student?.rollNo || '01';
  const fatherName = payment.fatherName || student?.fatherName || 'Guardian';
  const className = payment.className || student?.class || '-';
  const section = payment.section || student?.section || '-';
  const parentPhone = student?.parentPhone || '9876543210';
  const balanceRemaining = payment.balanceRemaining !== undefined ? payment.balanceRemaining : (student?.totalFeeDue || 0);

  const amountInWords = numberToWordsIndian(payment.amount);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const msg = `*FEE RECEIPT ACKNOWLEDGEMENT*\n${school.name}\n\nDear Parent,\nWe have received fee payment of *${formatINR(payment.amount)}* for *${studentName}* (${className} - ${section}).\nReceipt No: *${payment.receiptNo}*\nDate: ${formatDate(payment.paidAt)}\nPayment Mode: ${payment.mode} ${payment.transactionRef ? `(${payment.transactionRef})` : ''}\nBalance Remaining: ${formatINR(balanceRemaining)}\n\nThank you,\nAccounts Department, ${school.name}\nContact: ${school.tollFreeSupport || school.phone}`;
    window.open(createWhatsAppUrl(parentPhone, msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      {/* Container Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Modal Controls Topbar (hidden in print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <ReceiptIcon className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Fee Receipt Voucher</h3>
              <p className="text-[11px] text-slate-400">
                Receipt {payment.receiptNo} • {formatDate(payment.paidAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle: A5 vs Thermal 80mm */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPrintFormat('A5')}
                className={`px-3 py-1 rounded-md transition-all ${
                  printFormat === 'A5' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                A5 Standard
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('Thermal')}
                className={`px-3 py-1 rounded-md transition-all ${
                  printFormat === 'Thermal' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Thermal 80mm
              </button>
            </div>

            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Share receipt via WhatsApp to parent"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== RECEIPT BODY ===================== */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-2 bg-slate-50/50 print:bg-white">
          {printFormat === 'A5' ? (
            /* ------------------ A5 FORMAT ------------------ */
            <div
              id="printable-receipt-a5"
              className="bg-white border-2 border-slate-300 rounded-xl p-6 sm:p-8 space-y-5 text-slate-900 shadow-sm print:shadow-none print:border print:border-slate-800 print:rounded-none"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-[#0B5D4B] pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi-974d7W-4N2BFQiVhZ9V3wHkblJHeiHgorFPdc45KQBRaZpQGmWGQPt9JQzAyGYAG8Zkb4ZkUUAQd_FeFMcBZCB96KN7sVZs1HHGFsPT3fm6QTd1gT66CuAZrGcqbSusf0b5QCYappZtvZ_k_i2HUymY_RJJ2-EatQllgHhWOChqu8wyOK1k36oXPfd6ydlVxOCgstzuBhp6RSLK6EqNLK6mi6v2PneeiiFB_rHbCff3VL1BQN_ZzA"
                    alt={school.name}
                    className="w-14 h-14 object-contain shrink-0"
                  />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B5D4B] tracking-tight uppercase">
                      {school.name}
                    </h2>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {school.boardAffiliation} • School Code: {school.code}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {school.address} • Ph: {school.phone} • Email: {school.email}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-3 py-1 bg-[#0B5D4B] text-white text-xs font-black uppercase tracking-wider rounded">
                    FEE RECEIPT
                  </span>
                  <div className="mt-2 text-right">
                    <p className="text-xs font-bold text-slate-800">
                      Receipt #: <span className="font-mono text-[#0B5D4B]">{payment.receiptNo}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Date: {formatDateTime(payment.paidAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Metadata Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Admission / GR No</span>
                  <span className="font-mono font-bold text-slate-800">{admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Class & Section</span>
                  <span className="font-bold text-slate-800">
                    {className} ({section})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Father's Name</span>
                  <span className="font-medium text-slate-800">{fatherName}</span>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B5D4B]/10 text-[#0B5D4B] font-bold uppercase text-[10px] border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3">Particulars / Fee Head</th>
                      <th className="py-2.5 px-3 text-right">Gross (₹)</th>
                      <th className="py-2.5 px-3 text-right">Concession (₹)</th>
                      <th className="py-2.5 px-3 text-right">Net Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {payment.feeHeadsCovered && payment.feeHeadsCovered.length > 0 ? (
                      payment.feeHeadsCovered.map((head, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-slate-800">{head}</td>
                          <td className="py-2 px-3 text-right tabular-nums text-slate-600">
                            {formatINR(payment.amount / payment.feeHeadsCovered.length, false)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-slate-400">0.00</td>
                          <td className="py-2 px-3 text-right tabular-nums font-bold text-slate-900">
                            {formatINR(payment.amount / payment.feeHeadsCovered.length, false)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">1</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">Tuition & Term Dues</td>
                        <td className="py-2 px-3 text-right tabular-nums text-slate-600">
                          {formatINR(payment.amount, false)}
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums text-slate-400">0.00</td>
                        <td className="py-2 px-3 text-right tabular-nums font-bold text-slate-900">
                          {formatINR(payment.amount, false)}
                        </td>
                      </tr>
                    )}

                    {payment.lateFine ? (
                      <tr>
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">2</td>
                        <td className="py-2 px-3 font-semibold text-rose-700">Late Fee Surcharge</td>
                        <td className="py-2 px-3 text-right tabular-nums text-rose-600">
                          {formatINR(payment.lateFine, false)}
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums text-slate-400">0.00</td>
                        <td className="py-2 px-3 text-right tabular-nums font-bold text-rose-700">
                          {formatINR(payment.lateFine, false)}
                        </td>
                      </tr>
                    ) : null}

                    {/* Total Row */}
                    <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                      <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-[11px] text-slate-700">
                        Total Amount Received:
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm text-[#0B5D4B] font-black tabular-nums">
                        {formatINR(payment.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amount in words & payment details */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                      Amount In Words:
                    </span>
                    <span className="font-bold text-slate-900 italic capitalize">{amountInWords}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Payment Mode</span>
                    <span className="font-bold text-slate-900">
                      {payment.mode}{' '}
                      {payment.transactionRef && (
                        <span className="font-mono text-slate-600 text-[11px]">
                          ({payment.transactionRef})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-emerald-200/80 pt-1.5 text-[11px] text-slate-600">
                  <span>
                    Balance Dues After this Payment:{' '}
                    <strong className={balanceRemaining > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                      {formatINR(balanceRemaining)}
                    </strong>
                  </span>
                  <span>
                    Collected By: <strong className="text-slate-800">{payment.collectedBy}</strong>
                  </span>
                </div>
              </div>

              {/* Footer Terms & Signatures */}
              <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-xs">
                <div className="max-w-md text-[10px] text-slate-500 space-y-0.5 leading-relaxed">
                  <p className="font-bold text-slate-700 uppercase">Terms & Conditions:</p>
                  <p>1. Fees once deposited are non-refundable and non-transferable under any circumstances.</p>
                  <p>2. Cheque payments are accepted subject to actual realization in school bank account.</p>
                  <p>3. This is an official computer-generated receipt valid for tax exemption u/s 10(23C) / 80C.</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-36 h-12 border-b-2 border-slate-400 flex items-end justify-center pb-1 text-[11px] font-serif text-slate-400 italic">
                    [Authorized Stamp]
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Cashier / Accounts Officer
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ------------------ THERMAL 80MM FORMAT ------------------ */
            <div
              id="printable-receipt-thermal"
              className="w-full max-w-[340px] mx-auto bg-white border border-slate-300 p-4 font-mono text-xs text-slate-900 space-y-3 shadow-sm print:border-none print:shadow-none print:w-full"
            >
              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-400">
                <h3 className="font-black text-sm uppercase tracking-wider">{school.name}</h3>
                <p className="text-[10px] text-slate-600">{school.boardAffiliation}</p>
                <p className="text-[10px] text-slate-500">Ph: {school.phone}</p>
                <p className="text-[10px] font-bold uppercase mt-1">=== FEE RECEIPT ===</p>
              </div>

              <div className="text-[11px] space-y-0.5">
                <div className="flex justify-between">
                  <span>Rcpt No:</span>
                  <span className="font-bold">{payment.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(payment.paidAt)} {new Date(payment.paidAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>ADM No:</span>
                  <span className="font-bold">{admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Student:</span>
                  <span className="font-bold truncate max-w-[180px]">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class:</span>
                  <span>{className} - {section}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1 text-[11px]">
                {payment.feeHeadsCovered && payment.feeHeadsCovered.length > 0 ? (
                  payment.feeHeadsCovered.map((head, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate max-w-[200px]">{head}</span>
                      <span className="font-bold">{formatINR(payment.amount / payment.feeHeadsCovered.length, false)}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between">
                    <span>Tuition Fee Dues</span>
                    <span className="font-bold">{formatINR(payment.amount, false)}</span>
                  </div>
                )}
                {payment.lateFine ? (
                  <div className="flex justify-between text-rose-600">
                    <span>Late Fine</span>
                    <span>{formatINR(payment.lateFine, false)}</span>
                  </div>
                ) : null}
              </div>

              <div className="text-[11px] space-y-1">
                <div className="flex justify-between text-sm font-black">
                  <span>TOTAL PAID:</span>
                  <span>{formatINR(payment.amount)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Mode:</span>
                  <span>{payment.mode} {payment.transactionRef ? `(${payment.transactionRef})` : ''}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Remaining Due:</span>
                  <span className="font-bold">{formatINR(balanceRemaining)}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-400 text-[10px] space-y-0.5 text-slate-500">
                <p className="capitalize italic">{amountInWords}</p>
                <p className="mt-2 font-bold text-slate-700">Thank you for prompt payment!</p>
                <p>Cashier: {payment.collectedBy}</p>
                <p className="text-[9px]">*** Computer Generated Receipt ***</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
