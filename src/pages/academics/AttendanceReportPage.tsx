import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { ClipboardList, Download, Printer } from 'lucide-react';

export const AttendanceReportPage: React.FC = () => {
  const { students } = useDataStore();
  const { showToast } = useAppStore();
  const [selectedMonth, setSelectedMonth] = useState('October 2027');
  const [selectedClass, setSelectedClass] = useState('Class 5');

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Monthly Attendance Grid</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Student-wise attendance matrix and percentage statistics for {selectedMonth}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast({ message: 'Exporting attendance sheet to Excel...', type: 'info' })}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center gap-3 flex-wrap">
        <select
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none cursor-pointer"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="UKG">UKG</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 10">Class 10</option>
        </select>

        <select
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none cursor-pointer"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="October 2027">October 2027</option>
          <option value="September 2027">September 2027</option>
          <option value="August 2027">August 2027</option>
        </select>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 text-left w-36">Student</th>
                {days.slice(0, 15).map((d) => (
                  <th key={d} className="p-1 w-6">{d}</th>
                ))}
                <th className="py-2.5 px-2">Present</th>
                <th className="py-2.5 px-2">Absent</th>
                <th className="py-2.5 px-2 font-bold text-emerald-800">% Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.slice(0, 5).map((st, sIdx) => {
                const presentCount = 13 + (sIdx % 3);
                const absentCount = 15 - presentCount;
                const pct = ((presentCount / 15) * 100).toFixed(1);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-left font-bold text-slate-900 truncate">
                      {st.fullName}
                    </td>
                    {days.slice(0, 15).map((d) => {
                      const isAbsent = d === 5 || d === 12;
                      return (
                        <td key={d} className="p-1">
                          <span
                            className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                              isAbsent ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isAbsent ? 'A' : 'P'}
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-2 font-bold text-emerald-700">{presentCount}</td>
                    <td className="py-2.5 px-2 font-bold text-rose-600">{absentCount}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-900 tabular-nums">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
