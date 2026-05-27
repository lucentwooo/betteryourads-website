export type FeedRowStatus = 'idle' | 'active' | 'done';

export interface FeedDef {
  label: string;
  /** value shown when active/done; `phase` only matters for the creative row */
  value: (phase: number) => string;
  active: (phase: number) => boolean;
  done: (phase: number) => boolean;
}

export const DEMO_URL = 'clickup.com';
export const DEMO_PALETTE = ['#8930FF', '#FF43C1', '#FF8A47', '#00D2FF'];

export const FEED_DEFS: FeedDef[] = [
  {
    label: 'audit',
    value: () => 'all your work, in one place',
    active: (p) => p === 1,
    done: (p) => p > 1,
  },
  {
    label: 'customers',
    value: () => 'PM + ops teams, 50–5000 emp',
    active: (p) => p === 2,
    done: (p) => p > 2,
  },
  {
    label: 'brand',
    value: () => '__PALETTE__', // component renders the palette swatches for this sentinel
    active: (p) => p === 3 || p === 4,
    done: (p) => p > 4,
  },
  {
    label: 'concepts',
    value: () => 'stop switching',
    active: (p) => p === 5,
    done: (p) => p > 5,
  },
  {
    label: 'creative',
    value: (p) => (p === 7 ? 'ready to ship' : 'composing...'),
    active: (p) => p === 6,
    done: (p) => p === 7,
  },
];

export function statusText(phase: number): string {
  switch (phase) {
    case 0: return 'type a url to begin';
    case 1: return 'auditing your site';
    case 2: return 'understanding your customers';
    case 3:
    case 4: return 'extracting brand';
    case 5: return 'drafting ad concepts';
    case 6: return 'rendering creative';
    default: return 'shipped to meta, day 1 of 30';
  }
}

export function feedRowState(def: FeedDef, phase: number): FeedRowStatus {
  if (def.done(phase)) return 'done';
  if (def.active(phase)) return 'active';
  return 'idle';
}

export function stepLabel(phase: number): string {
  const n = phase === 0 ? 0 : Math.min(phase, 6);
  return `step ${n} of 6`;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function canvasOpacities(progress: number) {
  return {
    wire: Math.max(0, 1 - progress / 0.35),
    grad: clamp((progress - 0.18) / 0.35),
    img: clamp((progress - 0.5) / 0.42),
  };
}
