import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { ToastContainer } from '../components/common/ToastContainer';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { QuickFeeCollectModal } from '../components/common/QuickFeeCollectModal';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  Archive,
  ArrowUpRight,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  Zap,
  MessageSquare,
  Trash2,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Award,
  BookOpen,
  Network,
  Calendar,
  ReceiptText,
  BarChart3,
  Scale,
  BadgeAlert,
  Wallet,
  FileText,
  Bell,
  ShieldCheck,
  History,
  FolderSync,
  Download,
  Settings,
  Sliders,
  KeyRound,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Headphones,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  Sparkles,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, role, switchRole, logout, can } = useAuthStore();
  const {
    theme,
    setTheme,
    activeSession,
    sessions,
    setActiveSession,
    school,
    sidebarCollapsed,
    toggleSidebar,
    sidebarCollapsedGroups,
    toggleSidebarGroup,
    ensureActiveGroupExpanded,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    setIsSearchOpen,
    openQuickFee,
  } = useAppStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [sessionMenuOpen, setSessionMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to determine exact route activity for nested paths (e.g. /students/*, /staff/*)
  const isRouteActive = (routePath: string, exact = false) => {
    const current = location.pathname;
    if (exact || routePath === '/dashboard') {
      return current === routePath || (routePath === '/dashboard' && current === '/');
    }
    if (current === routePath) return true;

    // Students nested route logic: /students highlights for /students or subpaths like /students/:id,
    // but not dedicated siblings like /students/new, /students/archive, /students/promotion, /students/session-report
    if (routePath === '/students') {
      return (
        current === '/students' ||
        (current.startsWith('/students/') &&
          !['/students/new', '/students/archive', '/students/promotion', '/students/session-report'].some(
            (sub) => current === sub || current.startsWith(sub + '/')
          ))
      );
    }

    // Staff nested route logic: /staff highlights for /staff or /staff/:id, but not /staff/salary or /staff/salary-report
    if (routePath === '/staff') {
      return (
        current === '/staff' ||
        (current.startsWith('/staff/') &&
          !['/staff/salary', '/staff/salary-report'].some(
            (sub) => current === sub || current.startsWith(sub + '/')
          ))
      );
    }

    // WhatsApp Reminder alias matching
    if (routePath === '/fees/whatsapp-reminder') {
      return (
        current === '/fees/whatsapp-reminder' ||
        current.startsWith('/fees/whatsapp-reminder/') ||
        current === '/fees/reminders' ||
        current.startsWith('/fees/reminders/')
      );
    }

    // Standard nested route checking with slash delimiter (/route/child)
    return current === routePath || current.startsWith(routePath + '/');
  };

  // Auto-expand group if current active route belongs to it, ensuring persistence across transitions
  useEffect(() => {
    ensureActiveGroupExpanded(location.pathname);
  }, [location.pathname, ensureActiveGroupExpanded]);

  const navItemClass = (targetPath: string, exact = false, specialColor?: 'green' | 'red' | 'purple' | 'orange') => {
    const active = isRouteActive(targetPath, exact);
    if (active) {
      if (specialColor === 'green') {
        return 'flex items-center justify-between px-3 py-2 rounded-xl transition-all bg-[#22C55E] text-white font-bold shadow-md';
      }
      if (specialColor === 'red') {
        return 'flex items-center justify-between px-3 py-2 rounded-xl transition-all bg-[#EF4444] text-white font-bold shadow-md';
      }
      if (specialColor === 'purple') {
        return 'flex items-center justify-between px-3 py-2 rounded-xl transition-all bg-[#A855F7] text-white font-bold shadow-md';
      }
      if (specialColor === 'orange') {
        return 'flex items-center justify-between px-3 py-2 rounded-xl transition-all bg-[#F59E0B] text-white font-bold shadow-md';
      }
      return 'flex items-center gap-3 px-3 py-2 rounded-xl transition-all bg-[#14B8A6] text-white font-bold shadow-md';
    }
    return 'flex items-center gap-3 px-3 py-2 rounded-xl text-teal-100 hover:bg-white/10 hover:text-white transition-all text-xs font-medium';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F6]">
      {/* ----------------- MOBILE DRAWER BACKDROP ----------------- */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#073B30]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* ----------------- SIDEBAR ----------------- */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-gradient-to-b from-[#0B5D4B] via-[#084B3D] to-[#073B30] text-white shadow-2xl transition-all duration-300 ${
          mobileDrawerOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-4 pb-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi-974d7W-4N2BFQiVhZ9V3wHkblJHeiHgorFPdc45KQBRaZpQGmWGQPt9JQzAyGYAG8Zkb4ZkUUAQd_FeFMcBZCB96KN7sVZs1HHGFsPT3fm6QTd1gT66CuAZrGcqbSusf0b5QCYappZtvZ_k_i2HUymY_RJJ2-EatQllgHhWOChqu8wyOK1k36oXPfd6ydlVxOCgstzuBhp6RSLK6EqNLK6mi6v2PneeiiFB_rHbCff3VL1BQN_ZzA"
              alt="Data Click Education Logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                  Data Click
                </span>
                <span className="text-[10px] text-teal-200 tracking-wider font-semibold uppercase leading-tight">
                  Management System
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Pill */}
        {!sidebarCollapsed ? (
          <div className="px-3.5 py-3 mx-3 my-2 bg-white/10 rounded-xl backdrop-blur-sm flex items-center gap-3 border border-white/10 shrink-0">
            <img
              src={
                user?.avatarUrl ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Ve3IAdeYd1bpyccNNfhBAqimg3SJtxwS4kaa1EU-vMP2t8hRFEmjkADOfVD4oyrndbIxVfq_zGTMj0-T0wWkQiz6PhqeyIX5DGxzRoo7_KFcUqpuxAExosCQVJtUKuHsVd56CQhmGSxUMqVhXzFlcZ_SryUiLKY3eDHalHuSXh8yDsg6yPTyxuwZmPMoX1Giq5pioVUdVqzWIUL8LUa_q75wQEQViI7koqaaVcUaA8zZ7hsXgmGvDA'
              }
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-300 shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-semibold tracking-wide">
                <span>★</span> {user?.designation || role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-3 flex justify-center shrink-0">
            <img
              src={user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Ve3IAdeYd1bpyccNNfhBAqimg3SJtxwS4kaa1EU-vMP2t8hRFEmjkADOfVD4oyrndbIxVfq_zGTMj0-T0wWkQiz6PhqeyIX5DGxzRoo7_KFcUqpuxAExosCQVJtUKuHsVd56CQhmGSxUMqVhXzFlcZ_SryUiLKY3eDHalHuSXh8yDsg6yPTyxuwZmPMoX1Giq5pioVUdVqzWIUL8LUa_q75wQEQViI7koqaaVcUaA8zZ7hsXgmGvDA'}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-300"
            />
          </div>
        )}

        {/* Scrollable Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-3 text-xs overflow-y-auto">
          {/* Group 1: MAIN */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => toggleSidebarGroup('main')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
              >
                <span>MAIN</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                    sidebarCollapsedGroups['main'] ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {(!sidebarCollapsedGroups['main'] || sidebarCollapsed) && (
              <div className="space-y-1">
                <NavLink
                  to="/dashboard"
                  className={() => navItemClass('/dashboard', true)}
                  title="Dashboard"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Dashboard</span>}
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Group 2: STUDENTS */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => toggleSidebarGroup('students')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>STUDENTS</span>
                  {sidebarCollapsedGroups['students'] &&
                    (location.pathname.startsWith('/students') || location.pathname.startsWith('/enquiries')) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                    sidebarCollapsedGroups['students'] ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {(!sidebarCollapsedGroups['students'] || sidebarCollapsed) && (
              <div className="space-y-1">
                {can('manage_enquiries') && (
                  <NavLink
                    to="/enquiries"
                    className={() => navItemClass('/enquiries')}
                    title="Admission Enquiry"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Admission Enquiry</span>}
                    </div>
                  </NavLink>
                )}
                {can('manage_students') && (
                  <NavLink
                    to="/students"
                    className={() => navItemClass('/students')}
                    title="All Students"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>All Students</span>}
                    </div>
                  </NavLink>
                )}
                {can('admit_student') && (
                  <NavLink
                    to="/students/new"
                    className={() => navItemClass('/students/new')}
                    title="New Admission"
                  >
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>New Admission</span>}
                    </div>
                  </NavLink>
                )}
                {can('manage_students') && (
                  <NavLink
                    to="/students/archive"
                    className={() => navItemClass('/students/archive')}
                    title="Passed Out Archive"
                  >
                    <div className="flex items-center gap-3">
                      <Archive className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Passed Out Archive</span>}
                    </div>
                  </NavLink>
                )}
                {can('promote_student') && (
                  <NavLink
                    to="/students/promotion"
                    className={() => navItemClass('/students/promotion')}
                    title="Promotion"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Promotion</span>}
                    </div>
                  </NavLink>
                )}
                <NavLink
                  to="/students/session-report"
                  className={() => navItemClass('/students/session-report', false, 'orange')}
                  title="Session Report"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />
                    {!sidebarCollapsed && <span>Session Report</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </NavLink>
              </div>
            )}
          </div>

          {/* Group 3: FEES */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => toggleSidebarGroup('fees')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>FEES</span>
                  {sidebarCollapsedGroups['fees'] && location.pathname.startsWith('/fees') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                    sidebarCollapsedGroups['fees'] ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {(!sidebarCollapsedGroups['fees'] || sidebarCollapsed) && (
              <div className="space-y-1">
                {can('manage_fee_structure') && (
                  <NavLink
                    to="/fees/structure"
                    className={() => navItemClass('/fees/structure')}
                    title="Fee Structure"
                  >
                    <div className="flex items-center gap-3">
                      <Receipt className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Fee Structure</span>}
                    </div>
                  </NavLink>
                )}
                {can('collect_fees') && (
                  <NavLink
                    to="/fees/collection"
                    className={() => navItemClass('/fees/collection')}
                    title="Fee Collection"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Fee Collection</span>}
                    </div>
                  </NavLink>
                )}
                {can('collect_fees') && (
                  <NavLink
                    to="/fees/quick"
                    className={() => navItemClass('/fees/quick', false, 'green')}
                    title="Quick Fee Collect (F2)"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-[#22C55E] shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="font-semibold text-emerald-300">Quick Fee Collect</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-[10px] bg-[#22C55E] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                        Fast
                      </span>
                    )}
                  </NavLink>
                )}
                <NavLink
                  to="/fees/whatsapp-reminder"
                  className={() => navItemClass('/fees/whatsapp-reminder', false, 'green')}
                  title="WhatsApp Reminder"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-[#22C55E] shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-emerald-200">WhatsApp Reminder</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </NavLink>
                {can('view_fee_deletion_log') && (
                  <NavLink
                    to="/fees/deletion-log"
                    className={() => navItemClass('/fees/deletion-log', false, 'red')}
                    title="Fee Deletion Log"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-rose-200">Fee Deletion Log</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-[10px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Audit
                      </span>
                    )}
                  </NavLink>
                )}
              </div>
            )}
          </div>

          {/* Group 4: ACADEMICS */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => toggleSidebarGroup('academics')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>ACADEMICS</span>
                  {sidebarCollapsedGroups['academics'] && location.pathname.startsWith('/academics') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                    sidebarCollapsedGroups['academics'] ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {(!sidebarCollapsedGroups['academics'] || sidebarCollapsed) && (
              <div className="space-y-1">
                <NavLink
                  to="/academics/attendance"
                  className={() => navItemClass('/academics/attendance')}
                  title="Attendance"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Attendance</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/attendance-report"
                  className={() => navItemClass('/academics/attendance-report')}
                  title="Attendance Report"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Attendance Report</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/exams"
                  className={() => navItemClass('/academics/exams')}
                  title="Exams"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Exams</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/marks-entry"
                  className={() => navItemClass('/academics/marks-entry')}
                  title="Marks Entry"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Marks Entry</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/class-result"
                  className={() => navItemClass('/academics/class-result')}
                  title="Class Result"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Class Result</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/subjects"
                  className={() => navItemClass('/academics/subjects')}
                  title="Subjects"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Subjects</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/class-subject-map"
                  className={() => navItemClass('/academics/class-subject-map')}
                  title="Class-Subject Map"
                >
                  <div className="flex items-center gap-3">
                    <Network className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Class-Subject Map</span>}
                  </div>
                </NavLink>
                <NavLink
                  to="/academics/exam-schedule"
                  className={() => navItemClass('/academics/exam-schedule')}
                  title="Exam Schedule"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Exam Schedule</span>}
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Group 5: FINANCE */}
          {can('view_finance_reports') && (
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleSidebarGroup('finance')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>FINANCE</span>
                    {sidebarCollapsedGroups['finance'] && location.pathname.startsWith('/finance') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                      sidebarCollapsedGroups['finance'] ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              )}
              {(!sidebarCollapsedGroups['finance'] || sidebarCollapsed) && (
                <div className="space-y-1">
                  <NavLink
                    to="/finance/expenses"
                    className={() => navItemClass('/finance/expenses')}
                    title="Expenses"
                  >
                    <div className="flex items-center gap-3">
                      <ReceiptText className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Expenses</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/finance/reports"
                    className={() => navItemClass('/finance/reports')}
                    title="Reports"
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Reports</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/finance/income-vs-expense"
                    className={() => navItemClass('/finance/income-vs-expense', false, 'purple')}
                    title="Income vs Expense"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-[#A855F7] shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-purple-200">Income vs Expense</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-[10px] bg-[#A855F7] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                        Live
                      </span>
                    )}
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Group 6: STAFF / PAYROLL */}
          {can('manage_staff') && (
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleSidebarGroup('staff')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>STAFF / PAYROLL</span>
                    {sidebarCollapsedGroups['staff'] && location.pathname.startsWith('/staff') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                      sidebarCollapsedGroups['staff'] ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              )}
              {(!sidebarCollapsedGroups['staff'] || sidebarCollapsed) && (
                <div className="space-y-1">
                  <NavLink
                    to="/staff"
                    className={() => navItemClass('/staff')}
                    title="Staff Management"
                  >
                    <div className="flex items-center gap-3">
                      <BadgeAlert className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Staff Management</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/staff/salary"
                    className={() => navItemClass('/staff/salary')}
                    title="Salary Management"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Salary Management</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/staff/salary-report"
                    className={() => navItemClass('/staff/salary-report')}
                    title="Salary Report"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Salary Report</span>}
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Group 7: COMMUNICATION */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => toggleSidebarGroup('communication')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>COMMUNICATION</span>
                  {sidebarCollapsedGroups['communication'] && location.pathname.startsWith('/notices') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                    sidebarCollapsedGroups['communication'] ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {(!sidebarCollapsedGroups['communication'] || sidebarCollapsed) && (
              <div className="space-y-1">
                <NavLink
                  to="/notices"
                  className={() => navItemClass('/notices')}
                  title="Notices"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Notices</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded-full">
                      3 New
                    </span>
                  )}
                </NavLink>
              </div>
            )}
          </div>

          {/* Group 8: ADMIN */}
          {can('admin_settings') && (
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleSidebarGroup('admin')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>ADMIN</span>
                    {sidebarCollapsedGroups['admin'] && location.pathname.startsWith('/admin') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                      sidebarCollapsedGroups['admin'] ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              )}
              {(!sidebarCollapsedGroups['admin'] || sidebarCollapsed) && (
                <div className="space-y-1">
                  <NavLink
                    to="/admin/permissions"
                    className={() => navItemClass('/admin/permissions')}
                    title="Users & Permissions"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Users & Permissions</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/admin/activity-log"
                    className={() => navItemClass('/admin/activity-log')}
                    title="Activity Log"
                  >
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Activity Log</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/admin/sessions"
                    className={() => navItemClass('/admin/sessions')}
                    title="Sessions"
                  >
                    <div className="flex items-center gap-3">
                      <FolderSync className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Sessions</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/admin/backup"
                    className={() => navItemClass('/admin/backup')}
                    title="Backup & Download"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Backup & Download</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/admin/settings"
                    className={() => navItemClass('/admin/settings')}
                    title="Admin Settings"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Admin Settings</span>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/admin/preferences"
                    className={() => navItemClass('/admin/preferences')}
                    title="Settings"
                  >
                    <div className="flex items-center gap-3">
                      <Sliders className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Settings</span>}
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Group 9: ACCOUNT */}
          <div className="space-y-1 pt-2 pb-6 border-t border-white/10">
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => toggleSidebarGroup('account')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-200/70 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>ACCOUNT</span>
                  {sidebarCollapsedGroups['account'] && location.pathname.startsWith('/account') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-300/60 group-hover:text-white transition-transform duration-200 ${
                    sidebarCollapsedGroups['account'] ? '-rotate-90' : 'rotate-0'
                  }`}
                />
              </button>
            )}
            {(!sidebarCollapsedGroups['account'] || sidebarCollapsed) && (
              <div className="space-y-1">
                <NavLink
                  to="/account/password"
                  className={() => navItemClass('/account/password')}
                  title="Password Change"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Password Change</span>}
                  </div>
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#F87171] hover:bg-rose-500/10 hover:text-rose-300 transition-all text-xs font-semibold cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>Logout</span>}
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* ----------------- MAIN WRAPPER ----------------- */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-4 sm:px-6 flex items-center justify-between gap-4 border-b border-emerald-950/5">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Hamburger toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* School & Dashboard Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                  {school.name}
                </h1>
                <p className="text-[11px] text-slate-500 leading-tight truncate hidden sm:block">
                  {school.boardAffiliation} • {school.affiliationNumber}
                </p>
              </div>
            </div>

            {/* Global Search trigger bar (Cmd+K) */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="relative flex-1 max-w-md hidden md:flex items-center bg-slate-100 hover:bg-slate-200/70 cursor-pointer rounded-lg px-3 py-2 text-xs text-slate-500 transition-colors ml-2"
            >
              <Search className="w-4 h-4 mr-2 text-slate-400" />
              <span className="truncate">Search Student by GR No., Name, Phone... [Ctrl+K]</span>
              <kbd className="ml-auto text-[10px] font-semibold bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-300">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Academic Session Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSessionMenuOpen(!sessionMenuOpen)}
                className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full text-xs text-slate-700 font-semibold transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0B5D4B]" />
                <span>Academic Year:</span>
                <span className="font-bold text-slate-900">{activeSession}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {sessionMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                    Switch Session
                  </div>
                  {sessions.map((ses) => (
                    <button
                      key={ses.id}
                      onClick={() => {
                        setActiveSession(ses.name);
                        setSessionMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        ses.name === activeSession
                          ? 'font-bold text-emerald-900 bg-emerald-50/70'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{ses.name}</span>
                      {ses.name === activeSession && (
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded-full">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3 Theme Dots (Emerald / Indigo / Berry) */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-full border border-slate-200">
              <button
                onClick={() => setTheme('berry')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 transition-all ${
                  theme === 'berry'
                    ? 'ring-2 ring-purple-600 ring-offset-1 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Berry Twilight Theme"
              />
              <button
                onClick={() => setTheme('emerald')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 transition-all ${
                  theme === 'emerald'
                    ? 'ring-2 ring-emerald-600 ring-offset-1 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Emerald School Theme (Active)"
              />
              <button
                onClick={() => setTheme('indigo')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-700 to-blue-900 transition-all ${
                  theme === 'indigo'
                    ? 'ring-2 ring-indigo-700 ring-offset-1 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Royal Indigo-Navy Theme"
              />
            </div>

            {/* Quick Fee Collect Action shortcut */}
            <button
              onClick={() => openQuickFee()}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              title="Quick Fee Collect [F2]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Collect</span>
              <kbd className="text-[9px] bg-white/20 px-1 rounded">F2</kbd>
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notices')}
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Notices"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Profile Dropdown & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="User & Role Switching"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Ve3IAdeYd1bpyccNNfhBAqimg3SJtxwS4kaa1EU-vMP2t8hRFEmjkADOfVD4oyrndbIxVfq_zGTMj0-T0wWkQiz6PhqeyIX5DGxzRoo7_KFcUqpuxAExosCQVJtUKuHsVd56CQhmGSxUMqVhXzFlcZ_SryUiLKY3eDHalHuSXh8yDsg6yPTyxuwZmPMoX1Giq5pioVUdVqzWIUL8LUa_q75wQEQViI7koqaaVcUaA8zZ7hsXgmGvDA'
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Role: {role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                    Instant Demo Role Switcher
                  </div>
                  <button
                    onClick={() => {
                      switchRole('super_admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      role === 'super_admin' ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Super Administrator</span>
                    {role === 'super_admin' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      role === 'admin' ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Principal (Admin)</span>
                    {role === 'admin' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('accountant');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      role === 'accountant' ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Accountant</span>
                    {role === 'accountant' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('teacher');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      role === 'teacher' ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Teacher / Faculty</span>
                    {role === 'teacher' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('receptionist');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      role === 'receptionist' ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Receptionist / Front Desk</span>
                    {role === 'receptionist' && <span>✓</span>}
                  </button>

                  <div className="border-t border-slate-100 mt-2 pt-1">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        navigate('/admin/permissions');
                      }}
                      className="w-full text-left px-4 py-1.5 text-slate-700 hover:bg-slate-100"
                    >
                      Permissions Matrix
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-1.5 text-rose-600 hover:bg-rose-50 font-semibold"
                    >
                      Logout Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Primary Page Content */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 pb-20">
          <Outlet />
        </main>

        {/* ----------------- FIXED NAVY FOOTER BAR ----------------- */}
        <footer className="fixed bottom-0 inset-x-0 lg:left-64 h-10 bg-[#1E1B6B] text-[#E0E7FF] z-30 px-4 sm:px-6 flex items-center justify-between text-xs shadow-[0_-2px_10px_rgba(0,0,0,0.15)] transition-all duration-300">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={`tel:${school.tollFreeSupport || '+919876543210'}`}
              className="flex items-center gap-1.5 text-white font-medium hover:text-teal-300 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-teal-300" />
              <span>{school.tollFreeSupport || '+91 98765 43210'}</span>
              <span className="text-[10px] text-indigo-300 hidden sm:inline">(Toll-Free Support)</span>
            </a>
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-200 hover:text-white underline decoration-indigo-400 transition-colors hidden sm:flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-indigo-300" />
              <span>dataclick.edu.in</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Need help? Click here ya WhatsApp karein support team ko</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={school.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={school.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={school.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <GlobalSearchModal />
      <QuickFeeCollectModal />
    </div>
  );
};
