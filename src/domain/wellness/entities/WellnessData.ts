export interface WellnessData {
  week: string;
  moods: Array<{ day: string; level: number; label: string }>;
  topics: Array<{ name: string; percentage: number }>;
}
