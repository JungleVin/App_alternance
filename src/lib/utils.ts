import type { Application, Freshness } from './types';
import { STATUSES } from './data';

export const TODAY = '2026-04-24';

export function freshness(app: Application): Freshness {
  if (!app.sentAt) return { level: 'cold', label: 'À envoyer' };
  const last = app.lastActionAt || app.sentAt;
  const days = Math.floor((new Date(TODAY).getTime() - new Date(last).getTime()) / 86400000);
  if (app.status === 'offer') return { level: 'hot', label: '🔥 Offre' };
  if (app.status === 'rejected') return { level: 'cold', label: 'Clos' };
  if (days < 3) return { level: 'hot', label: 'Frais' };
  if (days < 10) return { level: 'warm', label: days + 'j' };
  if (days < 21) return { level: 'cool', label: days + 'j' };
  return { level: 'cold', label: days + 'j' };
}

export function formatDate(d: string | null): string {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export function daysUntil(d: string | null): number | null {
  if (!d) return null;
  return Math.floor((new Date(d).getTime() - new Date(TODAY).getTime()) / 86400000);
}

export function getStatus(id: string) {
  return STATUSES.find(s => s.id === id) ?? STATUSES[0];
}

export function blankApp(): Application {
  const colors = ['#7B61FF', '#FF5B8E', '#12B981', '#FFB547', '#4A8FD9', '#FF7A45'];
  return {
    id: 'app-' + Date.now(),
    company: '',
    logo: '?',
    logoColor: colors[Math.floor(Math.random() * colors.length)],
    role: '',
    location: '',
    remote: '',
    salary: '',
    rhythm: '',
    source: 'LinkedIn',
    sourceUrl: '',
    contact: { name: '', role: '', email: '', phone: '' },
    status: 'todo',
    stepIndex: 0,
    interest: 3,
    favorite: false,
    urgent: false,
    sentAt: null,
    lastActionAt: null,
    interviewAt: null,
    nextAction: '',
    nextActionDue: null,
    notes: '',
    cv: '',
    letter: '',
    tags: [],
  };
}
