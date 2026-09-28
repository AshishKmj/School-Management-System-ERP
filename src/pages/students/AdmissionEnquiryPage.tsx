import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR } from '../../utils/formatters';
import {
  UserPlus,
  FileText,
  CheckCircle2,
  CreditCard,
  Search,
  Printer,
  UserCheck,
  TrendingUp,
  Tag,
  Phone,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const AdmissionEnquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const { enquiries, addEnquiry, modifyEnquiry } = useDataStore();
  const { school, updateSchool, showToast } = useAppStore();
  const { user } = useAuthStore();

  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetClass, setTargetClass] = useState('Class 1');
  const [address, setAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [formPrice, setFormPrice] = useState(school.admissionFormPrice || 150);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      !searchQuery ||
      enq.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.phone.includes(searchQuery) ||
      enq.formNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) {
      showToast({ message: 'Please enter Student Name and Mobile Number.', type: 'warning' });
      return;
    }

    const created = await addEnquiry(
      {
        schoolId: school.id,
        sessionId: 'ses_2027_28',
        studentName,
        fatherName,
        phone,
        targetClass,
        address,
        remarks,
        status: 'Form Issued',
        formPrice: school.admissionFormPrice || 150,
        enquiryDate: new Date().toISOString().slice(0, 10),
      },
      user?.name || 'Front Desk'
    );

    showToast({
      title: 'Enquiry Registered',
      message: `Form ${created.formNumber} issued for ${created.studentName}.`,
      type: 'success',
    });

    setStudentName('');
    setFatherName('');
    setPhone('');
    setAddress('');
    setRemarks('');
  };

  const handleUpdatePrice = async () => {
    await updateSchool({ admissionFormPrice: formPrice });
    showToast({
      title: 'Form Price Updated',
      message: `Standard admission form price updated to ₹${formPrice}.`,
      type: 'success',
    });
  };

  const handleTakeAdmission = (enq: (typeof enquiries)[0]) => {
    navigate('/students/new');
  };

  const handlePrintForm = (formNo: string, name: string) => {
    showToast({
      title: 'Printing Form',
      message: `Generating printable registration docket for ${formNo} (${name}).`,
      type: 'info',
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Academic Cycle 2027-28
            </span>
            <span className="text-xs text-slate-500">Session Term 1</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admission Enquiry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage parent walk-ins, issue prospectus forms, and convert to admissions
          </p>
        </div>
      </div>

      {/* KPI 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Enquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{enquiries.length}</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2 this week
          </span>
        </div>

        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Form Issued
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {enquiries.filter((e) => e.status === 'Form Issued').length || 3}
          </div>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">
            100% conversion to desk review
          </span>
        </div>

        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Admission
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {enquiries.filter((e) => e.status === 'Admitted').length || 1}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            Enrolled • 33.3% conversion
          </span>
        </div>

        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B5D4B]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Form Collected
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0B5D4B] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0B5D4B] mt-2">
            ₹{enquiries.length * (school.admissionFormPrice || 150)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Cash counter & online</span>
        </div>
      </div>

      {/* Main Grid: Form on Left, List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* New Enquiry Form Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B5D4B] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">New Enquiry</h3>
                  <p className="text-[11px] text-slate-500">Register student walk-in or phone enquiry</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Entry Desk
              </span>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advait Kulkarni"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Father's / Guardian's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Kulkarni"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 00000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Class Interested In <span className="text-rose-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                >
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11-Sci">Class 11 (PCM/PCB)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Sector / Colony, Landmark, City..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Counselor Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Sibling discounts, bus transport requirement, previous school records..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none resize-none"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Save Enquiry</span>
              </button>
            </form>
          </div>

          {/* Admission Form Price Configuration Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Admission Form Price</h3>
              </div>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>

            <p className="text-xs text-slate-500">
              Standard brochure & registration docket selling price charged from parents:
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 font-bold text-slate-700">₹</span>
                <input
                  type="number"
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white outline-none"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                />
              </div>
              <button
                type="button"
                onClick={handleUpdatePrice}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Enquiry Register Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enquiry Register</h3>
                <p className="text-xs text-slate-500">Live ledger of active applicants</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none"
                    placeholder="Search name, phone, form..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Form Issued">Form Issued</option>
                  <option value="Campus Tour Done">Campus Tour Done</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Needs Document">Needs Document</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 pt-3">
              {filteredEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{enq.studentName}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          enq.status === 'Form Issued'
                            ? 'bg-amber-100 text-amber-900'
                            : enq.status === 'Admitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'Campus Tour Done'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {enq.status}: {enq.formNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-semibold text-[11px]">
                        {enq.targetClass}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>S/o {enq.fatherName}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600" /> +91 {enq.phone}
                      </span>
                      <span className="font-semibold text-emerald-800">
                        Fee: ₹{enq.formPrice}
                      </span>
                    </div>

                    {enq.remarks && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-1">{enq.remarks}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handlePrintForm(enq.formNumber, enq.studentName)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Form</span>
                    </button>

                    {enq.status !== 'Admitted' ? (
                      <button
                        type="button"
                        onClick={() => handleTakeAdmission(enq)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Take Admission</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredEnquiries.length} of {enquiries.length} enquiries recorded</span>
              <button
                type="button"
                onClick={() => navigate('/students/archive')}
                className="text-[#0B5D4B] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>View Passed Out / Archived</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
