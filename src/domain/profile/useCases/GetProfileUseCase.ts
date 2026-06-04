import { injectable, inject } from 'tsyringe';
import { IProfileRepository } from '../repositories/IProfileRepository';
import { UserProfile } from '../entities/UserProfile';

@injectable()
export class GetProfileUseCase {
  constructor(
    @inject('IProfileRepository') private readonly profileRepository: IProfileRepository
  ) {}

  async execute(): Promise<UserProfile> {
    return this.profileRepository.getProfile();
  }
}
