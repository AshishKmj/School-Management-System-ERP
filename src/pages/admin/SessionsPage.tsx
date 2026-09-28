import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FolderSync, Plus, CheckCircle2, Lock, Calendar, Star } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const SessionsPage: React.FC = () => {
  const { sessions, activeSession, setActiveSession, addSession, showToast, school } = useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [sessionName, setSessionName] = useState('2028-29');
  const [startDate, setStartDate] = useState('2028-04-01');
  const [endDate, setEndDate] = useState('2029-03-31');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    addSession({
      id: `sess_${Date.now()}`,
      schoolId: school.id,
      name: sessionName.trim(),
      startDate,
      endDate,
      isActive: false,
      isClosed: false,
    });

    setIsAddOpen(false);
    showToast({
      title: 'Academic Session Created',
      message: `Academic year ${sessionName} initialized in institutional repository.`,
      type: 'success',
    });
  };

  const handleSwitchSession = (name: string) => {
    setActiveSession(name);
    showToast({
      title: 'Active Session Switched',
      message: `Campus operations ledger now scoped to academic session ${name}.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Multi-Year Architecture
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Sessions Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure financial and academic years, switch active ledgers, and freeze archived sessions
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic Session</span>
        </button>
      </div>

      {/* Grid of Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((sess) => {
          const isCurrentActive = activeSession === sess.name;

          return (
            <div
              key={sess.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-emerald-950/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      isCurrentActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Session {sess.name}
                  </span>
                  {isCurrentActive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Academic Cycle {sess.name}
                </h4>

                <div className="space-y-1 text-xs text-slate-500 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Start: <strong className="text-slate-700">{sess.startDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Concludes: <strong className="text-slate-700">{sess.endDate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {sess.isClosed ? 'Archived (Read Only)' : 'Writable Ledger'}
                </span>

                {!isCurrentActive ? (
                  <button
                    onClick={() => handleSwitchSession(sess.name)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                  >
                    Activate Session
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-lg">
                    Current Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Academic Session"
        subtitle="Initialize session database namespace"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Session Nomenclature (e.g. 2028-29) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2028-29"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Session Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Session End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              Initialize Session
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
