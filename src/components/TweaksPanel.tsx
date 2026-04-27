'use client';

import { useState } from 'react';
import type { Tweaks } from '@/lib/types';
import { ACCENT_PALETTES } from '@/lib/data';
import { Icon } from './ui/Icon';

type TweaksPanelProps = {
  tweaks: Tweaks;
  onChange: (patch: Partial<Tweaks>) => void;
};

export function TweaksPanel({ tweaks, onChange }: TweaksPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center gap-2 px-[10px] py-2.5 rounded-full text-[13.5px] font-semibold bg-[rgba(26,22,37,0.05)] hover:bg-[rgba(26,22,37,0.09)] transition-colors"
        onClick={() => setOpen(v => !v)}
        title="Personnalisation"
      >
        <Icon name="sparkle" size={13} />
      </button>

      {open && (
        <div className="fixed bottom-5 right-5 w-[280px] bg-white rounded-[16px] p-4 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] border border-[var(--line)] z-[150] text-[13px]">
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Tweaks</div>
            <button
              className="w-[26px] h-[26px] rounded-[7px] grid place-items-center text-ink3 hover:bg-[rgba(26,22,37,0.08)] hover:text-ink transition-all"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Palette */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.08em] font-bold text-ink3 mb-1.5">Palette</div>
              <div className="grid grid-cols-4 gap-1.5">
                {Object.entries(ACCENT_PALETTES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => onChange({ accent: k as Tweaks['accent'] })}
                    className="flex flex-col items-center gap-1 p-2 rounded-[10px] transition-all"
                    style={{
                      background: tweaks.accent === k ? 'var(--ink)' : 'rgba(26,22,37,0.05)',
                      color: tweaks.accent === k ? '#fff' : 'var(--ink)',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    <div className="flex gap-[2px]">
                      {[v.a, v.b, v.c].map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-[3px]" style={{ background: c }} />
                      ))}
                    </div>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Density */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.08em] font-bold text-ink3 mb-1.5">Densité</div>
              <div className="flex gap-1">
                {(['compact', 'cozy', 'airy'] as Tweaks['density'][]).map(d => (
                  <button
                    key={d}
                    onClick={() => onChange({ density: d })}
                    className="flex-1 py-1.5 rounded-lg capitalize text-[11px] font-semibold transition-all"
                    style={{
                      background: tweaks.density === d ? 'var(--ink)' : 'rgba(26,22,37,0.05)',
                      color: tweaks.density === d ? '#fff' : 'var(--ink)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats toggle */}
            <label className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold">Afficher stats</span>
              <input
                type="checkbox"
                checked={tweaks.showStats}
                onChange={e => onChange({ showStats: e.target.checked })}
                className="w-4 h-4"
              />
            </label>

            {/* Dark mode */}
            <label className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold">Mode sombre</span>
              <input
                type="checkbox"
                checked={tweaks.colorMode === 'dark'}
                onChange={e => onChange({ colorMode: e.target.checked ? 'dark' : 'light' })}
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
}
