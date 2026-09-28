import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatDate } from '../../utils/formatters';
import { Archive, Search, FileText, Printer, Download, CheckCircle } from 'lucide-react';

export const PassedOutArchivePage: React.FC = () => {
  const { students } = useDataStore();
  const { school, showToast } = useAppStore();
  const [search, setSearch] = useState('');

  // Sample alumni records
  const sampleAlumni = [
    {
      id: 'alm_01',
      fullName: 'Rahul K. Verma',
      admissionNo: 'ADM-20-0012',
      grNumber: 'GR-2020-0012',
      passingYear: '2024-25',
      finalClass: 'Class 12 (Science)',
      tcNumber: 'TC-2025-084',
      tcIssueDate: '2025-05-20',
      boardPercentage: '94.2%',
      status: 'Alumni (College Admitted)',
    },
    {
      id: 'alm_02',
      fullName: 'Sanya Malhotra',
      admissionNo: 'ADM-20-0045',
      grNumber: 'GR-2020-0045',
      passingYear: '2024-25',
      finalClass: 'Class 12 (Commerce)',
      tcNumber: 'TC-2025-089',
      tcIssueDate: '2025-05-22',
      boardPercentage: '91.8%',
      status: 'Alumni (DU Enrolled)',
    },
    {
      id: 'alm_03',
      fullName: 'Kunal Singhania',
      admissionNo: 'ADM-19-0112',
      grNumber: 'GR-2019-0112',
      passingYear: '2023-24',
      finalClass: 'Class 10 (Secondary)',
      tcNumber: 'TC-2024-032',
      tcIssueDate: '2024-06-10',
      boardPercentage: '88.5%',
      status: 'Transfer Certificate Issued',
    },
  ];

  const filtered = sampleAlumni.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      a.tcNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrintTC = (tcNo: string, studentName: string) => {
    showToast({
      title: 'Transfer Certificate Generated',
      message: `Preparing Transfer Certificate copy ${tcNo} for ${studentName}.`,
      type: 'info',
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              Alumni & Transfer Records
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Passed Out Archive</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical student alumni directory, character certificates & TC verification records
          </p>
        </div>

        <button
          onClick={() => showToast({ message: 'Exporting alumni ledger...', type: 'info' })}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Alumni Register</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0B5D4B] outline-none"
            placeholder="Search alumni by name, ADM No, or TC Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name & GR</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Passing Year</th>
                <th className="py-3 px-4">Final Class</th>
                <th className="py-3 px-4">TC Number</th>
                <th className="py-3 px-4">Board Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((alumni) => (
                <tr key={alumni.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{alumni.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{alumni.grNumber}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#0B5D4B]">
                    {alumni.admissionNo}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                      {alumni.passingYear}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{alumni.finalClass}</td>
                  <td className="py-3 px-4 font-mono text-emerald-800 font-bold">
                    {alumni.tcNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{alumni.boardPercentage}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handlePrintTC(alumni.tcNumber, alumni.fullName)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 ml-auto shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print TC</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
