'use client';

import type { Application } from '@/lib/types';
import { freshness, daysUntil } from '@/lib/utils';
import { Icon } from './ui/Icon';
import { LogoChip } from './ui/LogoChip';
import { Stepper } from './ui/Stepper';
import { Stars } from './ui/Stars';

type AppCardProps = {
  app: Application;
  onOpen: (id: string) => void;
  onToggleFav: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  justMoved?: boolean;
};

export function AppCard({ app, onOpen, onToggleFav, onDelete, onDragStart, onDragEnd, justMoved }: AppCardProps) {
  const fresh = freshness(app);
  const due = daysUntil(app.nextActionDue);
  const overdue = due !== null && due < 0;

  const heatClass =
    fresh.level === 'hot' ? 'heat-hot' :
    fresh.level === 'warm' ? 'heat-warm' :
    fresh.level === 'cool' ? 'heat-cool' : 'heat-cold';

  return (
    <div
      className={`group relative bg-card rounded-[12px] p-3.5 mb-2.5 border border-[var(--line)] cursor-grab transition-[transform,box-shadow,opacity] duration-[160ms] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(26,22,37,0.06),0_12px_32px_rgba(26,22,37,0.08)] active:cursor-grabbing ${justMoved ? 'card-pop' : 'card-animate'}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', app.id); onDragStart(app.id); }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(app.id)}
    >
      {/* Heat dot */}
      <div
        className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full group-hover:hidden ${heatClass}`}
        title={`Fraîcheur: ${fresh.label}`}
      />

      {/* Actions */}
      <div
        className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={e => e.stopPropagation()}
      >
        <button
          className={`w-[26px] h-[26px] rounded-[7px] grid place-items-center transition-all duration-100 hover:bg-[rgba(26,22,37,0.08)] hover:text-ink ${app.favorite ? 'text-[#FFB547]' : 'text-ink3'}`}
          onClick={() => onToggleFav(app.id)}
          title="Favori"
        >
          <Icon name="star" size={13} />
        </button>
        <button
          className="w-[26px] h-[26px] rounded-[7px] grid place-items-center text-ink3 transition-all duration-100 hover:bg-[rgba(232,74,99,0.12)] hover:text-[#E84A63]"
          onClick={() => onDelete(app.id)}
          title="Supprimer"
        >
          <Icon name="trash" size={13} />
        </button>
      </div>

      {/* Head */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <LogoChip app={app} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[13.5px] leading-[1.3] tracking-[-0.01em]">{app.company}</div>
          <div className="text-xs text-ink3 mt-0.5">{app.role}</div>
        </div>
      </div>

      <Stepper stepIndex={app.stepIndex} status={app.status} />

      <div className="flex gap-1.5 text-[11px] text-ink3 mt-1.5 items-center">
        <Icon name="pin" size={11} />
        <span>{app.location}</span>
        <span className="opacity-50">•</span>
        <span>{app.salary}</span>
      </div>

      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex gap-1 flex-wrap">
          {app.urgent && (
            <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold bg-[rgba(255,122,69,0.15)] text-[#C44A15]">
              ⚡ Urgent
            </span>
          )}
          {fresh.level === 'hot' && app.status !== 'offer' && (
            <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold bg-[rgba(18,185,129,0.15)] text-[#0B6842]">
              Frais
            </span>
          )}
          {overdue && (
            <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold bg-[rgba(255,122,69,0.15)] text-[#C44A15]">
              Relance due
            </span>
          )}
        </div>
        <Stars n={app.interest} />
      </div>

      {app.nextAction && (
        <div
          className={`mt-2.5 px-[9px] py-[7px] rounded-[9px] text-[11.5px] flex items-center gap-1.5 border ${
            overdue
              ? 'bg-[linear-gradient(135deg,rgba(232,74,99,0.14),rgba(255,91,142,0.08))] border-[rgba(232,74,99,0.25)] text-[#8A1C3E]'
              : 'bg-[linear-gradient(135deg,rgba(255,181,71,0.12),rgba(255,91,142,0.08))] border-[rgba(255,181,71,0.2)] text-ink'
          }`}
        >
          <span className={`w-[7px] h-[7px] rounded-full bg-current shrink-0 dot-pulse`} />
          <span className="flex-1">{app.nextAction}</span>
          {app.nextActionDue && due !== null && (
            <span className="font-bold whitespace-nowrap">
              {overdue ? `−${Math.abs(due)}j` : due === 0 ? 'Auj.' : `J-${due}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
