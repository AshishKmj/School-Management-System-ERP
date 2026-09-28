import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR, formatDate } from '../../utils/formatters';
import { ReceiptText, Plus, Search, Download, Filter, Tag } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense } = useDataStore();
  const { activeSession, school, showToast } = useAppStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Staff Payroll' | 'Utilities' | 'Maintenance' | 'Lab Equipment' | 'Sports' | 'Stationery' | 'Events' | 'Other'>('Maintenance');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paidTo, setPaidTo] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI'>('UPI');
  const [notes, setNotes] = useState('');

  const filtered = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.voucherNo && exp.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || exp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalExpenseAmount = filtered.reduce((sum, item) => sum + item.amount, 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      showToast({ message: 'Please provide valid expense title and amount.', type: 'warning' });
      return;
    }

    await addExpense(
      {
        schoolId: school.id,
        sessionId: activeSession,
        title,
        category,
        amount,
        expenseDate: date,
        paidTo: paidTo || 'Vendor',
        paymentMode,
        approvedBy: user?.name || 'Accountant',
        notes,
      },
      user?.name || 'Accountant'
    );

    setIsAddOpen(false);
    showToast({
      title: 'Expense Recorded',
      message: `₹ ${amount.toLocaleString('en-IN')} added under ${category}.`,
      type: 'success',
    });

    setTitle('');
    setPaidTo('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              Disbursements Ledger
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Expenses & Outflows</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track operational spending, vendor bills, utility vouchers, and department budgets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast({ message: 'Exporting expense records to Excel...', type: 'info' })}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Card */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-purple-200 font-semibold uppercase tracking-wider block">
            Filtered Outflow Total
          </span>
          <div className="text-3xl font-black tracking-tight mt-1">
            {formatINR(totalExpenseAmount)}
          </div>
          <span className="text-[11px] text-purple-200/80 mt-1 block">
            Across {filtered.length} approved purchase vouchers in session {activeSession}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, vendor, or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none cursor-pointer"
          >
            <option value="ALL">All Expense Heads</option>
            <option value="Salaries">Salaries</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Electricity & Water">Electricity & Water</option>
            <option value="Stationery">Stationery</option>
            <option value="Events">Events</option>
            <option value="Transportation">Transportation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-medium">
                    {formatDate(item.expenseDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    {item.notes && <div className="text-[11px] text-slate-400">{item.notes}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-semibold text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{item.paidTo}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{item.voucherNo || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                      {item.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 text-sm">
                    {formatINR(item.amount)}
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
        title="Record Campus Expense Voucher"
        subtitle="Debit entry into institutional cashbook"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Expense Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Science Lab Chemical Reagents Batch 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              >
                <option value="Salaries">Staff Payroll & Salaries</option>
                <option value="Maintenance">Campus Maintenance</option>
                <option value="Electricity & Water">Electricity & Water</option>
                <option value="Stationery">Printing & Stationery</option>
                <option value="Events">Annual Events & Sports</option>
                <option value="Transportation">Bus Fuel & Transport</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Paid To (Vendor/Person) *
              </label>
              <input
                type="text"
                placeholder="e.g. Modern Scientific Suppliers"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Bank Transfer">NEFT / RTGS</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Expense Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Remarks & Justification
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sanctioned as per Annual Science Committee budget..."
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Debit Voucher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
