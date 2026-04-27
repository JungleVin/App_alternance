import { Icon } from './Icon';

type StatCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  color: string;
  icon?: string;
  spark?: string;
};

export function StatCard({ label, value, delta, color, icon, spark }: StatCardProps) {
  const strokeColor = color.replace('linear-gradient(135deg, ', '').split(' ')[0];
  return (
    <div className="relative p-[16px_18px_18px] rounded-[18px] bg-card border border-[var(--line)] overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(26,22,37,0.06),0_12px_32px_rgba(26,22,37,0.08)]">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
      {spark && (
        <svg className="stat-spark" width="54" height="22" viewBox="0 0 54 22">
          <polyline
            points={spark}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <div className="text-[11.5px] uppercase tracking-[0.08em] text-ink3 font-semibold mb-1.5 flex items-center gap-1.5">
        {icon && <Icon name={icon} size={12} />} {label}
      </div>
      <div
        className="text-[32px] font-bold leading-none tracking-tight"
        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
      >
        {value}
      </div>
      {delta && <div className="mt-1.5 text-xs text-ink3">{delta}</div>}
    </div>
  );
}
