import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR, formatDate } from '../../utils/formatters';
import { BarChart3, Download, Printer, Filter, Calendar, Users, AlertCircle } from 'lucide-react';

export const FinanceReportsPage: React.FC = () => {
  const { payments, students, expenses } = useDataStore();
  const { showToast, school } = useAppStore();

  const [activeTab, setActiveTab] = useState<'collection' | 'dues' | 'defaulters' | 'expenses'>('collection');
  const [dateRange, setDateRange] = useState({
    from: '2027-10-01',
    to: '2027-10-31',
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const defaulters = students.filter((s) => (s.totalFeeDue || 0) > 0);
  const totalDues = defaulters.reduce((sum, s) => sum + (s.totalFeeDue || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Auditorium Financials
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Finance Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade summaries, daily collection logs, class-wise receivables, and defaulter rosters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => showToast({ message: 'Generating fiscal Excel workbook with macros...', type: 'info' })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'collection', label: 'Daily Collection Log' },
          { id: 'defaulters', label: `Defaulters Roster (${defaulters.length})` },
          { id: 'expenses', label: 'Outflow Breakdown' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {activeTab === 'collection' && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Total Recorded Inflows: <strong className="text-emerald-700 font-mono text-sm">{formatINR(totalCollected)}</strong>
            </span>
            <span className="text-xs text-slate-500 font-medium">{payments.length} Transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Collected By</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{p.receiptNo}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatDate(p.paidAt)}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.studentName}</td>
                    <td className="py-3 px-4 text-slate-600">{p.className}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {p.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.collectedBy}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatINR(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'defaulters' && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">
              Outstanding Dues: <strong className="text-rose-700 font-mono text-sm">{formatINR(totalDues)}</strong>
            </span>
            <span className="text-xs text-rose-600 font-semibold">{defaulters.length} Unresolved Ledgers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">GR No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4 text-right">Pending Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaulters.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{s.grNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{s.class} ({s.section})</td>
                    <td className="py-3 px-4 text-slate-600">{s.fatherName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{s.parentPhone}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {formatINR(s.totalFeeDue || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="p-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900">
              Total Operating Expenses: <strong className="text-purple-700 font-mono text-sm">{formatINR(totalExpenses)}</strong>
            </span>
            <span className="text-xs text-purple-600 font-semibold">{expenses.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Expense Head</th>
                  <th className="py-3 px-4">Paid To</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{formatDate(e.expenseDate)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[11px] font-semibold">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{e.title}</td>
                    <td className="py-3 px-4 text-slate-600">{e.paidTo}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-purple-700">
                      {formatINR(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
