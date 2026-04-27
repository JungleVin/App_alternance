'use client';

import { useState, useMemo } from 'react';
import type { Application } from '@/lib/types';
import { STATUSES } from '@/lib/data';
import { Icon } from './ui/Icon';
import { AppCard } from './AppCard';

type KanbanViewProps = {
  apps: Application[];
  onOpen: (id: string) => void;
  onMove: (id: string, newStatus: string) => void;
  onToggleFav: (id: string) => void;
  onDelete: (id: string) => void;
  justMovedId: string | null;
};

export function KanbanView({ apps, onOpen, onMove, onToggleFav, onDelete, justMovedId }: KanbanViewProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const byStatus = useMemo(() => {
    const map: Record<string, Application[]> = {};
    STATUSES.forEach(s => (map[s.id] = []));
    apps.forEach(a => { if (map[a.status]) map[a.status].push(a); });
    return map;
  }, [apps]);

  return (
    <div className="grid gap-3.5 pb-5 overflow-x-auto" style={{ gridTemplateColumns: 'repeat(6, minmax(240px, 1fr))' }}>
      {STATUSES.map(s => (
        <div
          key={s.id}
          className={`rounded-[18px] p-3.5 min-h-[440px] transition-colors duration-200 relative border ${
            dropTarget === s.id
              ? 'bg-[rgba(123,97,255,0.08)] border-[var(--accent-3)] shadow-[0_0_0_3px_rgba(123,97,255,0.15)]'
              : 'bg-[rgba(255,255,255,0.55)] border-[var(--line)] backdrop-blur-[8px]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDropTarget(s.id); }}
          onDragLeave={() => setDropTarget(null)}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            if (id) onMove(id, s.id);
            setDropTarget(null);
            setDragId(null);
          }}
        >
          <div className="flex items-center gap-2.5 mb-3.5">
            <span
              className="inline-flex items-center gap-1.5 px-[11px] py-[5px] rounded-full text-xs font-bold text-white"
              style={{ background: s.gradient }}
            >
              <Icon name={s.icon} size={11} />
              {s.short}
            </span>
            <span className="ml-auto text-xs text-ink3 font-semibold bg-[rgba(26,22,37,0.06)] px-2.5 py-[3px] rounded-full">
              {byStatus[s.id].length}
            </span>
          </div>

          {byStatus[s.id].length === 0 && (
            <div className="py-[18px] px-2 text-center text-xs text-ink3 border border-dashed border-[var(--line-2)] rounded-[10px]">
              Glisse ici
            </div>
          )}

          {byStatus[s.id].map(a => (
            <AppCard
              key={a.id}
              app={a}
              justMoved={justMovedId === a.id}
              onOpen={onOpen}
              onToggleFav={onToggleFav}
              onDelete={onDelete}
              onDragStart={(id) => setDragId(id)}
              onDragEnd={() => { setDragId(null); setDropTarget(null); }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
