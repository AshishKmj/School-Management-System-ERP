import {
  School,
  Session,
  User,
  Student,
  Enquiry,
  FeeType,
  Payment,
  FeeDeletionLog,
  Expense,
  Staff,
  Notice,
  ActivityLog,
  Role,
  PermissionKey,
} from '../types';
import {
  INITIAL_SCHOOL,
  INITIAL_SESSIONS,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_ENQUIRIES,
  INITIAL_FEE_TYPES,
  INITIAL_PAYMENTS,
  INITIAL_DELETION_LOGS,
  INITIAL_EXPENSES,
  INITIAL_STAFF,
  INITIAL_NOTICES,
  INITIAL_ACTIVITY_LOGS,
  ROLE_PERMISSIONS,
} from './mockData';

const STORAGE_KEYS = {
  SCHOOL: 'dc_school_v1',
  SESSIONS: 'dc_sessions_v1',
  USERS: 'dc_users_v1',
  STUDENTS: 'dc_students_v1',
  ENQUIRIES: 'dc_enquiries_v1',
  FEE_TYPES: 'dc_fee_types_v1',
  PAYMENTS: 'dc_payments_v1',
  DELETION_LOGS: 'dc_fee_deletions_v1',
  EXPENSES: 'dc_expenses_v1',
  STAFF: 'dc_staff_v1',
  NOTICES: 'dc_notices_v1',
  ACTIVITY_LOGS: 'dc_activity_logs_v1',
  PERMISSIONS: 'dc_permissions_v1',
};

// Generic storage read helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Generic storage write helper
function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// ----------------- Data Access Services -----------------

export async function fetchSchool(): Promise<School> {
  return getStored<School>(STORAGE_KEYS.SCHOOL, INITIAL_SCHOOL);
}

export async function updateSchoolData(school: Partial<School>): Promise<School> {
  const current = await fetchSchool();
  const updated = { ...current, ...school };
  setStored(STORAGE_KEYS.SCHOOL, updated);
  return updated;
}

export async function fetchSessions(): Promise<Session[]> {
  return getStored<Session[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
}

export async function fetchActiveSession(): Promise<Session> {
  const sessions = await fetchSessions();
  return sessions.find((s) => s.isActive) || sessions[0];
}

export async function createSession(name: string, startDate: string, endDate: string): Promise<Session> {
  const sessions = await fetchSessions();
  const newSession: Session = {
    id: `ses_${Date.now()}`,
    schoolId: INITIAL_SCHOOL.id,
    name,
    startDate,
    endDate,
    isActive: false,
    isClosed: false,
  };
  sessions.push(newSession);
  setStored(STORAGE_KEYS.SESSIONS, sessions);
  return newSession;
}

export async function setActiveSessionId(sessionId: string): Promise<Session[]> {
  const sessions = await fetchSessions();
  const updated = sessions.map((s) => ({
    ...s,
    isActive: s.id === sessionId,
  }));
  setStored(STORAGE_KEYS.SESSIONS, updated);
  return updated;
}

export async function fetchStudents(schoolId?: string, sessionId?: string): Promise<Student[]> {
  const list = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  if (sessionId) {
    return list.filter((s) => s.sessionId === sessionId);
  }
  return list;
}

export async function saveStudent(student: Omit<Student, 'id'>): Promise<Student> {
  const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  const newStudent: Student = {
    ...student,
    id: `std_${Date.now()}`,
  };
  students.unshift(newStudent);
  setStored(STORAGE_KEYS.STUDENTS, students);
  return newStudent;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
  const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...updates };
  setStored(STORAGE_KEYS.STUDENTS, students);
  return students[idx];
}

export async function fetchEnquiries(sessionId?: string): Promise<Enquiry[]> {
  const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  if (sessionId) {
    return list.filter((e) => e.sessionId === sessionId);
  }
  return list;
}

export async function saveEnquiry(enquiry: Omit<Enquiry, 'id' | 'formNumber'>): Promise<Enquiry> {
  const enquiries = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  const count = enquiries.length + 1001;
  const newEnq: Enquiry = {
    ...enquiry,
    id: `enq_${Date.now()}`,
    formNumber: `FORM-26-${count}`,
  };
  enquiries.unshift(newEnq);
  setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
  return newEnq;
}

export async function updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> {
  const enquiries = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  const idx = enquiries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  enquiries[idx] = { ...enquiries[idx], ...updates };
  setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
  return enquiries[idx];
}

export async function fetchFeeTypes(sessionId?: string): Promise<FeeType[]> {
  const list = getStored<FeeType[]>(STORAGE_KEYS.FEE_TYPES, INITIAL_FEE_TYPES);
  if (sessionId) {
    return list.filter((f) => f.sessionId === sessionId);
  }
  return list;
}

export async function saveFeeType(fee: Omit<FeeType, 'id'>): Promise<FeeType> {
  const feeTypes = getStored<FeeType[]>(STORAGE_KEYS.FEE_TYPES, INITIAL_FEE_TYPES);
  const newFee: FeeType = {
    ...fee,
    id: `ft_${Date.now()}`,
  };
  feeTypes.unshift(newFee);
  setStored(STORAGE_KEYS.FEE_TYPES, feeTypes);
  return newFee;
}

export async function deleteFeeType(id: string): Promise<boolean> {
  const feeTypes = getStored<FeeType[]>(STORAGE_KEYS.FEE_TYPES, INITIAL_FEE_TYPES);
  const filtered = feeTypes.filter((f) => f.id !== id);
  setStored(STORAGE_KEYS.FEE_TYPES, filtered);
  return true;
}

export async function fetchPayments(sessionId?: string): Promise<Payment[]> {
  const list = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  const active = list.filter((p) => !p.isDeleted);
  if (sessionId) {
    return active.filter((p) => p.sessionId === sessionId);
  }
  return active;
}

export async function savePayment(payment: Omit<Payment, 'id' | 'receiptNo' | 'paidAt'>): Promise<Payment> {
  const payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  const nextNum = 9840 + payments.length + 1;
  const newPayment: Payment = {
    ...payment,
    id: `pay_${Date.now()}`,
    receiptNo: `#DCE-${nextNum}`,
    paidAt: new Date().toISOString(),
  };
  payments.unshift(newPayment);
  setStored(STORAGE_KEYS.PAYMENTS, payments);

  // Update student totalFeePaid
  const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  const studentIdx = students.findIndex((s) => s.id === payment.studentId);
  if (studentIdx !== -1) {
    const student = students[studentIdx];
    const prevPaid = student.totalFeePaid || 0;
    const prevDue = student.totalFeeDue || 0;
    students[studentIdx] = {
      ...student,
      totalFeePaid: prevPaid + payment.amount,
      totalFeeDue: Math.max(0, prevDue - payment.amount),
    };
    setStored(STORAGE_KEYS.STUDENTS, students);
  }

  return newPayment;
}

export async function softDeletePayment(
  paymentId: string,
  reason: string,
  remark: string,
  deletedBy: string,
  deletedByRole?: string
): Promise<boolean> {
  const payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  const deletionLogs = getStored<FeeDeletionLog[]>(STORAGE_KEYS.DELETION_LOGS, INITIAL_DELETION_LOGS);

  const pIndex = payments.findIndex((p) => p.id === paymentId);
  if (pIndex === -1) return false;

  const payment = payments[pIndex];
  payment.isDeleted = true;
  payments[pIndex] = payment;
  setStored(STORAGE_KEYS.PAYMENTS, payments);

  // Reverse student balance: add back to due, subtract from paid
  const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  const sIndex = students.findIndex((s) => s.id === payment.studentId);
  if (sIndex !== -1) {
    const student = students[sIndex];
    students[sIndex] = {
      ...student,
      totalFeePaid: Math.max(0, (student.totalFeePaid || 0) - payment.amount),
      totalFeeDue: (student.totalFeeDue || 0) + payment.amount,
    };
    setStored(STORAGE_KEYS.STUDENTS, students);
  }

  const logEntry: FeeDeletionLog = {
    id: `del_${Date.now()}`,
    paymentId: payment.id,
    receiptNo: payment.receiptNo,
    studentName: payment.studentName,
    admissionNo: payment.admissionNo || (sIndex !== -1 ? students[sIndex].admissionNo : undefined),
    grNumber: payment.grNumber,
    className: payment.className,
    amount: payment.amount,
    paymentDate: payment.paidAt,
    deletedBy,
    deletedByRole: deletedByRole || 'Admin',
    deletedAt: new Date().toISOString(),
    reason,
    remark,
    canRestore: true,
    isRestored: false,
  };
  deletionLogs.unshift(logEntry);
  setStored(STORAGE_KEYS.DELETION_LOGS, deletionLogs);

  return true;
}

export async function restoreDeletedPayment(
  logId: string,
  restoredBy: string,
  restoreReason?: string
): Promise<boolean> {
  const deletionLogs = getStored<FeeDeletionLog[]>(STORAGE_KEYS.DELETION_LOGS, INITIAL_DELETION_LOGS);
  const payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);

  const logIndex = deletionLogs.findIndex((l) => l.id === logId);
  if (logIndex === -1) return false;

  const log = deletionLogs[logIndex];
  const pIndex = payments.findIndex((p) => p.id === log.paymentId);
  if (pIndex !== -1) {
    payments[pIndex].isDeleted = false;
    setStored(STORAGE_KEYS.PAYMENTS, payments);

    // Re-apply student balance: add to paid, subtract from due
    const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const sIndex = students.findIndex((s) => s.id === payments[pIndex].studentId);
    if (sIndex !== -1) {
      const student = students[sIndex];
      students[sIndex] = {
        ...student,
        totalFeePaid: (student.totalFeePaid || 0) + payments[pIndex].amount,
        totalFeeDue: Math.max(0, (student.totalFeeDue || 0) - payments[pIndex].amount),
      };
      setStored(STORAGE_KEYS.STUDENTS, students);
    }
  }

  log.isRestored = true;
  log.canRestore = false;
  log.restoredAt = new Date().toISOString();
  log.restoredBy = restoredBy;
  log.restoreReason = restoreReason || 'Administrative approval';
  deletionLogs[logIndex] = log;
  setStored(STORAGE_KEYS.DELETION_LOGS, deletionLogs);

  return true;
}

export async function fetchFeeDeletionLogs(): Promise<FeeDeletionLog[]> {
  return getStored<FeeDeletionLog[]>(STORAGE_KEYS.DELETION_LOGS, INITIAL_DELETION_LOGS);
}

export async function fetchExpenses(sessionId?: string): Promise<Expense[]> {
  const list = getStored<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  if (sessionId) {
    return list.filter((e) => e.sessionId === sessionId);
  }
  return list;
}

export async function saveExpense(expense: Omit<Expense, 'id' | 'voucherNo'>): Promise<Expense> {
  const expenses = getStored<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  const nextNum = 100 + expenses.length + 1;
  const newExpense: Expense = {
    ...expense,
    id: `exp_${Date.now()}`,
    voucherNo: `VCH-2027-0${nextNum}`,
  };
  expenses.unshift(newExpense);
  setStored(STORAGE_KEYS.EXPENSES, expenses);
  return newExpense;
}

export async function fetchStaff(): Promise<Staff[]> {
  return getStored<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
}

export async function saveStaff(staffMember: Omit<Staff, 'id' | 'employeeCode'>): Promise<Staff> {
  const staff = getStored<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  const nextCode = `EMP-${100 + staff.length + 1}`;
  const newMember: Staff = {
    ...staffMember,
    id: `stf_${Date.now()}`,
    employeeCode: nextCode,
  };
  staff.unshift(newMember);
  setStored(STORAGE_KEYS.STAFF, staff);
  return newMember;
}

export async function fetchNotices(sessionId?: string): Promise<Notice[]> {
  const list = getStored<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  if (sessionId) {
    return list.filter((n) => n.sessionId === sessionId);
  }
  return list;
}

export async function saveNotice(notice: Omit<Notice, 'id' | 'publishedAt'>): Promise<Notice> {
  const notices = getStored<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  const newNotice: Notice = {
    ...notice,
    id: `not_${Date.now()}`,
    publishedAt: new Date().toISOString(),
  };
  notices.unshift(newNotice);
  setStored(STORAGE_KEYS.NOTICES, notices);
  return newNotice;
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  return getStored<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
}

export async function addActivityLog(
  userId: string,
  userName: string,
  userRole: Role,
  action: string,
  category: ActivityLog['category'],
  details: string
): Promise<void> {
  const logs = getStored<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  const newLog: ActivityLog = {
    id: `log_${Date.now()}`,
    schoolId: INITIAL_SCHOOL.id,
    userId,
    userName,
    userRole,
    action,
    category,
    details,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  setStored(STORAGE_KEYS.ACTIVITY_LOGS, logs.slice(0, 500)); // maintain max 500 recent logs
}

export async function fetchUsers(): Promise<User[]> {
  return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export async function fetchPermissions(): Promise<Record<Role, PermissionKey[]>> {
  return getStored<Record<Role, PermissionKey[]>>(STORAGE_KEYS.PERMISSIONS, ROLE_PERMISSIONS);
}

export async function updateRolePermissionsMatrix(matrix: Record<Role, PermissionKey[]>): Promise<void> {
  setStored(STORAGE_KEYS.PERMISSIONS, matrix);
}

export async function resetAllDataToDefault(): Promise<void> {
  localStorage.clear();
}
