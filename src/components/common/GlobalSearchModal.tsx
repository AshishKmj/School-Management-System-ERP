import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useDataStore } from '../../store/useDataStore';
import { Search, UserCheck, CreditCard, BookOpen, Settings, X, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openQuickFee } = useAppStore();
  const { students } = useDataStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'F2') {
        e.preventDefault();
        openQuickFee();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen, openQuickFee]);

  if (!isSearchOpen) return null;

  const filteredStudents = query.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(query.toLowerCase()) ||
          s.grNumber.toLowerCase().includes(query.toLowerCase()) ||
          s.admissionNo.toLowerCase().includes(query.toLowerCase()) ||
          s.parentPhone.includes(query) ||
          s.class.toLowerCase().includes(query.toLowerCase())
      )
    : students.slice(0, 4);

  const quickPages = [
    { title: 'New Student Admission', path: '/students/new', icon: <UserCheck className="w-4 h-4 text-emerald-600" /> },
    { title: 'Quick Fee Collect', path: '#quick-fee', isQuickFee: true, icon: <CreditCard className="w-4 h-4 text-teal-600" /> },
    { title: 'Fee Structure Master', path: '/fees/structure', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
    { title: 'Attendance Register', path: '/academics/attendance', icon: <BookOpen className="w-4 h-4 text-amber-600" /> },
    { title: 'Institution Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4 text-purple-600" /> },
  ].filter((p) => !query || p.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelectPage = (page: (typeof quickPages)[0]) => {
    setIsSearchOpen(false);
    if (page.isQuickFee) {
      openQuickFee();
    } else {
      navigate(page.path);
    }
  };

  const handleSelectStudent = (student: (typeof students)[0]) => {
    setIsSearchOpen(false);
    navigate(`/students?search=${encodeURIComponent(student.grNumber)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#073B30]/65 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      />
      <div className="flex min-h-full items-start justify-center p-4 pt-20">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              placeholder="Search student by GR No., Name, Phone, or system page... (ESC to close)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {/* Quick Pages */}
            {quickPages.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                  Quick Navigation
                </span>
                <div className="space-y-1">
                  {quickPages.map((page) => (
                    <button
                      key={page.title}
                      onClick={() => handleSelectPage(page)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors text-sm font-medium group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          {page.icon}
                        </div>
                        <span>{page.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Students results */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Students ({filteredStudents.length})
              </span>
              {filteredStudents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No matching student records found for "{query}".
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectStudent(s)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors text-xs border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {s.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {s.fullName}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {s.grNumber} • {s.class} ({s.section}) • Ph: {s.parentPhone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.status}
                        </span>
                        {s.totalFeeDue ? (
                          <div className="text-[11px] font-bold text-rose-600 mt-0.5">
                            Due: ₹{s.totalFeeDue}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono">F2</kbd> anywhere for Quick Fee Desk POS
            </span>
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono">ESC</kbd> to exit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
