import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { formatDate } from '../../utils/formatters';
import { GraduationCap, Plus, Calendar, CheckCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const ExamsPage: React.FC = () => {
  const { activeSession, showToast } = useAppStore();

  const [exams, setExams] = useState([
    {
      id: 'ex_01',
      name: 'Term 1 Mid-Term Assessment 2027',
      type: 'Unit Test',
      startDate: '2027-10-15',
      endDate: '2027-10-25',
      isPublished: true,
      classes: 'Nursery - Class 12',
    },
    {
      id: 'ex_02',
      name: 'Half Yearly Examination 2027',
      type: 'Half Yearly',
      startDate: '2027-12-10',
      endDate: '2027-12-22',
      isPublished: false,
      classes: 'Class 1 - Class 12',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState('Half Yearly');
  const [startDate, setStartDate] = useState('2027-11-15');
  const [endDate, setEndDate] = useState('2027-11-25');

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newEx = {
      id: `ex_${Date.now()}`,
      name: examName,
      type: examType,
      startDate,
      endDate,
      isPublished: false,
      classes: 'Class 1 - Class 10',
    };
    setExams([newEx, ...exams]);
    setIsAddOpen(false);
    showToast({ title: 'Exam Created', message: `${examName} added to academic planner.`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Examinations Master</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure CBSE academic assessments, tests, and publishing status for Session {activeSession}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Exam</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 bg-white rounded-2xl shadow-sm border border-emerald-950/5 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {exam.type}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    exam.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {exam.isPublished ? 'Published' : 'Draft Schedule'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{exam.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Applicable for: {exam.classes}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#0B5D4B]" />
                {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
              </span>
              <button
                type="button"
                onClick={() => showToast({ message: `Configuring marksheet template for ${exam.name}`, type: 'info' })}
                className="text-[#0B5D4B] font-bold hover:underline"
              >
                Manage Schedule →
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Academic Assessment"
        subtitle={`Session ${activeSession}`}
      >
        <form onSubmit={handleAddExam} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Exam Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Unit Test 2 Assessment"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Assessment Type</label>
            <select
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="Unit Test">Unit Test</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Final Annual">Final Annual</option>
              <option value="Pre-Board">Pre-Board</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold rounded-lg"
            >
              Save Exam
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
