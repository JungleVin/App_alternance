'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Application, Tweaks, ConfettiPiece } from '@/lib/types';
import { SEED_APPLICATIONS, STATUSES, ACCENT_PALETTES } from '@/lib/data';
import { daysUntil, blankApp, TODAY } from '@/lib/utils';
import { Icon } from './ui/Icon';
import { StatCard } from './ui/StatCard';
import { KanbanView } from './KanbanView';
import { ListView } from './ListView';
import { TimelineView } from './TimelineView';
import { AppModal } from './AppModal';
import { TweaksPanel } from './TweaksPanel';

const DEFAULT_TWEAKS: Tweaks = {
  accent: 'sunset',
  density: 'cozy',
  showStats: true,
  cardSize: 'normal',
  colorMode: 'light',
};

type View = 'kanban' | 'list' | 'timeline';
type FilterVal = 'all' | 'favorite' | 'urgent' | string;

export function TrackaApp() {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);
  const [apps, setApps] = useState<Application[]>(SEED_APPLICATIONS);
  const [view, setView] = useState<View>('kanban');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterVal>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [justMovedId, setJustMovedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; gradient: string } | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[] | null>(null);

  // Apply tweaks to CSS vars
  useEffect(() => {
    const r = document.documentElement;
    const p = ACCENT_PALETTES[tweaks.accent];
    r.style.setProperty('--accent', p.a);
    r.style.setProperty('--accent-2', p.b);
    r.style.setProperty('--accent-3', p.c);
    if (tweaks.colorMode === 'dark') {
      r.style.setProperty('--bg', '#151122');
      r.style.setProperty('--bg-2', '#1C1730');
      r.style.setProperty('--ink', '#F3EFFA');
      r.style.setProperty('--ink-2', '#B8B0CC');
      r.style.setProperty('--ink-3', '#7E7794');
      r.style.setProperty('--card', '#221B38');
      r.style.setProperty('--line', 'rgba(255,255,255,0.06)');
      r.style.setProperty('--line-2', 'rgba(255,255,255,0.12)');
    } else {
      r.style.setProperty('--bg', '#FBF8F3');
      r.style.setProperty('--bg-2', '#F4EFE6');
      r.style.setProperty('--ink', '#1A1625');
      r.style.setProperty('--ink-2', '#4A4358');
      r.style.setProperty('--ink-3', '#8A8398');
      r.style.setProperty('--card', '#FFFFFF');
      r.style.setProperty('--line', 'rgba(26,22,37,0.08)');
      r.style.setProperty('--line-2', 'rgba(26,22,37,0.14)');
    }
  }, [tweaks.accent, tweaks.colorMode]);

  const filteredApps = useMemo(() => {
    let list = apps;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        (a.company + ' ' + a.role + ' ' + a.location + ' ' + a.tags.join(' ')).toLowerCase().includes(q)
      );
    }
    if (filter === 'favorite') list = list.filter(a => a.favorite);
    else if (filter === 'urgent') list = list.filter(a => a.urgent || (a.nextActionDue && daysUntil(a.nextActionDue) !== null && daysUntil(a.nextActionDue)! <= 0));
    else if (filter !== 'all') list = list.filter(a => a.status === filter);
    return list;
  }, [apps, search, filter]);

  const stats = useMemo(() => {
    const total = apps.length;
    const active = apps.filter(a => !['rejected', 'offer'].includes(a.status)).length;
    const interviews = apps.filter(a => a.status === 'interview').length;
    const offers = apps.filter(a => a.status === 'offer').length;
    const rejects = apps.filter(a => a.status === 'rejected').length;
    const responseRate = total > 0 ? Math.round(((interviews + offers + rejects) / total) * 100) : 0;
    const urgent = apps.filter(a => {
      const d = daysUntil(a.nextActionDue);
      return d !== null && d <= 2 && !['rejected', 'offer'].includes(a.status);
    }).length;
    return { total, active, interviews, offers, responseRate, urgent };
  }, [apps]);

  function showToast(text: string, gradient: string) {
    setToast({ text, gradient });
    setTimeout(() => setToast(null), 2200);
  }

  function blastConfetti() {
    const pieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      tx: (Math.random() - 0.5) * 200,
      color: ['#FF5B8E', '#FFB547', '#7B61FF', '#12B981', '#4A8FD9'][i % 5],
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti(null), 2200);
  }

  function move(id: string, newStatus: string) {
    setApps(prev => prev.map(a => a.id === id ? {
      ...a,
      status: newStatus as Application['status'],
      stepIndex: newStatus === 'todo' ? 0
        : newStatus === 'sent' || newStatus === 'relance' ? Math.max(1, a.stepIndex)
        : newStatus === 'interview' ? Math.max(2, a.stepIndex)
        : newStatus === 'offer' ? 4
        : a.stepIndex,
      lastActionAt: TODAY,
    } : a));
    setJustMovedId(id);
    setTimeout(() => setJustMovedId(null), 700);
    const s = STATUSES.find(x => x.id === newStatus)!;
    showToast(`→ ${s.label}`, s.gradient);
    if (newStatus === 'offer') blastConfetti();
  }

  function toggleFav(id: string) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, favorite: !a.favorite } : a));
  }

  function del(id: string) {
    setApps(prev => prev.filter(a => a.id !== id));
    setOpenId(null);
    showToast('Candidature supprimée', 'linear-gradient(135deg, #E84A63, #FF5B8E)');
  }

  function save(draft: Application) {
    setApps(prev => {
      const exists = prev.find(a => a.id === draft.id);
      if (exists) return prev.map(a => a.id === draft.id ? draft : a);
      const withLogo = { ...draft, logo: draft.logo === '?' && draft.company ? draft.company.slice(0, 2) : draft.logo };
      return [withLogo, ...prev];
    });
    setOpenId(null);
    setIsNew(false);
    showToast('Enregistré', 'linear-gradient(135deg, #12B981, #6FE599)');
  }

  function openNew() {
    const b = blankApp();
    setApps(prev => [b, ...prev]);
    setOpenId(b.id);
    setIsNew(true);
  }

  const openApp = apps.find(a => a.id === openId);
  const activeCount = apps.filter(a => !['rejected', 'offer'].includes(a.status)).length;

  return (
    <div className="app-bg min-h-screen">
      {/* Topbar */}
      <header className="flex items-center gap-7 px-10 py-[22px] sticky top-0 z-40 border-b border-[var(--line)] backdrop-blur-[16px] bg-[rgba(251,248,243,0.7)]">
        <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>
          <div className="logo-mark" />
          <span>Tracka<span style={{ color: 'var(--accent)' }}>.</span></span>
        </div>

        {/* View toggle */}
        <div className="inline-flex bg-[rgba(26,22,37,0.05)] rounded-full p-1 gap-0.5">
          {([['kanban', 'kanban', 'Kanban'], ['list', 'list', 'Liste'], ['timeline', 'timeline', 'Timeline']] as const).map(([v, icon, label]) => (
            <button
              key={v}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-[180ms] ${
                view === v ? 'bg-ink text-bg shadow-[0_4px_10px_-2px_rgba(26,22,37,0.3)]' : 'text-ink2 hover:text-ink'
              }`}
              onClick={() => setView(v)}
            >
              <Icon name={icon} size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[360px] relative">
          <span className="absolute left-[13px] top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
            <Icon name="search" size={14} />
          </span>
          <input
            className="w-full pl-[38px] pr-[14px] py-2.5 border border-[var(--line)] rounded-full bg-[rgba(255,255,255,0.7)] text-[13.5px] outline-none transition-all focus:bg-white focus:border-[var(--accent-3)] focus:shadow-[0_0_0_4px_rgba(123,97,255,0.12)]"
            placeholder="Rechercher une entreprise, poste, tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <TweaksPanel tweaks={tweaks} onChange={patch => setTweaks(t => ({ ...t, ...patch }))} />
          <button
            className="flex items-center gap-2 px-[18px] py-2.5 rounded-full font-semibold text-[13.5px] text-white transition-all hover:-translate-y-px hover:shadow-[0_12px_28px_-8px_rgba(255,91,142,0.7)]"
            style={{ background: 'linear-gradient(135deg, #FF5B8E 0%, #FFB547 100%)', boxShadow: '0 8px 22px -6px rgba(255,91,142,0.55)' }}
            onClick={openNew}
          >
            <Icon name="plus" size={14} /> Nouvelle
          </button>
          <div
            className="w-[38px] h-[38px] rounded-full grid place-items-center font-bold text-[13px] text-white"
            style={{ background: 'linear-gradient(135deg, #7B61FF, #FF5B8E)', boxShadow: '0 1px 2px rgba(26,22,37,0.04), 0 2px 8px rgba(26,22,37,0.04)' }}
          >
            LA
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-10 pt-8 pb-2">
        <h1 className="text-[42px] leading-[1.05] tracking-[-0.03em] font-bold mb-1.5" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
          Salut Vin — <span className="gradient-text">{activeCount} candidatures en cours</span>,<br />
          <span className="text-ink2 font-medium">
            {stats.urgent} action{stats.urgent > 1 ? 's' : ''} urgente{stats.urgent > 1 ? 's' : ''} cette semaine.
          </span>
        </h1>
        <p className="text-ink2 text-[15px] max-w-[640px]">Gérez vos candidatures d&apos;alternance avec style.</p>

        {tweaks.showStats && (
          <div className="grid grid-cols-6 gap-3 mt-[26px]">
            <StatCard label="Total" value={stats.total} delta="+3 ce mois" color="linear-gradient(135deg, #7B61FF, #FF5B8E)" icon="sparkle" spark="0,18 8,14 16,16 24,8 32,10 40,4 48,6 54,2" />
            <StatCard label="Actives" value={stats.active} delta={`${stats.active} en cours`} color="linear-gradient(135deg, #4A8FD9, #7B61FF)" icon="bolt" spark="0,14 10,10 20,12 30,6 40,8 54,4" />
            <StatCard label="Entretiens" value={stats.interviews} delta="3 prévus" color="linear-gradient(135deg, #C2B6FF, #7B61FF)" icon="star" spark="0,16 10,14 20,10 30,12 40,6 54,4" />
            <StatCard label="Offres" value={stats.offers} delta={stats.offers > 0 ? 'À décider !' : '—'} color="linear-gradient(135deg, #A6F4C5, #12B981)" icon="trophy" spark="0,20 14,18 28,16 42,10 54,2" />
            <StatCard label="Taux réponse" value={`${stats.responseRate}%`} delta="↑ 12% vs mois dernier" color="linear-gradient(135deg, #FFD6A5, #FF7A45)" icon="flame" spark="0,18 10,14 20,12 30,10 40,6 54,8" />
            <StatCard label="À faire" value={stats.urgent} delta="Cette semaine" color="linear-gradient(135deg, #FFCDD4, #F27A8E)" icon="clock" spark="0,14 10,8 20,14 30,4 40,10 54,6" />
          </div>
        )}
      </section>

      {/* Content */}
      <section className="px-10 pt-5 pb-20">
        {/* Filters toolbar */}
        <div className="flex items-center gap-3 mb-[22px] flex-wrap">
          <div className="inline-flex gap-1.5 flex-wrap">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              Toutes · {apps.length}
            </FilterChip>
            {STATUSES.map(s => {
              const count = apps.filter(a => a.status === s.id).length;
              return (
                <FilterChip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
                  <span className="w-2 h-2 rounded-full" style={{ background: s.solid }} />
                  {s.label} · {count}
                </FilterChip>
              );
            })}
            <FilterChip active={filter === 'favorite'} onClick={() => setFilter('favorite')}>
              <Icon name="star" size={11} /> Favoris
            </FilterChip>
            <FilterChip active={filter === 'urgent'} onClick={() => setFilter('urgent')}>
              <Icon name="flame" size={11} /> Urgent
            </FilterChip>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="py-20 text-center text-ink3">
            <div className="text-[48px]">🌱</div>
            <h3 className="text-[22px] font-bold text-ink mt-2.5 mb-1" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              Rien ici pour l&apos;instant
            </h3>
            <div>Ajoute une candidature ou ajuste tes filtres.</div>
          </div>
        ) : view === 'kanban' ? (
          <KanbanView apps={filteredApps} onOpen={setOpenId} onMove={move} onToggleFav={toggleFav} onDelete={del} justMovedId={justMovedId} />
        ) : view === 'list' ? (
          <ListView apps={filteredApps} onOpen={setOpenId} onToggleFav={toggleFav} onDelete={del} />
        ) : (
          <TimelineView apps={filteredApps} onOpen={setOpenId} />
        )}
      </section>

      {/* Modal */}
      {openApp && (
        <AppModal
          app={openApp}
          onClose={() => {
            if (isNew) setApps(prev => prev.filter(a => a.id !== openId));
            setOpenId(null);
            setIsNew(false);
          }}
          onSave={save}
          onDelete={del}
          isNew={isNew}
        />
      )}

      {/* Toast */}
      <div
        className={`toast ${toast ? 'on' : ''}`}
        style={toast ? { background: toast.gradient, color: '#fff' } : {}}
      >
        {toast && (
          <>
            <span className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.9)]" />
            {toast.text}
          </>
        )}
      </div>

      {/* Confetti */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
          {confetti.map(p => (
            <span
              key={p.id}
              className="absolute w-2 h-3.5 rounded-[2px] confetti-fall"
              style={{
                left: `${p.left}%`,
                top: 0,
                background: p.color,
                animationDelay: `${p.delay}s`,
                ['--tx' as string]: `${p.tx}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-[13px] py-[7px] rounded-full text-[12.5px] font-semibold transition-all duration-150 border ${
        active ? 'bg-ink text-bg border-transparent' : 'bg-[rgba(26,22,37,0.05)] text-ink2 border-transparent hover:bg-[rgba(26,22,37,0.09)]'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
