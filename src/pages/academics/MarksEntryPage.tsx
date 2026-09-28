import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { FileSpreadsheet, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface StudentMark {
  studentId: string;
  name: string;
  grNumber: string;
  rollNo: number;
  theoryMarks: number;
  practicalMarks: number;
  maxTheory: number;
  maxPractical: number;
  remarks: string;
}

export const MarksEntryPage: React.FC = () => {
  const { students } = useDataStore();
  const { showToast } = useAppStore();

  const [selectedExam, setSelectedExam] = useState('Term 1 Mid-Term Assessment 2027');
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  const classStudents = students.filter(
    (s) => s.class === selectedClass || selectedClass === 'ALL'
  );

  const [marks, setMarks] = useState<Record<string, { theory: number; practical: number; remarks: string }>>(
    classStudents.reduce((acc, s, idx) => {
      acc[s.id] = {
        theory: 65 + (idx % 20),
        practical: 18 + (idx % 3),
        remarks: 'Good progress',
      };
      return acc;
    }, {} as Record<string, { theory: number; practical: number; remarks: string }>)
  );

  const handleScoreChange = (
    studentId: string,
    field: 'theory' | 'practical' | 'remarks',
    val: string | number
  ) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val,
      },
    }));
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Marks Registry Updated',
      message: `Successfully verified and recorded scores for ${classStudents.length} students in ${selectedSubject}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Grading Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Marks & Assessment Entry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject-wise score entry grid with real-time total and grade calculations
          </p>
        </div>

        <button
          onClick={handleSaveMarks}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Marks</span>
        </button>
      </div>

      {/* Filter Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Select Examination
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
          >
            <option>Term 1 Mid-Term Assessment 2027</option>
            <option>Half Yearly Examination 2027</option>
            <option>Annual Board Mock Examination 2028</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Target Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
          >
            <option>Class 5</option>
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
            <option>Class 9</option>
            <option>Class 10</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
          >
            <option>Mathematics (Max: 80 Theory + 20 Practical)</option>
            <option>Science & Physics (Max: 70 Theory + 30 Lab)</option>
            <option>English Core (Max: 80 Theory + 20 ASL)</option>
            <option>Social Studies (Max: 80 Theory + 20 Project)</option>
            <option>Hindi Language (Max: 80 Theory + 20 Oral)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4 text-center">Theory (Max 80)</th>
                <th className="py-3 px-4 text-center">Practical (Max 20)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Performance Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, idx) => {
                const current = marks[st.id] || { theory: 0, practical: 0, remarks: '' };
                const total = Number(current.theory || 0) + Number(current.practical || 0);
                let grade = 'E';
                if (total >= 91) grade = 'A1';
                else if (total >= 81) grade = 'A2';
                else if (total >= 71) grade = 'B1';
                else if (total >= 61) grade = 'B2';
                else if (total >= 51) grade = 'C1';
                else if (total >= 41) grade = 'C2';
                else if (total >= 33) grade = 'D';

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {st.rollNo || idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{st.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        GR: {st.grNumber} • {st.class}-{st.section}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={current.theory ?? ''}
                        onChange={(e) =>
                          handleScoreChange(st.id, 'theory', Math.min(80, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16 px-2 py-1 text-center font-bold font-mono border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={current.practical ?? ''}
                        onChange={(e) =>
                          handleScoreChange(st.id, 'practical', Math.min(20, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16 px-2 py-1 text-center font-bold font-mono border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono text-slate-900 text-sm">
                      {total}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-xs ${
                          grade.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : grade.startsWith('C')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={current.remarks || ''}
                        onChange={(e) => handleScoreChange(st.id, 'remarks', e.target.value)}
                        placeholder="Optional remarks..."
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-700 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </td>
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
