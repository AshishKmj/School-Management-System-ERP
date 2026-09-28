export type Role = 'super_admin' | 'admin' | 'accountant' | 'teacher' | 'receptionist';

export type PermissionKey =
  | 'view_dashboard'
  | 'manage_students'
  | 'admit_student'
  | 'promote_student'
  | 'manage_enquiries'
  | 'edit_form_price'
  | 'manage_fee_structure'
  | 'collect_fees'
  | 'delete_fees'
  | 'view_fee_deletion_log'
  | 'manage_attendance'
  | 'manage_exams'
  | 'enter_marks'
  | 'view_results'
  | 'manage_expenses'
  | 'view_finance_reports'
  | 'manage_staff'
  | 'view_salary'
  | 'manage_payroll'
  | 'manage_notices'
  | 'manage_users'
  | 'view_activity_log'
  | 'manage_sessions'
  | 'backup_data'
  | 'admin_settings';

export interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  designation: string;
  createdAt: string;
}

export interface School {
  id: string;
  code: string;
  name: string;
  tagline: string;
  boardAffiliation: string;
  affiliationNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  tollFreeSupport: string;
  email: string;
  website: string;
  admissionPrefix: string;
  admissionFormPrice: number;
  logoUrl?: string;
  principalName: string;
  socialLinks: {
    youtube: string;
    facebook: string;
    instagram: string;
  };
}

export interface Session {
  id: string;
  schoolId: string;
  name: string; // e.g. "2027-28"
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
}

export interface ClassItem {
  id: string;
  schoolId: string;
  name: string; // e.g. "Nursery", "LKG", "UKG", "Class 1", "Class 10"
  order: number;
  sections: string[]; // ["A", "B", "C"]
  capacityPerSection: number;
}

export interface Section {
  id: string;
  classId: string;
  name: string; // "A"
  displayName: string; // "Rose", "Lotus"
  roomNumber?: string;
  classTeacherId?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  sessionId: string;
  admissionNo: string; // ADM-26-1022
  grNumber: string; // GR-2024-0891
  rollNo?: string;
  admissionFormNo?: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  aadhaarNo?: string;
  penNumber?: string; // UDISE+ 11-digit
  class: string; // e.g. "Class 5"
  section: string; // e.g. "Section A (Rose)"
  status: 'Active' | 'Provisional' | 'Awaiting Fee' | 'Passed Out';
  admissionDate: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  religion: string;
  nationality: string;
  parentPhone: string;
  altPhone?: string;
  parentEmail?: string;
  address: string;
  pincode: string;
  district: string;
  state: string;
  busRoute?: string;
  transportFee: number;
  pickupTiming?: string;
  photoUrl?: string;
  remarks?: string;
  isTcSubmitted?: boolean;
  totalFeeDue?: number;
  totalFeePaid?: number;
}

export interface Enquiry {
  id: string;
  schoolId: string;
  sessionId: string;
  formNumber: string; // FORM-26-1003
  studentName: string;
  fatherName: string;
  phone: string;
  targetClass: string;
  address: string;
  remarks: string;
  status: 'Form Issued' | 'Campus Tour Done' | 'Admitted' | 'Needs Document';
  formPrice: number;
  enquiryDate: string;
  followUpDate?: string;
  convertedStudentId?: string;
}

export type FeeFrequency = 'Monthly' | 'Quarterly' | 'Yearly' | 'One-time';

export interface FeeType {
  id: string;
  schoolId: string;
  sessionId: string;
  className: string; // "ALL" or specific class name
  name: string; // "Tuition Fee"
  amount: number;
  frequency: FeeFrequency;
  description?: string;
  dueDayOfMonth?: number;
}

export interface StudentFee {
  id: string;
  schoolId: string;
  sessionId: string;
  studentId: string;
  feeTypeId: string;
  feeName: string;
  amount: number;
  discount: number;
  fine: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  month?: string; // e.g. "Oct 2027"
  status: 'Paid' | 'Partial' | 'Pending';
}

export type PaymentMode = 'Cash' | 'UPI' | 'Cheque' | 'Bank' | 'Card' | 'NetBanking';

export interface Payment {
  id: string;
  receiptNo: string; // #DCE-9842 or RCPT-26-0001
  schoolId: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  admissionNo?: string;
  grNumber: string;
  rollNo?: string;
  fatherName?: string;
  className: string;
  section: string;
  amount: number;
  mode: PaymentMode;
  transactionRef?: string;
  paidAt: string;
  collectedBy: string;
  notes?: string;
  feeHeadsCovered: string[];
  subtotal?: number;
  discount?: number;
  lateFine?: number;
  transportFee?: number;
  advanceAdjusted?: number;
  balanceRemaining?: number;
  isDeleted?: boolean;
}

export interface FeeDeletionLog {
  id: string;
  paymentId: string;
  receiptNo: string;
  studentName: string;
  admissionNo?: string;
  grNumber?: string;
  className?: string;
  amount: number;
  paymentDate?: string;
  deletedBy: string;
  deletedByRole?: string;
  deletedAt: string;
  reason: string; // "Wrong Entry", "Cheque Bounced", "Duplicate Payment", "Student Left", "Other"
  remark?: string;
  canRestore: boolean;
  isRestored?: boolean;
  restoredAt?: string;
  restoredBy?: string;
  restoreReason?: string;
}

export interface Expense {
  id: string;
  schoolId: string;
  sessionId: string;
  voucherNo: string;
  category: 'Staff Payroll' | 'Utilities' | 'Maintenance' | 'Lab Equipment' | 'Sports' | 'Stationery' | 'Events' | 'Other';
  title: string;
  amount: number;
  expenseDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  paidTo: string;
  notes?: string;
  receiptUrl?: string;
  approvedBy: string;
}

export interface Staff {
  id: string;
  schoolId: string;
  employeeCode: string; // EMP-101
  fullName: string;
  role: 'Teacher' | 'Principal' | 'Accountant' | 'Receptionist' | 'Admin' | 'Support Staff';
  phone: string;
  email: string;
  qualification: string;
  joiningDate: string;
  basicSalary: number;
  allowances: number;
  status: 'Active' | 'On Leave' | 'Resigned';
  avatarUrl?: string;
}

export interface SalaryPayment {
  id: string;
  schoolId: string;
  sessionId: string;
  staffId: string;
  staffName: string;
  month: string; // e.g. "October 2027"
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
  paidDate?: string;
  mode?: 'Bank Transfer' | 'Cheque' | 'Cash';
  receiptNo?: string;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  sessionId: string;
  date: string; // YYYY-MM-DD
  class: string;
  section: string;
  studentId: string;
  status: 'P' | 'A' | 'L'; // Present, Absent, Late
  remarks?: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  category: 'Core' | 'Elective' | 'Language' | 'Co-Curricular';
}

export interface ClassSubject {
  id: string;
  schoolId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId?: string;
  teacherName?: string;
  weeklyPeriods: number;
}

export interface Exam {
  id: string;
  schoolId: string;
  sessionId: string;
  name: string; // e.g. "Term 1 Mid-Term Exam"
  type: 'Unit Test' | 'Half Yearly' | 'Final Annual' | 'Pre-Board';
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export interface ExamSchedule {
  id: string;
  examId: string;
  className: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
}

export interface Mark {
  id: string;
  examId: string;
  studentId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  remarks?: string;
}

export interface Notice {
  id: string;
  schoolId: string;
  sessionId: string;
  title: string;
  message: string;
  audience: 'All Parents & Faculty' | 'Teachers Only' | 'Parents Only' | 'Class-wise';
  targetClass?: string;
  priority: 'High' | 'Normal' | 'Urgent';
  publishedAt: string;
  author: string;
  isPublished: boolean;
}

export interface ActivityLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  category: 'AUTH' | 'STUDENT' | 'FEE' | 'EXAM' | 'FINANCE' | 'STAFF' | 'SYSTEM';
  details: string;
  timestamp: string;
  ipAddress?: string;
}
