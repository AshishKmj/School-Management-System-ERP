import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Network, Plus, CheckCircle2, User, BookOpen, Layers } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface MappingItem {
  id: string;
  className: string;
  subjectName: string;
  teacherName: string;
  periodsPerWeek: number;
}

const INITIAL_MAPPINGS: MappingItem[] = [
  { id: 'm_1', className: 'Class 5', subjectName: 'Mathematics', teacherName: 'Sunita Sharma', periodsPerWeek: 6 },
  { id: 'm_2', className: 'Class 5', subjectName: 'General Science', teacherName: 'Dr. Ramesh Gupta', periodsPerWeek: 5 },
  { id: 'm_3', className: 'Class 5', subjectName: 'English Core', teacherName: 'Priya Verma', periodsPerWeek: 6 },
  { id: 'm_4', className: 'Class 6', subjectName: 'Social Studies', teacherName: 'Sunita Sharma', periodsPerWeek: 5 },
  { id: 'm_5', className: 'Class 6', subjectName: 'Computer Applications', teacherName: 'Vikram Joshi', periodsPerWeek: 3 },
  { id: 'm_6', className: 'Class 10', subjectName: 'Mathematics', teacherName: 'Dr. Ramesh Gupta', periodsPerWeek: 7 },
  { id: 'm_7', className: 'Class 10', subjectName: 'Physics & Chemistry', teacherName: 'Dr. Ramesh Gupta', periodsPerWeek: 6 },
];

export const ClassSubjectMapPage: React.FC = () => {
  const { showToast } = useAppStore();
  const [mappings, setMappings] = useState<MappingItem[]>(INITIAL_MAPPINGS);
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New map form
  const [formClass, setFormClass] = useState('Class 5');
  const [formSubject, setFormSubject] = useState('Mathematics');
  const [formTeacher, setFormTeacher] = useState('Sunita Sharma');
  const [formPeriods, setFormPeriods] = useState(5);

  const filtered = mappings.filter(
    (m) => selectedClass === 'ALL' || m.className === selectedClass
  );

  const handleCreateMapping = (e: React.FormEvent) => {
    e.preventDefault();
    const newMap: MappingItem = {
      id: `m_${Date.now()}`,
      className: formClass,
      subjectName: formSubject,
      teacherName: formTeacher,
      periodsPerWeek: formPeriods,
    };
    setMappings([...mappings, newMap]);
    setIsAddOpen(false);
    showToast({
      title: 'Curriculum Assigned',
      message: `${formSubject} mapped to ${formClass} under ${formTeacher}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Faculty Allocation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Class-Subject Mapping</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign curriculum subjects and weekly periods to faculty members per class section
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Faculty Mapping</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center gap-3">
        <label className="text-xs font-bold text-slate-600">Filter by Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
        >
          <option value="ALL">All Classes (Consolidated)</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 6">Class 6</option>
          <option value="Class 7">Class 7</option>
          <option value="Class 8">Class 8</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
        </select>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold text-xs">
                  {item.className}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {item.periodsPerWeek} Periods / Week
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                {item.subjectName}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>Assigned Faculty: <strong className="text-slate-900">{item.teacherName}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Map Subject to Class & Faculty"
        subtitle="Schedule faculty teaching responsibility"
      >
        <form onSubmit={handleCreateMapping} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Select Class *
            </label>
            <select
              value={formClass}
              onChange={(e) => setFormClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option>Class 5</option>
              <option>Class 6</option>
              <option>Class 7</option>
              <option>Class 8</option>
              <option>Class 9</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Subject *
            </label>
            <select
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option>Mathematics</option>
              <option>Science & Technology</option>
              <option>English Core</option>
              <option>Social Studies</option>
              <option>Hindi Course A</option>
              <option>Computer Applications & AI</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Assigned Teacher *
            </label>
            <select
              value={formTeacher}
              onChange={(e) => setFormTeacher(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option>Sunita Sharma (Senior Teacher)</option>
              <option>Dr. Ramesh Gupta (Science Dept)</option>
              <option>Priya Verma (English)</option>
              <option>Vikram Joshi (Computer Science)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Weekly Periods
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={formPeriods}
              onChange={(e) => setFormPeriods(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Confirm Mapping
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
