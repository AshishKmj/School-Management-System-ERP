import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR } from '../../utils/formatters';
import { FileText, Download, Printer, PieChart, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const SalaryReportPage: React.FC = () => {
  const { staff } = useDataStore();
  const { showToast } = useAppStore();

  const [selectedYear, setSelectedYear] = useState('2027-28');

  const totalMonthlyPayroll = staff.reduce((sum, s) => sum + (s.basicSalary || 0), 0);
  const annualizedPayroll = totalMonthlyPayroll * 12;

  const departmentData = [
    { department: 'Science & Math', amount: 165000 },
    { department: 'Languages', amount: 120000 },
    { department: 'Humanities', amount: 95000 },
    { department: 'Administration', amount: 85000 },
    { department: 'IT & Lab', amount: 55000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Compensation Audit
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Salary Report</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Annual payroll commitments, department allocation, and statutory PF/ESI disclosures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => showToast({ message: 'Exporting annual payroll summary to Excel...', type: 'info' })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Employees</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{staff.length} Faculty / Staff</div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">100% On-roll Staff</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Outflow</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">{formatINR(totalMonthlyPayroll)}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Recurring monthly CTC obligation</span>
        </div>

        <div className="bg-emerald-800 text-white rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">Annualized Commitment</span>
          <div className="text-2xl font-black text-white mt-2">{formatINR(annualizedPayroll)}</div>
          <span className="text-[11px] text-teal-200/80 mt-1 block">FY {selectedYear} projected outlay</span>
        </div>
      </div>

      {/* Department Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5">
        <h3 className="text-base font-bold text-slate-900 mb-1">Department-wise Monthly Salary Allocation</h3>
        <p className="text-xs text-slate-500 mb-6">Budget distribution across academic and administrative departments</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#CBD5E1"
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: any) => [`₹ ${Number(value).toLocaleString('en-IN')}`, 'Monthly CTC']}
                contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: '12px', border: 'none' }}
              />
              <Bar dataKey="amount" fill="#0D9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
