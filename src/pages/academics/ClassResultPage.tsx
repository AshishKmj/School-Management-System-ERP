import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { Award, Printer, Download, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const ClassResultPage: React.FC = () => {
  const { students } = useDataStore();
  const { school, showToast } = useAppStore();

  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedExam, setSelectedExam] = useState('Term 1 Assessment 2027');
  const [reportStudent, setReportStudent] = useState<(typeof students)[0] | null>(null);

  const classStudents = students.filter((s) => s.class === selectedClass);

  // Compute dummy scores with ranks
  const results = classStudents.map((st, idx) => {
    const totalMarks = 430 - idx * 12;
    const percentage = Number(((totalMarks / 500) * 100).toFixed(1));
    const grade = percentage >= 90 ? 'A1' : percentage >= 80 ? 'A2' : percentage >= 70 ? 'B1' : 'B2';
    return {
      student: st,
      totalMarks,
      percentage,
      rank: idx + 1,
      grade,
      status: percentage >= 33 ? 'Passed' : 'Needs Improvement',
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
              CBSE Grading Standard
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Class Academic Results</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated marks sheet, rank determination, and official printable report cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ledger</span>
          </button>
          <button
            onClick={() => showToast({ message: 'Exporting Tabulation Register to Excel...', type: 'info' })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Gazette</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Academic Examination
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
          >
            <option>Term 1 Assessment 2027</option>
            <option>Half Yearly Examination 2027</option>
            <option>Annual Final Examination 2028</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
          >
            <option>Class 5</option>
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
            <option>Class 9</option>
            <option>Class 10</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4 text-center">Grand Total (500)</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Result</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((res) => (
                <tr key={res.student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        res.rank === 1
                          ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                          : res.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : res.rank === 3
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {res.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{res.student.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">GR: {res.student.grNumber}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{res.student.rollNo || '-'}</td>
                  <td className="py-3 px-4 text-center font-bold font-mono text-slate-800">
                    {res.totalMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono text-emerald-600">
                    {res.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold text-xs">
                      {res.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setReportStudent(res.student)}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Report Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Card Modal */}
      {reportStudent && (
        <Modal
          isOpen={true}
          onClose={() => setReportStudent(null)}
          title="Official CBSE Student Report Card"
          subtitle="Annual Academic Progress Report"
          maxWidth="lg"
        >
          <div className="space-y-4 print:p-0">
            {/* Header */}
            <div className="text-center border-b pb-4 border-slate-200">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{school.name}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{school.address} • Affiliation No: {school.affiliationNumber}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-emerald-700 text-white rounded-md text-xs font-bold uppercase tracking-wider">
                Progress Report Card • Academic Session 2027-28
              </div>
            </div>

            {/* Student info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">STUDENT NAME</span>
                <span className="font-bold text-slate-900">{reportStudent.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ADMISSION NO</span>
                <span className="font-mono font-bold text-slate-800">{reportStudent.admissionNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">CLASS & SECTION</span>
                <span className="font-bold text-slate-800">{reportStudent.class} - {reportStudent.section}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ROLL NO</span>
                <span className="font-mono font-bold text-slate-800">{reportStudent.rollNo || '14'}</span>
              </div>
            </div>

            {/* Subject Table */}
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border text-center">Max Marks</th>
                  <th className="p-2 border text-center">Theory</th>
                  <th className="p-2 border text-center">Practical</th>
                  <th className="p-2 border text-center">Total</th>
                  <th className="p-2 border text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { sub: 'English Core', th: 72, pr: 18, max: 100, gr: 'A1' },
                  { sub: 'Hindi Course A', th: 68, pr: 19, max: 100, gr: 'A2' },
                  { sub: 'Mathematics', th: 75, pr: 20, max: 100, gr: 'A1' },
                  { sub: 'General Science', th: 65, pr: 28, max: 100, gr: 'A1' },
                  { sub: 'Social Studies', th: 70, pr: 18, max: 100, gr: 'A2' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 border font-medium text-slate-800">{row.sub}</td>
                    <td className="p-2 border text-center font-mono">{row.max}</td>
                    <td className="p-2 border text-center font-mono">{row.th}</td>
                    <td className="p-2 border text-center font-mono">{row.pr}</td>
                    <td className="p-2 border text-center font-mono font-bold text-slate-900">{row.th + row.pr}</td>
                    <td className="p-2 border text-center font-bold text-emerald-700">{row.gr}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-3 text-center text-xs text-slate-500">
              <div>
                <div className="border-t border-slate-300 pt-1 font-semibold">Class Teacher</div>
              </div>
              <div>
                <div className="border-t border-slate-300 pt-1 font-semibold">Exam Controller</div>
              </div>
              <div>
                <div className="border-t border-slate-300 pt-1 font-bold text-slate-800">Principal</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setReportStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Marksheet</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
