import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import { formatINR } from '../../utils/formatters';
import { FileSpreadsheet, Download, CheckCircle, TrendingUp, Users, Award, Percent } from 'lucide-react';

export const SessionReportPage: React.FC = () => {
  const { activeSession, school, showToast } = useAppStore();
  const { students, payments, expenses } = useDataStore();

  const totalFeeCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
              Annual Audit Report
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Session Report</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic institutional summary for Session {activeSession} • Delhi Public Academy
          </p>
        </div>

        <button
          onClick={() => showToast({ message: 'Generating comprehensive Session Dossier (PDF)...', type: 'info' })}
          className="px-4 py-2 rounded-xl bg-[#0B5D4B] hover:bg-[#073B30] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Download Session Dossier</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-950/5 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Enrolled Pupils</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">1,842</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">98.2% Retention Rate</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-950/5 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Gross Collections</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{formatINR(totalFeeCollected || 2485500)}</div>
          <span className="text-xs text-slate-500 mt-1 block">82.8% Target Realized</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-950/5 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Operational Expenses</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatINR(totalExp || 642180)}</div>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">Well Within Budget</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-950/5 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Board Exam Result</span>
          <div className="text-2xl font-bold text-purple-700 mt-1">99.4%</div>
          <span className="text-xs text-purple-600 font-semibold mt-1 block">74 Centum Marks in 2026</span>
        </div>
      </div>

      {/* Session Progress Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Session Breakdown by Class Tiers</h3>
        <div className="space-y-3 text-xs">
          {[
            { tier: 'Primary Section (Nursery - Class 2)', students: '420 Pupils', feeRatio: '92%', status: 'Nominal' },
            { tier: 'Middle School (Class 3 - Class 8)', students: '680 Pupils', feeRatio: '86%', status: 'Nominal' },
            { tier: 'Secondary Block (Class 9 - Class 10)', students: '442 Pupils', feeRatio: '84%', status: 'Follow-up Due' },
            { tier: 'Senior Secondary (Class 11 - Class 12)', students: '300 Pupils', feeRatio: '95%', status: 'Exceptional' },
          ].map((item) => (
            <div
              key={item.tier}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900">{item.tier}</span>
                <span className="text-slate-500 ml-2">({item.students})</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-emerald-800">Fee Recovery: {item.feeRatio}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
