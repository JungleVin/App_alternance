'use client';

import { useState, useEffect } from 'react';
import type { Application } from '@/lib/types';
import { STATUSES, STEP_LABELS } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Icon } from './ui/Icon';
import { Stars } from './ui/Stars';

type AppModalProps = {
  app: Application;
  onClose: () => void;
  onSave: (draft: Application) => void;
  onDelete: (id: string) => void;
  isNew: boolean;
};

type Tab = 'infos' | 'suivi' | 'notes';

const SOURCES = ['LinkedIn', 'Welcome to the Jungle', 'Indeed', 'Site carrière', 'Cooptation', 'Salon Student', 'Autre'];

export function AppModal({ app, onClose, onSave, onDelete, isNew }: AppModalProps) {
  const [draft, setDraft] = useState<Application>(app);
  const [tab, setTab] = useState<Tab>('infos');

  useEffect(() => { setDraft(app); }, [app.id]);

  const s = STATUSES.find(x => x.id === draft.status) ?? STATUSES[0];

  function update<K extends keyof Application>(k: K, v: Application[K]) {
    setDraft(d => ({ ...d, [k]: v }));
  }
  function updateContact(k: keyof Application['contact'], v: string) {
    setDraft(d => ({ ...d, contact: { ...d.contact, [k]: v } }));
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(26,22,37,0.5)] backdrop-blur-[8px] z-[100] grid place-items-center p-6 backdrop-animate"
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-[26px] w-full max-w-[860px] max-h-[90vh] overflow-hidden flex flex-col shadow-[0_24px_48px_rgba(26,22,37,0.16)] modal-animate"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="p-[28px_32px_22px] relative text-white overflow-hidden" style={{ background: s.gradient }}>
          <div className="absolute -top-[40%] -right-[20%] w-[420px] h-[420px] pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.35), transparent 60%)' }}
          />
          <button
            className="absolute top-[18px] right-[18px] w-[34px] h-[34px] rounded-full bg-[rgba(255,255,255,0.18)] grid place-items-center transition-colors duration-150 hover:bg-[rgba(255,255,255,0.32)] z-[2] backdrop-blur-[8px]"
            onClick={onClose}
          >
            <Icon name="close" size={16} />
          </button>
          <div className="relative z-[1]">
            <div className="flex gap-3.5 items-center">
              <div
                className="w-14 h-14 rounded-[14px] grid place-items-center font-bold text-[20px] text-white"
                style={{
                  background: draft.logoColor,
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  boxShadow: 'inset 0 -16px 24px -14px rgba(0,0,0,0.3)',
                }}
              >
                {draft.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] uppercase opacity-90">
                  <Icon name={s.icon} size={12} /> {s.label}
                </div>
                <h2
                  className="text-[28px] font-bold tracking-tight my-[10px_0_4px]"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                >
                  {draft.company || 'Nouvelle candidature'}
                </h2>
                <div className="text-[15px] opacity-[0.92]">{draft.role || '—'}</div>
              </div>
            </div>
            <div className="mt-3.5 flex gap-4 text-[13px] opacity-[0.92] flex-wrap">
              <span className="flex items-center gap-1.5"><Icon name="pin" size={13} /> {draft.location || '—'}</span>
              <span className="flex items-center gap-1.5"><Icon name="calendar" size={13} /> Envoi {formatDate(draft.sentAt)}</span>
              <span className="flex items-center gap-1.5"><Icon name="bolt" size={13} /> {draft.salary || '—'}</span>
              <span className="flex items-center gap-1.5"><Stars n={draft.interest} /></span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-8 border-b border-[var(--line)] bg-bg2">
          {(['infos', 'suivi', 'notes'] as Tab[]).map(t => (
            <button
              key={t}
              className={`py-3.5 px-1.5 text-[13px] font-semibold mr-[18px] border-b-2 mb-[-1px] transition-colors ${
                tab === t ? 'text-ink border-ink' : 'text-ink3 border-transparent'
              }`}
              onClick={() => setTab(t)}
            >
              {t === 'infos' ? 'Infos' : t === 'suivi' ? 'Suivi & étapes' : 'Notes & fichiers'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-[24px_32px_32px] overflow-y-auto bg-bg">
          {tab === 'infos' && (
            <div className="grid grid-cols-2 gap-[14px_18px]">
              <Field label="Entreprise"><input value={draft.company} onChange={e => update('company', e.target.value)} /></Field>
              <Field label="Poste"><input value={draft.role} onChange={e => update('role', e.target.value)} /></Field>
              <Field label="Localisation"><input value={draft.location} onChange={e => update('location', e.target.value)} /></Field>
              <Field label="Télétravail"><input value={draft.remote} onChange={e => update('remote', e.target.value)} /></Field>
              <Field label="Salaire"><input value={draft.salary} onChange={e => update('salary', e.target.value)} /></Field>
              <Field label="Rythme"><input value={draft.rhythm} onChange={e => update('rhythm', e.target.value)} /></Field>
              <Field label="Source">
                <select value={draft.source} onChange={e => update('source', e.target.value)}>
                  {SOURCES.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Lien de l'offre"><input value={draft.sourceUrl} onChange={e => update('sourceUrl', e.target.value)} placeholder="https://…" /></Field>
              <Field label="Contact — nom"><input value={draft.contact.name} onChange={e => updateContact('name', e.target.value)} /></Field>
              <Field label="Contact — rôle"><input value={draft.contact.role} onChange={e => updateContact('role', e.target.value)} /></Field>
              <Field label="Contact — email"><input value={draft.contact.email} onChange={e => updateContact('email', e.target.value)} /></Field>
              <Field label="Contact — téléphone"><input value={draft.contact.phone} onChange={e => updateContact('phone', e.target.value)} /></Field>
              <Field label="Tags (séparés par virgule)" className="col-span-2">
                <input
                  value={draft.tags.join(', ')}
                  onChange={e => update('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                />
              </Field>
            </div>
          )}

          {tab === 'suivi' && (
            <div className="grid grid-cols-2 gap-[14px_18px]">
              <Field label="Statut">
                <select value={draft.status} onChange={e => {
                  const ns = e.target.value as Application['status'];
                  const idx = ns === 'todo' ? 0 : ns === 'sent' || ns === 'relance' ? Math.max(1, draft.stepIndex) : ns === 'interview' ? Math.max(2, draft.stepIndex) : ns === 'offer' ? 4 : draft.stepIndex;
                  setDraft(d => ({ ...d, status: ns, stepIndex: idx }));
                }}>
                  {STATUSES.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
                </select>
              </Field>
              <Field label={`Étape (${STEP_LABELS[draft.stepIndex]})`}>
                <input type="range" min="0" max="4" value={draft.stepIndex} onChange={e => update('stepIndex', +e.target.value)} />
              </Field>
              <Field label="Date d'envoi"><input type="date" value={draft.sentAt ?? ''} onChange={e => update('sentAt', e.target.value || null)} /></Field>
              <Field label="Dernière action"><input type="date" value={draft.lastActionAt ?? ''} onChange={e => update('lastActionAt', e.target.value || null)} /></Field>
              <Field label="Entretien prévu"><input type="date" value={draft.interviewAt ?? ''} onChange={e => update('interviewAt', e.target.value || null)} /></Field>
              <Field label="Échéance prochaine action"><input type="date" value={draft.nextActionDue ?? ''} onChange={e => update('nextActionDue', e.target.value || null)} /></Field>
              <Field label="Prochaine action" className="col-span-2">
                <input value={draft.nextAction} onChange={e => update('nextAction', e.target.value)} placeholder="Ex: relancer, préparer cas technique…" />
              </Field>
              <Field label="Niveau d'intérêt">
                <div className="flex gap-1 items-center py-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} onClick={() => update('interest', i)} className="p-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= draft.interest ? '#FFB547' : 'none'} stroke="#FFB547" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
              </Field>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-[14px]">
                  <input type="checkbox" checked={!!draft.urgent} onChange={e => update('urgent', e.target.checked)} className="w-4 h-4" />
                  Urgent
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[14px]">
                  <input type="checkbox" checked={!!draft.favorite} onChange={e => update('favorite', e.target.checked)} className="w-4 h-4" />
                  Favori
                </label>
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div className="grid grid-cols-2 gap-[14px_18px]">
              <Field label="Notes & journal" className="col-span-2">
                <textarea value={draft.notes} onChange={e => update('notes', e.target.value)} rows={8} />
              </Field>
              <Field label="CV envoyé">
                <div className="flex gap-2 items-center">
                  <input value={draft.cv} onChange={e => update('cv', e.target.value)} placeholder="CV_xxx.pdf" className="flex-1" />
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13.5px] font-semibold bg-[rgba(26,22,37,0.05)] hover:bg-[rgba(26,22,37,0.09)] transition-colors whitespace-nowrap">
                    <Icon name="file" size={14} /> Joindre
                  </button>
                </div>
              </Field>
              <Field label="Lettre de motivation">
                <div className="flex gap-2 items-center">
                  <input value={draft.letter} onChange={e => update('letter', e.target.value)} placeholder="LM_xxx.pdf" className="flex-1" />
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13.5px] font-semibold bg-[rgba(26,22,37,0.05)] hover:bg-[rgba(26,22,37,0.09)] transition-colors whitespace-nowrap">
                    <Icon name="file" size={14} /> Joindre
                  </button>
                </div>
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-4 bg-bg2 border-t border-[var(--line)]">
          <button
            className="flex items-center gap-2 px-[18px] py-2.5 rounded-full font-semibold text-[13.5px] text-[#E84A63] bg-[rgba(26,22,37,0.05)] hover:bg-[rgba(232,74,99,0.1)] transition-colors"
            onClick={() => {
              if (!isNew && confirm('Supprimer cette candidature ?')) onDelete(draft.id);
            }}
          >
            <Icon name="trash" size={14} /> Supprimer
          </button>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-[18px] py-2.5 rounded-full font-semibold text-[13.5px] bg-[rgba(26,22,37,0.05)] hover:bg-[rgba(26,22,37,0.09)] transition-colors"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="flex items-center gap-2 px-[18px] py-2.5 rounded-full font-semibold text-[13.5px] text-white transition-all hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #FF5B8E 0%, #FFB547 100%)', boxShadow: '0 8px 22px -6px rgba(255,91,142,0.55)' }}
              onClick={() => onSave(draft)}
            >
              <Icon name="check" size={14} /> {isNew ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label className="text-[11px] uppercase tracking-[0.08em] font-bold text-ink3">{label}</label>
      {children}
    </div>
  );
}
