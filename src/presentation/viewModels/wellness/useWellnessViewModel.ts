import { useState } from 'react';

export interface WellnessData {
  week: string;
  moods: Array<{ day: string; level: number; label: string }>;
  topics: Array<{ name: string; percentage: number }>;
}

export function useWellnessViewModel() {
  const [data] = useState<WellnessData>({
    week: 'Del 12 al 18 de Octubre',
    moods: [
      { day: 'L', level: 0.8, label: 'Alegría' },
      { day: 'M', level: 0.6, label: 'Tranquilo' },
      { day: 'M', level: 0.5, label: 'Cansancio' },
      { day: 'J', level: 0.7, label: 'Tranquilo' },
      { day: 'V', level: 0.9, label: 'Alegría' },
      { day: 'S', level: 0.4, label: 'Nostalgia' },
      { day: 'D', level: 0.8, label: 'Alegría' },
    ],
    topics: [
      { name: 'Familia', percentage: 45 },
      { name: 'Salud', percentage: 25 },
      { name: 'Lecturas', percentage: 15 },
      { name: 'Cotidiano', percentage: 15 },
    ],
  });

  return {
    data,
  };
}
