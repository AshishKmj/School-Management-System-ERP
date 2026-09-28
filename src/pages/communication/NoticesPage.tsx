import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDate } from '../../utils/formatters';
import { Bell, Plus, Search, Calendar, Users, Eye, EyeOff } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const NoticesPage: React.FC = () => {
  const { notices, addNotice } = useDataStore();
  const { school, showToast } = useAppStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All Parents & Faculty' | 'Teachers Only' | 'Parents Only' | 'Class-wise'>('All Parents & Faculty');
  const [isPublished, setIsPublished] = useState(true);

  const filtered = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAudience = audienceFilter === 'ALL' || n.audience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast({ message: 'Title and notice content are required.', type: 'warning' });
      return;
    }

    await addNotice(
      {
        schoolId: school.id,
        sessionId: '2027-28',
        title,
        message,
        audience: targetAudience,
        priority: 'Normal',
        isPublished,
        author: user?.name || 'Administrative Office',
      },
      user?.name || 'Administrator'
    );

    setIsAddOpen(false);
    showToast({
      title: 'Notice Broadcasted',
      message: `Circular "${title}" posted to ${targetAudience} notice board.`,
      type: 'success',
    });

    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              Campus Bulletin
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Circulars & Notices</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official circulars, exam dates, vacation schedules, and parent announcements
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Circular</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        <select
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
        >
          <option value="ALL">All Audiences</option>
          <option value="All Parents & Faculty">All Parents & Faculty</option>
          <option value="Teachers Only">Teachers Only</option>
          <option value="Parents Only">Parents Only</option>
          <option value="Class-wise">Class-wise</option>
        </select>
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-950/5 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-bold text-xs">
                  {item.audience}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {formatDate(item.publishedAt)}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Author: <strong className="text-slate-800">{item.author}</strong></span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <Eye className="w-3.5 h-3.5" />
                Live on Portal
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Draft Official Campus Circular"
        subtitle="Broadcast to student, parent, or staff portals"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Notice Subject / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CBSE Practical Exam Schedule Class 10 & 12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option value="All Parents & Faculty">All Campus (Parents, Students & Teachers)</option>
              <option value="Parents Only">Parents Only</option>
              <option value="Teachers Only">Teachers & Faculty Only</option>
              <option value="Class-wise">Class-wise Specific</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Notice Body *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write the full notice circular message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
            />
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
              Post Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
