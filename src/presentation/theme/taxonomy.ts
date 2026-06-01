/* ============================================================
   taxonomy — TOPICS and MOODS
   Port of components.jsx. The 'soft' colors that on the web
   pointed to CSS vars are resolved per theme at runtime with
   resolveTopic()/resolveMood().
   ============================================================ */
import { IconName } from '../components/Icon';
import { Theme } from './ThemeProvider';

export type TopicKey = 'Familia' | 'Salud' | 'Lecturas' | 'Bienestar' | 'Cotidiano';
export type MoodKey = 'Alegría' | 'Tranquilo' | 'Nostalgia' | 'Cansancio';

interface TopicDef {
  icon: IconName;
  color: string;
  /** soft color key of the theme, or a fixed hex */
  soft: keyof Theme['colors'] | string;
}

export const TOPICS: Record<TopicKey, TopicDef> = {
  Familia:   { icon: 'family', color: '#5a7d6f', soft: 'secondarySoft' },
  Salud:     { icon: 'stetho', color: '#c0653b', soft: 'primarySoft' },
  Lecturas:  { icon: 'book',   color: '#8a6db0', soft: '#ece4f3' },
  Bienestar: { icon: 'leaf',   color: '#5a7d6f', soft: 'secondarySoft' },
  Cotidiano: { icon: 'sun',    color: '#d6992f', soft: 'accentSoft' },
};

export const MOODS: Record<MoodKey, { color: string }> = {
  Alegría:   { color: '#3f9e6d' },
  Tranquilo: { color: '#5a7d6f' },
  Nostalgia: { color: '#c79a3e' },
  Cansancio: { color: '#b5793f' },
};

/** Returns resolved color/soft/icon for the active theme. */
export function resolveTopic(key: TopicKey, theme: Theme) {
  const def = TOPICS[key] ?? TOPICS.Cotidiano;
  const soft = def.soft in theme.colors
    ? (theme.colors as any)[def.soft]
    : def.soft; // literal hex
  return { icon: def.icon, color: def.color, soft };
}

export function resolveMood(key: MoodKey) {
  return MOODS[key] ?? MOODS.Tranquilo;
}
