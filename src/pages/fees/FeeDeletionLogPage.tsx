import React, { useState, useMemo } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import { FeeDeletionLog } from '../../types';
import {
  ShieldAlert,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Download,
  Printer,
  Search,
  Filter,
  Lock,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const FeeDeletionLogPage: React.FC = () => {
  const { feeDeletionLogs, restorePayment } = useDataStore();
  const { showToast, activeSession } = useAppStore();
  const { user } = useAuthStore();

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'super_admin';

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Deleted' | 'Restored'>('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');

  // Restore Modal State
  const [targetLog, setTargetLog] = useState<FeeDeletionLog | null>(null);
  const [restoreReason, setRestoreReason] = useState('Administrative verification complete');
  const [isRestoring, setIsRestoring] = useState(false);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return feeDeletionLogs.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.deletedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.admissionNo && log.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'Restored'
          ? log.isRestored
          : !log.isRestored;

      const matchesReason = reasonFilter === 'ALL' ? true : log.reason === reasonFilter;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [feeDeletionLogs, searchQuery, statusFilter, reasonFilter]);

  // KPI Calculations
  const totalDeletedAmount = useMemo(() => {
    return feeDeletionLogs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [feeDeletionLogs]);

  const totalDeletedReceipts = feeDeletionLogs.length;

  const restoredCount = useMemo(() => {
    return feeDeletionLogs.filter((l) => l.isRestored).length;
  }, [feeDeletionLogs]);

  const topReasonBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    feeDeletionLogs.forEach((l) => {
      counts[l.reason] = (counts[l.reason] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]})` : 'None';
  }, [feeDeletionLogs]);

  // Handle Restore
  const handleConfirmRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLog) return;
    try {
      setIsRestoring(true);
      await restorePayment(targetLog.id, user?.name || 'Super Admin', restoreReason);
      showToast({
        title: 'Payment Restored Successfully',
        message: `Receipt ${targetLog.receiptNo} has been restored and student balance updated.`,
        type: 'success',
      });
      setTargetLog(null);
    } catch (err: any) {
      showToast({ message: err?.message || 'Restore failed', type: 'error' });
    } finally {
      setIsRestoring(false);
    }
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const headers = [
      'Deletion ID',
      'Receipt No',
      'Student Name',
      'Admission No',
      'Class',
      'Amount',
      'Deleted By',
      'Role',
      'Deleted At',
      'Reason',
      'Remark',
      'Status',
    ];

    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.receiptNo}"`,
      `"${l.studentName}"`,
      `"${l.admissionNo || '-'}"`,
      `"${l.className || '-'}"`,
      l.amount,
      `"${l.deletedBy}"`,
      `"${l.deletedByRole || 'Admin'}"`,
      `"${formatDateTime(l.deletedAt)}"`,
      `"${l.reason}"`,
      `"${(l.remark || '').replace(/"/g, '""')}"`,
      `"${l.isRestored ? 'Restored' : 'Deleted'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Deletion_Audit_Log_${activeSession}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      title: 'Audit Log Exported',
      message: 'Exported fee deletion audit trail to CSV/Excel.',
      type: 'success',
    });
  };

  // If user is neither admin nor super_admin, display access-denied view
  if (!isAdminOrSuper) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Restricted Audit Section</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Access to the Fee Deletion Audit Log is strictly restricted to School Administrators and Super Administrators. Please sign in with an elevated administrative role to review or restore voided payments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              Immutable Audit Ledger
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Session: <strong className="text-slate-800">{activeSession.replace('ses_', '')}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fee Deletion Audit Log</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed journal of soft-deleted payments, operator explanations, and rollback authority
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Deleted Amount</span>
          <p className="text-2xl font-black text-rose-600 mt-1.5">{formatINR(totalDeletedAmount)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across this session</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase text-slate-400">Deleted Receipts</span>
          <p className="text-2xl font-black text-slate-900 mt-1.5">{totalDeletedReceipts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Voided transactions</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase text-slate-400">Restored Receipts</span>
          <p className="text-2xl font-black text-emerald-700 mt-1.5">{restoredCount}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Rolled back to ledger</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase text-slate-400">Top Reason Breakdown</span>
          <p className="text-sm font-black text-slate-900 mt-2 truncate" title={topReasonBreakdown}>
            {topReasonBreakdown}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Most common deletion cause</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt, student, user..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="text-slate-400 text-[11px] uppercase font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Deleted">Active Deleted</option>
              <option value="Restored">Restored</option>
            </select>
          </div>

          {/* Reason filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="text-slate-400 text-[11px] uppercase font-bold">Reason:</span>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            >
              <option value="ALL">All Reasons</option>
              <option value="Wrong Entry">Wrong Entry</option>
              <option value="Cheque Bounced">Cheque Bounced</option>
              <option value="Duplicate Payment">Duplicate Payment</option>
              <option value="Student Left">Student Left</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredLogs.length}</strong> audited events
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <span className="font-bold text-slate-800 text-sm block">No Matching Deletion Records</span>
            No payment deletions found matching the active filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Receipt No</th>
                  <th className="py-3 px-3">Student & Class</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Deleted By</th>
                  <th className="py-3 px-3">Deleted At</th>
                  <th className="py-3 px-3">Reason & Remark</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-rose-700">{log.receiptNo}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{log.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {log.admissionNo || log.grNumber} • {log.className || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums">
                      {formatINR(log.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 block">{log.deletedBy}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{log.deletedByRole || 'Admin'}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {formatDateTime(log.deletedAt)}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px] block w-fit mb-0.5">
                        {log.reason}
                      </span>
                      {log.remark ? (
                        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 italic">
                          "{log.remark}"
                        </p>
                      ) : null}
                      {log.isRestored && log.restoreReason && (
                        <p className="text-[10px] text-emerald-700 mt-1 font-semibold">
                          Restored by {log.restoredBy}: {log.restoreReason}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.isRestored
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.isRestored ? 'Restored' : 'Deleted'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {log.canRestore && !log.isRestored ? (
                        isSuperAdmin ? (
                          <button
                            type="button"
                            onClick={() => setTargetLog(log)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors"
                            title="Restore payment to student ledger"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        ) : (
                          <span
                            className="text-[10px] text-slate-400 font-semibold italic cursor-help"
                            title="Only Super Administrator can execute rollback"
                          >
                            Super Admin Only
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Restored
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal (Super Admin only) */}
      {targetLog && (
        <Modal
          isOpen={!!targetLog}
          onClose={() => setTargetLog(null)}
          title="Restore Soft-Deleted Fee Payment"
          subtitle={`Roll back receipt ${targetLog.receiptNo} into active ledgers`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmRestore} className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-emerald-800 font-medium">Receipt Voucher:</span>
                <span className="font-mono font-bold text-emerald-950">{targetLog.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900">{targetLog.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800 font-medium">Amount to Re-apply:</span>
                <span className="font-black text-emerald-800">{formatINR(targetLog.amount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mandatory Restoration Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={restoreReason}
                onChange={(e) => setRestoreReason(e.target.value)}
                placeholder="State reason for restoring this payment..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              * Rolling back will automatically mark the payment as active, reduce the student's pending dues by{' '}
              <strong>{formatINR(targetLog.amount)}</strong>, and log this audit action with timestamp.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTargetLog(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRestoring || !restoreReason.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRestoring ? 'Restoring...' : 'Confirm Rollback & Restore'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
