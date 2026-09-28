import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: React.ReactNode;
  accentColor?: string; // hex or tailwind class
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  accentColor = '#14B8A6',
  badgeText,
  badgeType = 'success',
  icon,
  footerContent,
  className = '',
}) => {
  const getBadgeClasses = () => {
    switch (badgeType) {
      case 'error':
        return 'bg-rose-50 text-rose-700 font-bold';
      case 'warning':
        return 'bg-amber-50 text-amber-800 font-semibold';
      case 'info':
        return 'bg-teal-50 text-teal-800 font-semibold';
      case 'success':
      default:
        return 'bg-emerald-50 text-emerald-700 font-semibold';
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border border-emerald-950/5 ${className}`}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: accentColor }}
      />

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {badgeText && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${getBadgeClasses()}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[28px] font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </span>
          {icon && <div className="ml-auto text-slate-400">{icon}</div>}
        </div>

        {subtext && <div className="text-xs text-slate-500">{subtext}</div>}
      </div>

      {footerContent && (
        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
          {footerContent}
        </div>
      )}
    </div>
  );
};
