import React from 'react';
import { useAppStore } from '../../store/useAppStore';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  backUrl?: string;
  onBack?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  onBack,
}) => {
  const { activeSession } = useAppStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/70 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Session {activeSession}
          </span>
          {badge && (
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-slate-500 hover:text-slate-900 transition-colors p-1 -ml-1 rounded"
              title="Go Back"
            >
              ←
            </button>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>
      )}
    </div>
  );
};
