import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { formatINR, formatDate } from '../../utils/formatters';
import { BadgeAlert, Plus, Search, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const StaffPage: React.FC = () => {
  const { staff, addStaff } = useDataStore();
  const { school, showToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Principal' | 'Accountant' | 'Receptionist' | 'Admin' | 'Support Staff'>('Teacher');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [basicSalary, setBasicSalary] = useState<number>(45000);
  const [qualification, setQualification] = useState('M.Sc. B.Ed.');

  const filtered = staff.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    const matchesRole = selectedRole === 'ALL' || s.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast({ message: 'Full name and phone are required.', type: 'warning' });
      return;
    }

    await addStaff(
      {
        schoolId: school.id,
        fullName,
        role,
        phone,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@dataclick.edu.in`,
        joiningDate: new Date().toISOString().slice(0, 10),
        basicSalary,
        allowances: 3000,
        status: 'Active',
        qualification,
      },
      'Administrator'
    );

    setIsAddOpen(false);
    showToast({
      title: 'Staff Member Onboarded',
      message: `${fullName} registered with role ${role}.`,
      type: 'success',
    });

    setFullName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Human Capital Directory
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff & Faculty Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty profiles, payroll packages, contact directory, and employment status
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, employee code, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="teacher">Teachers</option>
          <option value="accountant">Accountants</option>
          <option value="receptionist">Receptionists</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm ring-2 ring-emerald-200">
                    {member.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{member.fullName}</h4>
                    <span className="text-[11px] font-mono text-slate-400 block">{member.employeeCode}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">
                  {member.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="font-semibold text-slate-800">{member.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Qualification:</span>
                  <span className="font-semibold text-slate-800">{member.qualification}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Monthly Basic:</span>
                  <span className="font-bold font-mono text-emerald-700">{formatINR(member.basicSalary)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {member.phone}
              </span>
              <span className="text-[10px] text-slate-400">Joined {formatDate(member.joiningDate)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Onboard Faculty / Staff Member"
        subtitle="Create institutional employee dossier"
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smt. Vandana Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              >
                <option value="Teacher">Teacher / Faculty</option>
                <option value="Principal">Principal</option>
                <option value="Accountant">Accountant</option>
                <option value="Receptionist">Receptionist / Front Desk</option>
                <option value="Admin">Administrator</option>
                <option value="Support Staff">Support Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Monthly Basic Salary (₹) *
              </label>
              <input
                type="number"
                required
                min="5000"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Contact Mobile *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
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
              Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
