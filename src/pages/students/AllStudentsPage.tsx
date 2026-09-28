import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR, formatDate } from '../../utils/formatters';
import { Student } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Printer,
  FileSpreadsheet,
  Download,
  Filter,
  Phone,
  QrCode,
  Building,
} from 'lucide-react';

export const AllStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { students } = useDataStore();
  const { school, showToast, openQuickFee } = useAppStore();

  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchesQuery =
      !query ||
      s.fullName.toLowerCase().includes(query.toLowerCase()) ||
      s.grNumber.toLowerCase().includes(query.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(query.toLowerCase()) ||
      s.parentPhone.includes(query);
    const matchesClass = classFilter === 'ALL' || s.class === classFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesQuery && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">All Students</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete student directory, admissions registry, and ID cards
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => showToast({ message: 'Exporting student list to Excel (.xlsx)...', type: 'info' })}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>
          <button
            onClick={() => navigate('/students/new')}
            className="px-4 py-2 rounded-xl bg-[#0B5D4B] hover:bg-[#073B30] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Admission</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0B5D4B] outline-none"
            placeholder="Search by GR Number, Name, Admission No., or Mobile..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            <option value="UKG">UKG</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 12-Sci">Class 12-Sci</option>
          </select>

          <select
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Provisional">Provisional</option>
            <option value="Awaiting Fee">Awaiting Fee</option>
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name & GR</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Class / Section</th>
                <th className="py-3 px-4">Parent Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Fee Dues</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0">
                        {st.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{st.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{st.grNumber}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#0B5D4B]">
                    {st.admissionNo}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900">{st.class}</span>
                    <span className="block text-[11px] text-slate-500">{st.section}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-900">{st.fatherName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-emerald-600" /> +91 {st.parentPhone}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.status === 'Provisional'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right tabular-nums">
                    {st.totalFeeDue && st.totalFeeDue > 0 ? (
                      <span className="font-bold text-rose-600">{formatINR(st.totalFeeDue)}</span>
                    ) : (
                      <span className="font-bold text-emerald-700">Cleared</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewStudent(st)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdCardStudent(st)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B5D4B] hover:bg-slate-100 transition-colors"
                        title="Print Student ID Card"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {st.totalFeeDue && st.totalFeeDue > 0 ? (
                        <button
                          type="button"
                          onClick={() => openQuickFee(st.grNumber)}
                          className="px-2 py-1 rounded-md bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors"
                        >
                          Collect
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span className="text-[11px]">UDISE+ Synced</span>
        </div>
      </div>

      {/* Modal: View Student Profile */}
      <Modal
        isOpen={Boolean(viewStudent)}
        onClose={() => setViewStudent(null)}
        title="Student Permanent Record"
        subtitle={viewStudent ? `${viewStudent.fullName} (${viewStudent.grNumber})` : ''}
        maxWidth="2xl"
      >
        {viewStudent && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xl shrink-0">
                {viewStudent.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{viewStudent.fullName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {viewStudent.status}
                  </span>
                </div>
                <div className="text-slate-500 text-xs">
                  Admission No: <strong className="font-mono text-[#0B5D4B]">{viewStudent.admissionNo}</strong> • GR:{' '}
                  <strong className="font-mono text-slate-800">{viewStudent.grNumber}</strong>
                </div>
                <div className="text-slate-500">
                  Class: <strong>{viewStudent.class}</strong> ({viewStudent.section})
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Father's Name</span>
                <span className="font-semibold text-slate-900">{viewStudent.fatherName}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Mother's Name</span>
                <span className="font-semibold text-slate-900">{viewStudent.motherName || '-'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Birth</span>
                <span className="font-semibold text-slate-900">{formatDate(viewStudent.dob)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
                <span className="font-semibold text-slate-900">{viewStudent.bloodGroup}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Parent Mobile</span>
                <span className="font-semibold text-slate-900 font-mono">+91 {viewStudent.parentPhone}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">UDISE+ PEN</span>
                <span className="font-semibold text-slate-900 font-mono">{viewStudent.penNumber || 'Pending'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Residential Address</span>
              <p className="text-slate-700">{viewStudent.address}, {viewStudent.district}, {viewStudent.state} - {viewStudent.pincode}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">
                Admission Date: <strong>{formatDate(viewStudent.admissionDate)}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIdCardStudent(viewStudent);
                  setViewStudent(null);
                }}
                className="px-4 py-2 bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold rounded-lg transition-colors"
              >
                Print Student ID Card
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Printable Student ID Card */}
      <Modal
        isOpen={Boolean(idCardStudent)}
        onClose={() => setIdCardStudent(null)}
        title="Student Identity Card"
        subtitle="Official CBSE Standard Format (35mm x 45mm card ratio)"
        maxWidth="md"
      >
        {idCardStudent && (
          <div className="space-y-4">
            {/* The Physical Card Preview */}
            <div className="printable-area w-full max-w-sm mx-auto bg-gradient-to-b from-[#0B5D4B] via-[#084B3D] to-[#073B30] text-white rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-400/40 p-4">
              {/* Card School Header */}
              <div className="text-center pb-2 border-b border-white/20">
                <h4 className="font-bold text-sm tracking-wide">{school.name}</h4>
                <p className="text-[9px] text-teal-200">{school.boardAffiliation}</p>
              </div>

              {/* Photo & Details */}
              <div className="py-3 flex items-center gap-3">
                <div className="w-20 h-24 rounded-lg bg-white p-1 shadow-md shrink-0">
                  <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center font-bold text-slate-600 text-lg">
                    {idCardStudent.fullName.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="text-[11px] space-y-1 min-w-0">
                  <div>
                    <span className="text-teal-200 text-[9px] uppercase font-bold block">Student Name</span>
                    <strong className="text-sm font-bold text-white block leading-tight">{idCardStudent.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-teal-200 text-[9px] uppercase font-bold">Class & Sec:</span>{' '}
                    <strong>{idCardStudent.class} ({idCardStudent.section})</strong>
                  </div>
                  <div>
                    <span className="text-teal-200 text-[9px] uppercase font-bold">GR No:</span>{' '}
                    <span className="font-mono">{idCardStudent.grNumber}</span>
                  </div>
                  <div>
                    <span className="text-teal-200 text-[9px] uppercase font-bold">Blood Group:</span>{' '}
                    <span>{idCardStudent.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-teal-100">
                <span>Emergency: +91 {idCardStudent.parentPhone}</span>
                <span className="font-bold text-white">Valid 2027-28</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIdCardStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Card</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
