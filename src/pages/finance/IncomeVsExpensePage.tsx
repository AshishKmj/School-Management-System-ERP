import React from 'react';
import { useDataStore } from '../../store/useDataStore';
import { formatINR } from '../../utils/formatters';
import { Scale, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const IncomeVsExpensePage: React.FC = () => {
  const { payments, expenses } = useDataStore();

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netSurplus = totalIncome - totalExpense;
  const operatingMargin = totalIncome > 0 ? ((netSurplus / totalIncome) * 100).toFixed(1) : '0';

  const chartData = [
    { month: 'Apr', Income: 820000, Expense: 410000 },
    { month: 'May', Income: 650000, Expense: 390000 },
    { month: 'Jun', Income: 920000, Expense: 480000 },
    { month: 'Jul', Income: 1140000, Expense: 520000 },
    { month: 'Aug', Income: 780000, Expense: 450000 },
    { month: 'Sep', Income: 890000, Expense: 460000 },
    { month: 'Oct', Income: totalIncome, Expense: totalExpense },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              Institutional Balance Sheet
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Income vs Expense Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fiscal comparison of fee collection inflows against institutional disbursements
          </p>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Income</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalIncome)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Student fees & admission receipts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Total Expenses</span>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalExpense)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Payroll, utilities & operational outlays</div>
        </div>

        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">Net Operating Surplus</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{formatINR(netSurplus)}</div>
          <div className="text-[11px] text-purple-200 mt-1">
            Operating Margin: <strong className="text-emerald-300 font-bold">{operatingMargin}%</strong>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5">
        <h3 className="text-base font-bold text-slate-900 mb-1">Fiscal Trends: Inflows vs Outflows</h3>
        <p className="text-xs text-slate-500 mb-6">Monthly financial velocity in Indian Rupees (₹)</p>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} stroke="#CBD5E1" />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#CBD5E1"
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
              />
              <Tooltip
                formatter={(value: any) => [`₹ ${Number(value).toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: '12px', border: 'none' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} name="Inflow (Collections)" />
              <Bar dataKey="Expense" fill="#F43F5E" radius={[6, 6, 0, 0]} name="Outflow (Expenses)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
