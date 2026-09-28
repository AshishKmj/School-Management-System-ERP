import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CalendarCheck, Save, Users, Check, X, Clock } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { students } = useDataStore();
  const { showToast } = useAppStore();
  const { user } = useAuthStore();

  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedSection, setSelectedSection] = useState('Section A (Rose)');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const classStudents = students.filter(
    (s) => s.class === selectedClass || selectedClass === 'ALL'
  );

  const [attendance, setAttendance] = useState<Record<string, 'P' | 'A' | 'L'>>({});

  const handleMarkAll = (status: 'P' | 'A' | 'L') => {
    const updated: Record<string, 'P' | 'A' | 'L'> = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendance(updated);
  };

  const toggleStudent = (id: string, current: 'P' | 'A' | 'L') => {
    const next: 'P' | 'A' | 'L' = current === 'P' ? 'A' : current === 'A' ? 'L' : 'P';
    setAttendance((prev) => ({ ...prev, [id]: next }));
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Attendance Saved & Dispatched',
      message: `Daily biometric roll saved for ${classStudents.length} students. SMS dispatched for absentees.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Student Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark daily morning roll call and trigger automated SMS alerts to parents of absentees
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll('P')}
            className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-colors"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date
          </label>
          <input
            type="date"
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Class
          </label>
          <select
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none cursor-pointer"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
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
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Section
          </label>
          <select
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none cursor-pointer"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="Section A (Rose)">Section A (Rose)</option>
            <option value="Section B (Lotus)">Section B (Lotus)</option>
          </select>
        </div>
      </div>

      {/* Student Attendance List */}
      <form onSubmit={handleSaveAttendance} className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Roll</th>
                <th className="py-3 px-4">Student Name & GR</th>
                <th className="py-3 px-4">Parent Phone</th>
                <th className="py-3 px-4 text-center">Status (Click to Toggle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {classStudents.map((st, idx) => {
                const currentStatus = attendance[st.id] || 'P';
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{st.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{st.grNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">+91 {st.parentPhone}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStudent(st.id, currentStatus)}
                        className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-xs transition-all ${
                          currentStatus === 'P'
                            ? 'bg-emerald-600 text-white'
                            : currentStatus === 'A'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {currentStatus === 'P' ? 'Present (P)' : currentStatus === 'A' ? 'Absent (A)' : 'Late (L)'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total Class Strength: {classStudents.length} pupils
          </span>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save & Dispatch Attendance</span>
          </button>
        </div>
      </form>
    </div>
  );
};
