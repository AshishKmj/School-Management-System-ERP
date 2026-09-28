import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BookOpen, Plus, Search, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  type: 'Theory' | 'Practical' | 'Both';
  maxTheoryMarks: number;
  maxPracticalMarks: number;
  passingMarks: number;
  department: string;
}

const INITIAL_SUBJECTS: SubjectItem[] = [
  { id: 'sub_1', name: 'English Core', code: 'ENG-101', type: 'Both', maxTheoryMarks: 80, maxPracticalMarks: 20, passingMarks: 33, department: 'Languages' },
  { id: 'sub_2', name: 'Mathematics', code: 'MATH-102', type: 'Both', maxTheoryMarks: 80, maxPracticalMarks: 20, passingMarks: 33, department: 'Mathematics' },
  { id: 'sub_3', name: 'Science & Technology', code: 'SCI-103', type: 'Both', maxTheoryMarks: 70, maxPracticalMarks: 30, passingMarks: 33, department: 'Science' },
  { id: 'sub_4', name: 'Social Studies', code: 'SST-104', type: 'Theory', maxTheoryMarks: 80, maxPracticalMarks: 20, passingMarks: 33, department: 'Humanities' },
  { id: 'sub_5', name: 'Hindi Course A', code: 'HIN-105', type: 'Theory', maxTheoryMarks: 80, maxPracticalMarks: 20, passingMarks: 33, department: 'Languages' },
  { id: 'sub_6', name: 'Computer Applications & AI', code: 'CA-106', type: 'Both', maxTheoryMarks: 50, maxPracticalMarks: 50, passingMarks: 33, department: 'Computer Science' },
  { id: 'sub_7', name: 'Physical Education & Yoga', code: 'PE-107', type: 'Practical', maxTheoryMarks: 30, maxPracticalMarks: 70, passingMarks: 33, department: 'Sports' },
];

export const SubjectsPage: React.FC = () => {
  const { showToast } = useAppStore();
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Theory' | 'Practical' | 'Both'>('Both');
  const [maxTheoryMarks, setMaxTheoryMarks] = useState(80);
  const [maxPracticalMarks, setMaxPracticalMarks] = useState(20);
  const [passingMarks, setPassingMarks] = useState(33);
  const [department, setDepartment] = useState('Science');

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      showToast({ message: 'Subject name and code are required.', type: 'warning' });
      return;
    }
    const newSub: SubjectItem = {
      id: `sub_${Date.now()}`,
      name,
      code: code.toUpperCase(),
      type,
      maxTheoryMarks,
      maxPracticalMarks,
      passingMarks,
      department,
    };
    setSubjects([...subjects, newSub]);
    setIsAddOpen(false);
    showToast({
      title: 'Subject Registered',
      message: `${name} (${code.toUpperCase()}) added to curriculum register.`,
      type: 'success',
    });
    setName('');
    setCode('');
  };

  const handleDeleteSubject = (id: string, subName: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    showToast({
      title: 'Subject Removed',
      message: `${subName} deleted from master register.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Curriculum Master
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Subjects & Course Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure CBSE course codes, theory/practical grading ratios, and passing marks
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject name, code, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-emerald-700 font-bold">{filtered.length}</span> Course Modules
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Theory Max</th>
                <th className="py-3 px-4 text-center">Practical Max</th>
                <th className="py-3 px-4 text-center">Pass %</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span>{sub.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{sub.code}</td>
                  <td className="py-3 px-4 text-slate-600">{sub.department}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                      {sub.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                    {sub.maxTheoryMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                    {sub.maxPracticalMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    {sub.passingMarks}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteSubject(sub.id, sub.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Curriculum Subject"
        subtitle="Define new course under CBSE syllabus"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sanskrit / Environmental Studies"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SKT-108"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono uppercase focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              >
                <option>Languages</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>Humanities</option>
                <option>Computer Science</option>
                <option>Sports & Arts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Theory Max
              </label>
              <input
                type="number"
                value={maxTheoryMarks}
                onChange={(e) => setMaxTheoryMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Practical Max
              </label>
              <input
                type="number"
                value={maxPracticalMarks}
                onChange={(e) => setMaxPracticalMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Pass Mark %
              </label>
              <input
                type="number"
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono outline-none"
              />
            </div>
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
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
