import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Plus, Check, X, User, KeyRound, Lock } from 'lucide-react';
import { Role, PermissionKey } from '../../types';
import { Modal } from '../../components/common/Modal';

const PERMISSION_GROUPS: { name: string; keys: { key: PermissionKey; label: string }[] }[] = [
  {
    name: 'Student Admissions & Records',
    keys: [
      { key: 'manage_students', label: 'View & Edit Student Dossiers' },
      { key: 'admit_student', label: 'Create New Admissions' },
      { key: 'promote_student', label: 'Execute Session Promotions' },
      { key: 'manage_enquiries', label: 'Manage Admission Enquiries' },
      { key: 'edit_form_price', label: 'Change Admission Form Price' },
    ],
  },
  {
    name: 'Fee Management & Cashiering',
    keys: [
      { key: 'manage_fee_structure', label: 'Alter Class Fee Structure' },
      { key: 'collect_fees', label: 'Accept Fee Payments & Issue Receipts' },
      { key: 'delete_fees', label: 'Soft Delete Fee Transactions' },
      { key: 'view_fee_deletion_log', label: 'Audit Fee Deletion Logs' },
    ],
  },
  {
    name: 'Academics & Examinations',
    keys: [
      { key: 'manage_attendance', label: 'Mark Class Attendance' },
      { key: 'manage_exams', label: 'Create Exams & Schedules' },
      { key: 'enter_marks', label: 'Input Student Marks' },
      { key: 'view_results', label: 'Publish Results & Report Cards' },
    ],
  },
  {
    name: 'Institutional Administration & Finance',
    keys: [
      { key: 'manage_expenses', label: 'Record Campus Expenses' },
      { key: 'view_finance_reports', label: 'Access Audit Financial Statements' },
      { key: 'manage_staff', label: 'Manage Faculty & Staff Profiles' },
      { key: 'view_salary', label: 'Inspect Staff Salary Figures' },
      { key: 'manage_payroll', label: 'Process Monthly Payroll' },
      { key: 'admin_settings', label: 'Alter School Configuration & Affiliation' },
    ],
  },
];

export const UsersPermissionsPage: React.FC = () => {
  const { role, permissions, can } = useAuthStore();
  const { showToast } = useAppStore();

  const [activeRoleTab, setActiveRoleTab] = useState<Role>('accountant');
  const [matrixState, setMatrixState] = useState(permissions);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Add user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('teacher');
  const [newUserDesignation, setNewUserDesignation] = useState('Assistant Teacher');

  const togglePermission = (targetRole: Role, perm: PermissionKey) => {
    const currentList = matrixState[targetRole] || [];
    const hasPerm = currentList.includes(perm);
    const updated = hasPerm
      ? currentList.filter((p) => p !== perm)
      : [...currentList, perm];

    setMatrixState({
      ...matrixState,
      [targetRole]: updated,
    });

    showToast({
      title: 'Permission Matrix Updated',
      message: `${hasPerm ? 'Revoked' : 'Granted'} permission "${perm}" for role "${targetRole.toUpperCase()}".`,
      type: 'info',
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddUserOpen(false);
    showToast({
      title: 'Workstation Account Provisioned',
      message: `Credentials dispatched to ${newUserEmail} for role ${newUserRole}.`,
      type: 'success',
    });
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              RBAC Governance
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Users & Role Permission Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fine-grained role-based access control protecting fiscal and confidential records
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Provision User</span>
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {(['super_admin', 'admin', 'accountant', 'teacher', 'receptionist'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setActiveRoleTab(r)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
              activeRoleTab === r
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Permission Grid */}
      <div className="space-y-6">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.name} className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
            <h4 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              {group.name}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.keys.map((p) => {
                const isEnabled = (matrixState[activeRoleTab] || []).includes(p.key);
                const isSuperAdmin = activeRoleTab === 'super_admin';

                return (
                  <div
                    key={p.key}
                    onClick={() => !isSuperAdmin && togglePermission(activeRoleTab, p.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isEnabled
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-slate-50/50 opacity-70'
                    } ${isSuperAdmin ? 'cursor-not-allowed' : 'hover:border-emerald-500'}`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.label}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.key}</div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isEnabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Provision School ERP User"
        subtitle="Issue secure staff login credentials"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ramesh@dataclick.edu.in"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Designated Role *
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none capitalize"
              >
                <option value="accountant">Accountant</option>
                <option value="teacher">Teacher</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Official Designation
              </label>
              <input
                type="text"
                value={newUserDesignation}
                onChange={(e) => setNewUserDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Generate User Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
