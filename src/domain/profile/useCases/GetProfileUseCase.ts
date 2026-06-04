import { IProfileRepository } from '../repositories/IProfileRepository';
import { UserProfile } from '../entities/UserProfile';

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(): Promise<UserProfile> {
    return this.profileRepository.getProfile();
  }
}
