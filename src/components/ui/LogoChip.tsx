import type { Application } from '@/lib/types';

type LogoChipProps = { app: Pick<Application, 'logo' | 'logoColor'>; size?: number };

export function LogoChip({ app, size = 36 }: LogoChipProps) {
  return (
    <div
      className="flex items-center justify-center font-bold rounded-[10px] text-white shrink-0"
      style={{
        background: app.logoColor,
        width: size,
        height: size,
        fontSize: size * 0.38,
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        letterSpacing: '-0.02em',
        boxShadow: 'inset 0 -12px 20px -12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.08)',
      }}
    >
      {app.logo}
    </div>
  );
}
