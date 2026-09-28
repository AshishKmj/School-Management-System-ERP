import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR, formatDate } from '../../utils/formatters';
import { Wallet, Printer, CheckCircle2, Download, AlertCircle, FileText } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Staff } from '../../types';

interface PayrollRow extends Staff {
  basic: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  payrollStatus: 'Paid' | 'Pending';
  paymentDate: string;
}

export const SalaryManagementPage: React.FC = () => {
  const { staff } = useDataStore();
  const { school, showToast } = useAppStore();

  const [selectedMonth, setSelectedMonth] = useState('October 2027');
  const [slipTarget, setSlipTarget] = useState<PayrollRow | null>(null);

  // Maintain salary calculation table
  const [payrollRows, setPayrollRows] = useState<PayrollRow[]>(
    staff.map((member, idx) => {
      const basic = member.basicSalary || 40000;
      const bonus = idx === 0 ? 3000 : 0;
      const deductions = 1200; // attendance / PF deduction
      const net = basic + bonus - deductions;
      return {
        ...member,
        basic,
        bonus,
        deductions,
        netSalary: net,
        payrollStatus: idx % 2 === 0 ? 'Paid' : 'Pending',
        paymentDate: idx % 2 === 0 ? '2027-10-05' : '-',
      };
    })
  );

  const handleMarkPaid = (staffId: string) => {
    setPayrollRows((prev) =>
      prev.map((r) =>
        r.id === staffId
          ? { ...r, payrollStatus: 'Paid', paymentDate: new Date().toISOString().slice(0, 10) }
          : r
      )
    );
    showToast({
      title: 'Salary Disbursed',
      message: 'Direct bank transfer voucher marked as cleared.',
      type: 'success',
    });
  };

  const handleAdjustValue = (
    staffId: string,
    field: 'bonus' | 'deductions',
    val: number
  ) => {
    setPayrollRows((prev) =>
      prev.map((r) => {
        if (r.id !== staffId) return r;
        const newBonus = field === 'bonus' ? val : r.bonus;
        const newDeductions = field === 'deductions' ? val : r.deductions;
        return {
          ...r,
          [field]: val,
          netSalary: r.basic + newBonus - newDeductions,
        };
      })
    );
  };

  const totalPayrollOutflow = payrollRows.reduce((sum, r) => sum + r.netSalary, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Institutional Payroll
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Salary Sheet & Payroll</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Process monthly faculty compensation, attendance deductions, performance allowances, and pay slips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast({ message: 'Exporting bank NEFT batch file...', type: 'info' })}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Bank NEFT Batch</span>
          </button>
        </div>
      </div>

      {/* Month Selector Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600">Payroll Cycle:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
          >
            <option>October 2027</option>
            <option>September 2027</option>
            <option>August 2027</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-600">
          Monthly Disbursal Obligation:{' '}
          <strong className="text-emerald-700 font-mono text-sm font-bold">
            {formatINR(totalPayrollOutflow)}
          </strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-right">Basic CTC</th>
                <th className="py-3 px-4 text-center">Allowances / Bonus</th>
                <th className="py-3 px-4 text-center">Deductions (Leaves/PF)</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{row.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{row.employeeCode}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.role}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                    {formatINR(row.basic)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      value={row.bonus}
                      onChange={(e) => handleAdjustValue(row.id, 'bonus', Number(e.target.value))}
                      className="w-20 px-2 py-1 text-center font-mono border border-slate-200 rounded-lg text-emerald-700 bg-slate-50 focus:bg-white outline-none"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      value={row.deductions}
                      onChange={(e) => handleAdjustValue(row.id, 'deductions', Number(e.target.value))}
                      className="w-20 px-2 py-1 text-center font-mono border border-slate-200 rounded-lg text-rose-700 bg-slate-50 focus:bg-white outline-none"
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatINR(row.netSalary)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        row.payrollStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {row.payrollStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {row.payrollStatus === 'Pending' ? (
                      <button
                        onClick={() => handleMarkPaid(row.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => setSlipTarget(row)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Pay Slip</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      {slipTarget && (
        <Modal
          isOpen={true}
          onClose={() => setSlipTarget(null)}
          title="Institutional Salary Voucher / Pay Slip"
          subtitle={`Pay slip for ${selectedMonth}`}
        >
          <div className="space-y-4 print:p-0">
            <div className="text-center border-b pb-3 border-slate-200">
              <h3 className="text-lg font-black text-slate-900 uppercase">{school.name}</h3>
              <p className="text-[11px] text-slate-500">{school.address}</p>
              <div className="mt-1 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
                CONFIDENTIAL SALARY STATEMENT • {selectedMonth}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">EMPLOYEE NAME</span>
                <span className="font-bold text-slate-900">{slipTarget.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">EMP CODE</span>
                <span className="font-mono font-bold text-slate-800">{slipTarget.employeeCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ROLE</span>
                <span className="font-semibold text-slate-800">{slipTarget.role}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">QUALIFICATION</span>
                <span className="font-semibold text-slate-800">{slipTarget.qualification}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-100 font-bold text-slate-700 p-2">
                <div>Earnings</div>
                <div>Deductions</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-200 p-3">
                <div className="space-y-1.5 pr-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Basic Pay:</span>
                    <span className="font-mono font-bold">{formatINR(slipTarget.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Special Allowance:</span>
                    <span className="font-mono font-bold">₹ 1,500</span>
                  </div>
                </div>
                <div className="space-y-1.5 pl-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provident Fund (PF):</span>
                    <span className="font-mono font-bold">₹ 1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Professional Tax:</span>
                    <span className="font-mono font-bold">₹ 200</span>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 p-3 border-t border-slate-200 flex justify-between items-center font-bold text-sm">
                <span className="text-emerald-900">NET SALARY CREDITED:</span>
                <span className="text-emerald-800 font-mono text-base font-black">
                  {formatINR(slipTarget.basicSalary + 1500 - 2000)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSlipTarget(null)}
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
                <span>Print Pay Slip</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
