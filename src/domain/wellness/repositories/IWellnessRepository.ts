import { WellnessData } from '../entities/WellnessData';

export interface IWellnessRepository {
  getWeeklyWellness(): Promise<WellnessData | null>;
}
