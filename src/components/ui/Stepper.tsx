import type { Status } from '@/lib/types';

type StepperProps = { stepIndex: number; status: Status; total?: number };
type MiniStepperProps = { stepIndex: number; total?: number };

export function Stepper({ stepIndex, status, total = 5 }: StepperProps) {
  const variant =
    status === 'offer' ? 'success' :
    status === 'rejected' ? 'danger' :
    status === 'interview' ? 'cool' :
    status === 'relance' ? 'warm' : '';

  return (
    <div className="flex gap-[3px] my-[10px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-[5px] rounded-full overflow-hidden ${
            i <= stepIndex
              ? variant === 'success' ? 'seg-on-success'
              : variant === 'danger' ? 'seg-on-danger'
              : variant === 'cool' ? 'seg-on-cool'
              : variant === 'warm' ? 'seg-on-warm'
              : 'seg-on'
              : 'bg-[rgba(26,22,37,0.08)]'
          }`}
        />
      ))}
    </div>
  );
}

export function MiniStepper({ stepIndex, total = 5 }: MiniStepperProps) {
  return (
    <div className="flex gap-[2px] w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-[4px] rounded-full ${
            i <= stepIndex ? 'seg-on' : 'bg-[rgba(26,22,37,0.08)]'
          }`}
        />
      ))}
    </div>
  );
}
