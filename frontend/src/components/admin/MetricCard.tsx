import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  isPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isPositive,
}) => {
  return (
    <div className="bg-white border border-velora-border p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {title}
        </span>
        {icon && <span className="text-velora-champagne-dark">{icon}</span>}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="font-serif text-2xl sm:text-3xl font-medium text-velora-black">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              isPositive ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-neutral-400 font-light truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
