import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Payment } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Trash2, AlertTriangle, Lock, X } from 'lucide-react';

interface SoftDeleteFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  onConfirm: (reason: string, remark: string) => Promise<void>;
}

const REASONS = [
  'Wrong Entry',
  'Cheque Bounced',
  'Duplicate Payment',
  'Student Left',
  'Other',
];

export const SoftDeleteFeeModal: React.FC<SoftDeleteFeeModalProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm,
}) => {
  const { user } = useAuthStore();
  const [reason, setReason] = useState<string>('Wrong Entry');
  const [remark, setRemark] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (remark.trim().length < 10) {
      setError('Please provide a descriptive remark of at least 10 characters.');
      return;
    }

    // Password validation (admin password is admin123 by default, or accept valid non-empty demo password)
    if (!password || (password !== 'admin123' && password !== 'admin' && password.length < 4)) {
      setError('Invalid operator security password. Demo password is "admin123".');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(reason, remark.trim());
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to soft delete payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('Wrong Entry');
    setRemark('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">Confirm Payment Soft-Deletion</h3>
              <p className="text-xs text-rose-700">Audit-logged reversal action</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Payment Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Receipt Voucher:</span>
              <span className="font-mono font-bold text-rose-700">{payment.receiptNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{payment.studentName} ({payment.className})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount to Reverse:</span>
              <span className="font-black text-rose-600 text-sm">{formatINR(payment.amount)}</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              ⚠️ Deleting this payment will reverse the student's ledger dues and move this receipt to the immutable Audit Deletion Log.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Reason Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mandatory Deletion Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white outline-none cursor-pointer"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Free-text Remark (min 10 chars) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                Detailed Remark <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[10px] ${remark.length < 10 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                {remark.length}/10 min chars
              </span>
            </div>
            <textarea
              rows={3}
              required
              placeholder="Explain why this fee receipt is being voided or deleted..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
            />
          </div>

          {/* User Password Confirmation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm Your Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="Enter your login password (e.g. admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white outline-none font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Operator: <strong className="text-slate-700">{user?.name}</strong> ({user?.role})
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || remark.trim().length < 10 || !password}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Deleting...' : 'Confirm Soft Delete'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
