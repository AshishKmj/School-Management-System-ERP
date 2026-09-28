import React, { useState } from 'react';
import { useAppStore, AppTheme } from '../../store/useAppStore';
import { Sliders, Palette, Globe, Bell, Check, Sparkles } from 'lucide-react';

export const PreferencesPage: React.FC = () => {
  const { theme, setTheme, showToast } = useAppStore();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [compactDensity, setCompactDensity] = useState(false);

  const handleSelectTheme = (t: AppTheme) => {
    setTheme(t);
    showToast({
      title: 'Visual Theme Applied',
      message: `System interface switched to ${t.toUpperCase()} colorway.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Workstation Experience
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Preferences & Display</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize your workspace palette, regional language dialect, and audio notification sounds
          </p>
        </div>
      </div>

      {/* Theme Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Palette className="w-4 h-4 text-emerald-600" />
          <span>Active Interface Theme</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Emerald */}
          <div
            onClick={() => handleSelectTheme('emerald')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'emerald'
                ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#0B5D4B]" />
                  <span className="w-4 h-4 rounded-full bg-[#14B8A6]" />
                </div>
                {theme === 'emerald' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Emerald School</h4>
              <p className="text-xs text-slate-500 mt-1">
                Classic deep forest green gradient with active teal pill and mint background
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-emerald-800 font-bold uppercase">
              Standard Institution
            </div>
          </div>

          {/* Purple / Berry */}
          <div
            onClick={() => handleSelectTheme('berry')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'berry'
                ? 'border-purple-600 bg-purple-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#581C87]" />
                  <span className="w-4 h-4 rounded-full bg-[#EC4899]" />
                </div>
                {theme === 'berry' && (
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Purple & Berry Twilight</h4>
              <p className="text-xs text-slate-500 mt-1">
                Vibrant deep amethyst sidebar with bright fuchsia badges and high-contrast accents
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-purple-800 font-bold uppercase">
              Modern Academy
            </div>
          </div>

          {/* Indigo */}
          <div
            onClick={() => handleSelectTheme('indigo')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'indigo'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#1E1B4B]" />
                  <span className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                </div>
                {theme === 'indigo' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Royal Indigo-Navy</h4>
              <p className="text-xs text-slate-500 mt-1">
                Authoritative navy midnight gradient with electric cyan active pills
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-indigo-800 font-bold uppercase">
              Corporate & University
            </div>
          </div>
        </div>
      </div>

      {/* Regional & Sound settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Regional Dialect & Audio Prompts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">System Language</span>
              <span className="text-[11px] text-slate-500">English (India) with bilingual support</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
            >
              <option value="en">English (IN)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Audio Chime on Payment</span>
              <span className="text-[11px] text-slate-500">Plays chime sound when receipt is issued</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                soundEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
