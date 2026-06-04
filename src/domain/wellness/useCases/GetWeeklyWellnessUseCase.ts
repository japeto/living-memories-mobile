import { injectable, inject } from 'tsyringe';
import { IWellnessRepository } from '../repositories/IWellnessRepository';
import { WellnessData } from '../entities/WellnessData';

@injectable()
export class GetWeeklyWellnessUseCase {
  constructor(
    @inject('IWellnessRepository') private repository: IWellnessRepository
  ) {}

  async execute(): Promise<WellnessData | null> {
    return await this.repository.getWeeklyWellness();
  }
}
