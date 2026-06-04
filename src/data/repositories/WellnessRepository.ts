import { injectable } from 'tsyringe';
import { IWellnessRepository } from '../../domain/wellness/repositories/IWellnessRepository';
import { WellnessData } from '../../domain/wellness/entities/WellnessData';
import { wellnessApiClient } from '../network/wellnessApiClient';

@injectable()
export class WellnessRepository implements IWellnessRepository {
  async getWeeklyWellness(): Promise<WellnessData | null> {
    return await wellnessApiClient.getWeeklyWellness();
  }
}
