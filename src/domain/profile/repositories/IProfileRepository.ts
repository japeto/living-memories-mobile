import { UserProfile } from '../entities/UserProfile';

export interface IProfileRepository {
  getProfile(): Promise<UserProfile>;
}
