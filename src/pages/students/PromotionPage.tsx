import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR } from '../../utils/formatters';
import { ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PromotionPage: React.FC = () => {
  const { students } = useDataStore();
  const { activeSession, showToast } = useAppStore();

  const [fromClass, setFromClass] = useState('UKG');
  const [toClass, setToClass] = useState('Class 1');
  const [targetSession, setTargetSession] = useState('2028-29');
  const [carryForwardDues, setCarryForwardDues] = useState(true);
  const [promoteAllPassed, setPromoteAllPassed] = useState(true);
  const [isPromoting, setIsPromoting] = useState(false);

  const eligibleStudents = students.filter((s) => s.class === fromClass);

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (eligibleStudents.length === 0) {
      showToast({ message: `No active students found in ${fromClass}.`, type: 'warning' });
      return;
    }

    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      showToast({
        title: 'Promotion Completed',
        message: `Successfully promoted ${eligibleStudents.length} students from ${fromClass} to ${toClass} for Session ${targetSession}.`,
        type: 'success',
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bulk Student Promotion</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Year-end academic progression wizard with fee dues carry-forward into next session
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Promotion Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configure Promotion Rule</h3>
              <p className="text-[11px] text-slate-500">Select source class and destination cohort</p>
            </div>
          </div>

          <form onSubmit={handlePromote} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Class (Current)</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white outline-none cursor-pointer"
                value={fromClass}
                onChange={(e) => setFromClass(e.target.value)}
              >
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
                Promote Into (Next Standard)
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white outline-none cursor-pointer"
                value={toClass}
                onChange={(e) => setToClass(e.target.value)}
              >
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11-Sci">Class 11 (Science)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Academic Session
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
                value={targetSession}
                onChange={(e) => setTargetSession(e.target.value)}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5 pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={carryForwardDues}
                  onChange={(e) => setCarryForwardDues(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#0B5D4B] accent-[#0B5D4B]"
                />
                <div>
                  <span className="font-semibold text-slate-900">Carry Forward Outstanding Fee Dues</span>
                  <p className="text-[11px] text-slate-500">
                    Existing arrears will be added to the new session's opening ledger balance.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={promoteAllPassed}
                  onChange={(e) => setPromoteAllPassed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#0B5D4B] accent-[#0B5D4B]"
                />
                <div>
                  <span className="font-semibold text-slate-900">Promote All Eligible Students</span>
                  <p className="text-[11px] text-slate-500">
                    Marksheet clearance verified by Exam Committee.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPromoting}
              className="w-full py-2.5 bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{isPromoting ? 'Processing Promotion...' : `Promote ${fromClass} to ${toClass}`}</span>
            </button>
          </form>
        </div>

        {/* Student Preview List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Eligible Cohort ({eligibleStudents.length} Students)
              </h3>
              <p className="text-xs text-slate-500">Students enrolled in {fromClass}</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Session {activeSession}
            </span>
          </div>

          {eligibleStudents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No students found in {fromClass} for current session.
            </div>
          ) : (
            <div className="space-y-2">
              {eligibleStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                      {st.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{st.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {st.grNumber} • Adm: {st.admissionNo}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 block">
                      Target: {toClass}
                    </span>
                    {st.totalFeeDue ? (
                      <span className="text-[11px] text-rose-600 font-bold">
                        Arrear: {formatINR(st.totalFeeDue)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold">Zero Dues</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
