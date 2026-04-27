import { STATUSES } from '@/lib/data';
import { Icon } from './Icon';

type StatusPillProps = { status: string; compact?: boolean };

export function StatusPill({ status, compact }: StatusPillProps) {
  const s = STATUSES.find(x => x.id === status);
  if (!s) return null;
  return (
    <span
      className="inline-flex items-center gap-[6px] px-[10px] py-1 rounded-full text-white font-bold"
      style={{ background: s.gradient, fontSize: compact ? 11 : 11.5 }}
    >
      <Icon name={s.icon} size={compact ? 10 : 12} />
      {compact ? s.short : s.label}
    </span>
  );
}
