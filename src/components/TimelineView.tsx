'use client';

import type { Application } from '@/lib/types';
import { STATUSES } from '@/lib/data';
import { TODAY, formatDate, daysUntil } from '@/lib/utils';
import { LogoChip } from './ui/LogoChip';
import { Icon } from './ui/Icon';

type TimelineViewProps = {
  apps: Application[];
  onOpen: (id: string) => void;
};

export function TimelineView({ apps, onOpen }: TimelineViewProps) {
  const today = new Date(TODAY);

  const dates: Date[] = [];
  apps.forEach(a => {
    if (a.sentAt) dates.push(new Date(a.sentAt));
    if (a.lastActionAt) dates.push(new Date(a.lastActionAt));
    if (a.interviewAt) dates.push(new Date(a.interviewAt));
    if (a.nextActionDue) dates.push(new Date(a.nextActionDue));
  });
  dates.push(today);

  if (dates.length === 0) return null;

  const minD = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxD = new Date(Math.max(...dates.map(d => d.getTime())));
  const start = new Date(minD); start.setDate(start.getDate() - 3);
  const end = new Date(maxD); end.setDate(end.getDate() + 7);
  const span = end.getTime() - start.getTime();
  const pct = (d: string | Date) => ((new Date(d).getTime() - start.getTime()) / span) * 100;

  const ticks: Date[] = [];
  const cur = new Date(start);
  cur.setDate(cur.getDate() + (1 - cur.getDay() + 7) % 7);
  while (cur < end) {
    ticks.push(new Date(cur));
    cur.setDate(cur.getDate() + 7);
  }

  const sorted = [...apps].sort((a, b) => {
    const da = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const db = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return da - db;
  });

  const todayPct = pct(today);

  return (
    <div className="bg-card border border-[var(--line)] rounded-[18px] p-[28px_24px] relative overflow-hidden shadow-[0_1px_2px_rgba(26,22,37,0.04),0_2px_8px_rgba(26,22,37,0.04)]">
      <div className="flex justify-between items-baseline mb-5">
        <div className="text-[20px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
          Chronologie
        </div>
        <div className="text-[13px] text-ink3">
          {apps.length} candidatures · {formatDate(start.toISOString().slice(0, 10))} → {formatDate(end.toISOString().slice(0, 10))}
        </div>
      </div>

      {/* Scale */}
      <div className="relative h-[22px] border-b border-dashed border-[var(--line-2)] mb-3.5">
        {ticks.map((t, i) => (
          <div
            key={i}
            className="absolute top-0 text-[11px] text-ink3 font-semibold"
            style={{ left: `calc(220px + 16px + ${pct(t)}% * (100% - 220px - 16px) / 100%)`, transform: 'translateX(-50%)' }}
          >
            {t.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
            <span className="absolute left-1/2 bottom-[-6px] w-px h-1.5 bg-[var(--line-2)] -translate-x-1/2 block" />
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="relative">
        {/* Today line */}
        <div
          className="tl-today"
          style={{ left: `calc(220px + 16px + ${todayPct}% * (100% - 220px - 16px) / 100%)` }}
        />

        {sorted.map(a => {
          const s = STATUSES.find(x => x.id === a.status)!;
          const startPct = a.sentAt ? pct(a.sentAt) : pct(today);
          const endPct = (a.status === 'rejected' || a.status === 'offer')
            ? pct(a.lastActionAt || a.sentAt || today)
            : pct(today);
          const width = Math.max(endPct - startPct, 2);

          return (
            <div
              key={a.id}
              className="grid gap-4 items-center py-2.5 border-b border-[var(--line)] last:border-b-0"
              style={{ gridTemplateColumns: '220px 1fr' }}
            >
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => onOpen(a.id)}
              >
                <LogoChip app={a} size={30} />
                <div className="min-w-0">
                  <div className="font-semibold text-[13.5px] truncate">{a.company}</div>
                  <div className="text-xs text-ink3 truncate">{a.role}</div>
                </div>
              </div>

              <div
                className="relative h-[34px] rounded-lg"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(26,22,37,0.04) 0 1px, transparent 1px 60px)' }}
              >
                {a.sentAt && (
                  <div
                    className="absolute top-[6px] h-[22px] rounded-full flex items-center px-2.5 text-white text-[11px] font-bold cursor-pointer transition-transform transition-shadow duration-150 hover:-translate-y-px hover:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.3)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]"
                    style={{ left: `${startPct}%`, width: `${width}%`, background: s.gradient, minWidth: 22 }}
                    onClick={() => onOpen(a.id)}
                    title={`${s.label} • ${formatDate(a.sentAt)}`}
                  >
                    <Icon name={s.icon} size={10} />
                    <span className="ml-1" style={{ opacity: width < 6 ? 0 : 1 }}>{s.short}</span>
                  </div>
                )}
                {a.interviewAt && (
                  <div
                    className="absolute top-1/2 w-3 h-3 rounded-full border-[3px] border-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                    style={{ left: `${pct(a.interviewAt)}%`, transform: 'translate(-50%, -50%)', background: '#7B61FF' }}
                    title={`Entretien ${formatDate(a.interviewAt)}`}
                  />
                )}
                {a.nextActionDue && daysUntil(a.nextActionDue) !== null && daysUntil(a.nextActionDue)! >= 0 && (
                  <div
                    className="absolute top-1/2 w-3 h-3 rounded-full border-[3px] border-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                    style={{ left: `${pct(a.nextActionDue)}%`, transform: 'translate(-50%, -50%)', background: '#FFB547' }}
                    title={`À faire: ${a.nextAction}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
