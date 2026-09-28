import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ArrowLeft,
  UserCheck,
  School,
  Phone,
  Bus,
  Camera,
  FileCheck,
  Lock,
  Save,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Upload,
} from 'lucide-react';

export const NewAdmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { addStudent, enquiries } = useDataStore();
  const { activeSession, school, showToast } = useAppStore();
  const { user } = useAuthStore();

  const [admissionNo] = useState(`ADM-26-${Math.floor(1000 + Math.random() * 9000)}`);
  const [enquiryNo, setEnquiryNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('2018-05-14');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [penNumber, setPenNumber] = useState('');

  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [section, setSection] = useState('Section A (Rose)');
  const [status, setStatus] = useState<'Active' | 'Provisional' | 'Awaiting Fee'>('Active');
  const [admissionDate, setAdmissionDate] = useState('2027-10-15');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [religion, setReligion] = useState('Hindu');
  const [nationality, setNationality] = useState('Indian');

  const [parentPhone, setParentPhone] = useState('9876543210');
  const [altPhone, setAltPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('House / Flat No., Society / Mohalla, Landmark, Road Name...');
  const [pincode, setPincode] = useState('201301');
  const [district, setDistrict] = useState('Gautam Buddha Nagar');
  const [state, setState] = useState('Uttar Pradesh');

  const [busRoute, setBusRoute] = useState('route4');
  const [transportFee, setTransportFee] = useState(18000);
  const [pickupTiming, setPickupTiming] = useState('Both Ways (Morning Pickup + Afternoon Drop)');

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [specialRemarks, setSpecialRemarks] = useState(
    'Sibling of Arnav Sharma (Class 8-B, Adm #1084). Student has mild dust allergy. 10% sibling fee concession approved by Principal.'
  );
  const [tcSubmitted, setTcSubmitted] = useState(true);
  const [sendWelcomeKit, setSendWelcomeKit] = useState(true);

  // Autofill if enquiry number matches
  const handleEnquiryLookup = (enqVal: string) => {
    setEnquiryNo(enqVal);
    const matched = enquiries.find(
      (e) => e.formNumber.toLowerCase() === enqVal.trim().toLowerCase()
    );
    if (matched) {
      setFullName(matched.studentName);
      setFatherName(matched.fatherName);
      setParentPhone(matched.phone);
      setSelectedClass(matched.targetClass || 'Class 1');
      if (matched.address) setAddress(matched.address);
      showToast({
        title: 'Enquiry Found & Autofilled',
        message: `Details loaded for ${matched.studentName} (${matched.formNumber}).`,
        type: 'success',
      });
    }
  };

  const handleRouteChange = (val: string) => {
    setBusRoute(val);
    if (val === 'self') setTransportFee(0);
    else if (val === 'route1') setTransportFee(14000);
    else if (val === 'route4') setTransportFee(18000);
    else if (val === 'route9') setTransportFee(22000);
    else if (val === 'route12') setTransportFee(16500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    showToast({
      title: 'Draft Saved Locally',
      message: `${admissionNo} form draft preserved on this workstation.`,
      type: 'info',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      showToast({ message: "Please enter the student's legal name.", type: 'warning' });
      return;
    }

    const grNumber = `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = await addStudent(
      {
        schoolId: school.id,
        sessionId: activeSession,
        admissionNo,
        grNumber,
        admissionFormNo: enquiryNo,
        fullName,
        fatherName,
        motherName,
        dob,
        gender,
        bloodGroup,
        aadhaarNo,
        penNumber,
        class: selectedClass,
        section,
        status,
        admissionDate,
        category,
        religion,
        nationality,
        parentPhone,
        altPhone,
        parentEmail,
        address,
        pincode,
        district,
        state,
        busRoute: busRoute === 'self' ? 'None (Self Transport)' : busRoute,
        transportFee,
        pickupTiming,
        remarks: specialRemarks,
        isTcSubmitted: tcSubmitted,
        photoUrl: photoPreview || undefined,
        totalFeeDue: 3500,
        totalFeePaid: 0,
      },
      user?.name || 'Administrator'
    );

    showToast({
      title: 'Admission Completed',
      message: `Student ${newStudent.fullName} registered with ${newStudent.admissionNo} & ${newStudent.grNumber}.`,
      type: 'success',
    });

    navigate('/students');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Sticky Sub-Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/students')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Students</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                New Student Admission
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {activeSession}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Register a new student • UDISE+ & State Board Enrollment Form
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Draft auto-saved 2m ago
          </span>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-[#0B5D4B]" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: Basic Student Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Basic Student Information</h3>
                <p className="text-xs text-slate-500">
                  Permanent student identification & identity card registry
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
              Identity & Personal Details
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Admission No (System generated) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admission No <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono text-[#0B5D4B] outline-none cursor-not-allowed"
                  value={admissionNo}
                />
              </div>
              <span className="text-[10px] text-slate-400">System generated unique ID</span>
            </div>

            {/* Admission Form / Enquiry No */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Admission Form / Enquiry No</label>
                <span className="text-[10px] text-teal-600 font-bold uppercase">Optional</span>
              </div>
              <input
                type="text"
                placeholder="e.g. FORM-26-1003"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={enquiryNo}
                onChange={(e) => handleEnquiryLookup(e.target.value)}
              />
              <span className="text-[10px] text-slate-400 truncate block">
                Type & press Tab to auto-fill enquiry
              </span>
            </div>

            {/* Full Name */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student's Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="As shown on Birth Certificate or Aadhaar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <span className="text-[10px] text-slate-400">
                Will appear on marksheets, ID card, and CBSE portal
              </span>
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Father's Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Father's Legal Name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Full Name</label>
              <input
                type="text"
                placeholder="Mother's Legal Name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Aadhaar No (12 digit) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Aadhaar No. (12-Digit)
              </label>
              <input
                type="text"
                maxLength={14}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none font-mono"
                value={aadhaarNo}
                onChange={(e) => setAadhaarNo(e.target.value)}
              />
              <span className="text-[10px] text-slate-400">Stored with AES-256 masking</span>
            </div>

            {/* PEN Number (UDISE+) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  PEN No. (Permanent Education Number)
                </label>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                  UDISE+
                </span>
              </div>
              <input
                type="text"
                maxLength={11}
                placeholder="11-digit National PEN"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none font-mono"
                value={penNumber}
                onChange={(e) => setPenNumber(e.target.value)}
              />
              <span className="text-[10px] text-slate-500">
                Har student ka unique PEN number – agar transfer case nahi hai toh khali chhodein.
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Class & Academic Allocation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <School className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">2. Class & Academic Allocation</h3>
                <p className="text-xs text-slate-500">
                  Standard, section assigning, registration categories and affiliations
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
              Session: {activeSession}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admitted Class <span className="text-rose-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11-Sci">Class 11 (PCM/PCB)</option>
                <option value="Class 12-Sci">Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section / Group <span className="text-rose-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option value="Section A (Rose)">Section A (Rose) - [28/40 Seats]</option>
                <option value="Section B (Lotus)">Section B (Lotus) - [31/40 Seats]</option>
                <option value="Section C (Lily)">Section C (Lily) - [18/40 Seats]</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admission Status <span className="text-rose-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="Active">Active (Enrolled)</option>
                <option value="Provisional">Provisional (Docs Pending)</option>
                <option value="Awaiting Fee">Awaiting First Fee Clearance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS / RTE Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Religion</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
              >
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikh">Sikh</option>
                <option value="Christian">Christian</option>
                <option value="Jain">Jain</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nationality</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-500">
                  IN 🇮🇳
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Contact & Communication Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  3. Contact & Communication Details
                </h3>
                <p className="text-xs text-slate-500">
                  Primary parental contact for fee alerts, SMS, and emergency communications
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
              WhatsApp & SMS Gateway Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Primary Parent Mobile <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">WhatsApp Active</span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Fee receipts & attendance messages jaayenge
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alternate Contact No (ID Card)
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Guardian / Mother No."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                />
              </div>
              <span className="text-[10px] text-slate-400">Emergency contact on student card</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent Email</label>
              <input
                type="email"
                placeholder="parent.guardian@example.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Permanent Residential Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State / UT <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CARD 4: Transport Facility & Route Allocation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  4. Transport Facility & Route Allocation
                </h3>
                <p className="text-xs text-slate-500">
                  School bus pickup points, auto fee slab generation, and shifts
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
              Fleet Tracking: GPS Live Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Route & Stop
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={busRoute}
                onChange={(e) => handleRouteChange(e.target.value)}
              >
                <option value="self">Self / Parent Drop (No Bus Facility)</option>
                <option value="route1">Route #01 - Rajendra Nagar & Civil Lines (₹14,000/yr)</option>
                <option value="route4">Route #04 - Sector 62 via Model Town Gate 2 (₹18,000/yr)</option>
                <option value="route9">Route #09 - Crossing Republik & NH-24 (₹22,000/yr)</option>
                <option value="route12">Route #12 - City Center & Atta Market (₹16,500/yr)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Transport Fee (Session Total)
                </label>
                <span className="text-[10px] text-teal-700 font-bold">Auto-Calculated</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white outline-none"
                  value={transportFee}
                  onChange={(e) => setTransportFee(Number(e.target.value))}
                />
              </div>
              <span className="text-[10px] text-slate-400">
                0 = no fee (Bus suvidha na lene par ₹ 0 enter karein).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup & Drop Timing
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none cursor-pointer"
                value={pickupTiming}
                onChange={(e) => setPickupTiming(e.target.value)}
              >
                <option value="Both Ways (Morning Pickup + Afternoon Drop)">
                  Both Ways (Morning Pickup + Afternoon Drop)
                </option>
                <option value="Morning Pickup Only">Morning Pickup Only</option>
                <option value="Afternoon Drop Only">Afternoon Drop Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARDS 5 & 6: Side by side (Photo & Remarks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 5: Student Photograph (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#0B5D4B]" />
                  <h3 className="text-sm font-bold text-slate-900">Student Photograph</h3>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                  Smart ID Photo
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-emerald-900/20 hover:border-emerald-600 transition-colors rounded-xl p-6 bg-slate-50/60 flex flex-col items-center justify-center text-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={handlePhotoUpload}
                />

                {photoPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={photoPreview}
                      alt="Student Preview"
                      className="w-24 h-28 object-cover rounded-lg shadow-md ring-2 ring-[#0B5D4B]"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-rose-600 underline font-semibold z-20"
                    >
                      Remove / Change
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#0B5D4B]">
                      Choose Photo or Drag & Drop here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPG or PNG, max 2MB</p>
                    <p className="text-[10px] text-slate-400 italic mt-2">
                      White plain background recommended for CBSE identity card
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-crop & ID centering</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">35mm × 45mm</span>
            </div>
          </div>

          {/* Card 6: Office Remarks & Checklists (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#0B5D4B]" />
                  <h3 className="text-sm font-bold text-slate-900">Office Remarks & Checklists</h3>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                  Internal Verification
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Remarks / Sibling Reference / Medical Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-[#0B5D4B] outline-none resize-none"
                  value={specialRemarks}
                  onChange={(e) => setSpecialRemarks(e.target.value)}
                />
              </div>

              <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Administrative Compliance & Notification Checks
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={tcSubmitted}
                    onChange={(e) => setTcSubmitted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#0B5D4B] accent-[#0B5D4B]"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">
                      Original Transfer Certificate (TC) & Birth Certificate Submitted
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Hard copies filed in Admission Registry Section (File Locker #03)
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={sendWelcomeKit}
                    onChange={(e) => setSendWelcomeKit(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#0B5D4B] accent-[#0B5D4B]"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">
                      Send SMS & WhatsApp Welcome Kit to Registered Mobile
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Parent app portal login credentials and first fee challan will be dispatched immediately
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Confirmation Bar */}
        <div className="sticky bottom-10 z-30 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Fields marked with (<span className="text-rose-500 font-bold">*</span>) are mandatory as per state board guidelines & UDISE+ audit requirements.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              Save Draft (Ctrl+S)
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#0B5D4B] hover:bg-[#073B30] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Register Student</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
