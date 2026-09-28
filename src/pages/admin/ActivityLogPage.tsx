import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { formatDateTime } from '../../utils/formatters';
import { History, Search, ShieldCheck, Filter, AlertTriangle } from 'lucide-react';

export const ActivityLogPage: React.FC = () => {
  const { activityLogs } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filtered = activityLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Audit Trail
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Activity & Audit Log</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of sensitive actions, fee transactions, logins, and administrative modifications
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity by user, action, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="accountant">Accountant</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.userName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold uppercase">
                      {(log.userRole || 'admin').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        log.action.includes('DELETE')
                          ? 'bg-rose-100 text-rose-800'
                          : log.action.includes('PAYMENT') || log.action.includes('ADMIT')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
