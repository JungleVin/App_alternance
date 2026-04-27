'use client';

import type { Application } from '@/lib/types';
import { daysUntil, formatDate } from '@/lib/utils';
import { Icon } from './ui/Icon';
import { LogoChip } from './ui/LogoChip';
import { MiniStepper } from './ui/Stepper';
import { StatusPill } from './ui/StatusPill';
import { Stars } from './ui/Stars';

type ListViewProps = {
  apps: Application[];
  onOpen: (id: string) => void;
  onToggleFav: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ListView({ apps, onOpen, onToggleFav, onDelete }: ListViewProps) {
  return (
    <div className="bg-card border border-[var(--line)] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(26,22,37,0.04),0_2px_8px_rgba(26,22,37,0.04)]">
      <div
        className="grid items-center gap-3.5 px-[18px] py-3 bg-[rgba(26,22,37,0.02)] border-b border-[var(--line)] text-[11px] uppercase tracking-[0.08em] font-bold text-ink3"
        style={{ gridTemplateColumns: '42px minmax(180px,1.4fr) minmax(180px,1.6fr) 120px 140px minmax(140px,1fr) 110px 90px 40px' }}
      >
        <div />
        <div>Entreprise</div>
        <div>Poste</div>
        <div>Statut</div>
        <div>Progression</div>
        <div>Prochaine action</div>
        <div>Envoi</div>
        <div>Intérêt</div>
        <div />
      </div>

      {apps.map(a => {
        const due = daysUntil(a.nextActionDue);
        const overdue = due !== null && due < 0;
        return (
          <div
            key={a.id}
            className="grid items-center gap-3.5 px-[18px] py-3 border-b border-[var(--line)] last:border-b-0 cursor-pointer transition-colors duration-100 hover:bg-[rgba(26,22,37,0.02)]"
            style={{ gridTemplateColumns: '42px minmax(180px,1.4fr) minmax(180px,1.6fr) 120px 140px minmax(140px,1fr) 110px 90px 40px' }}
            onClick={() => onOpen(a.id)}
          >
            <LogoChip app={a} size={34} />
            <div className="flex flex-col">
              <span className="font-semibold tracking-[-0.01em]">{a.company}</span>
              <span className="text-xs text-ink3 mt-0.5">{a.location} · {a.salary}</span>
            </div>
            <div className="text-[13.5px]">{a.role}</div>
            <div><StatusPill status={a.status} compact /></div>
            <div><MiniStepper stepIndex={a.stepIndex} /></div>
            <div
              className="text-[12.5px]"
              style={{ color: overdue ? '#8A1C3E' : 'var(--ink-2)', fontWeight: overdue ? 700 : 500 }}
            >
              {a.nextAction || <span className="text-ink3">—</span>}
            </div>
            <div className="text-[12.5px] text-ink3">{formatDate(a.sentAt)}</div>
            <div><Stars n={a.interest} size={10} /></div>
            <button
              className="w-[26px] h-[26px] rounded-[7px] grid place-items-center text-ink3 transition-all duration-100 hover:bg-[rgba(232,74,99,0.12)] hover:text-[#E84A63]"
              onClick={(e) => { e.stopPropagation(); onDelete(a.id); }}
            >
              <Icon name="trash" size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
