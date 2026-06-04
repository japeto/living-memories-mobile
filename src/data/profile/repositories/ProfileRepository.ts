import { injectable } from 'tsyringe';
import { IProfileRepository } from '../../domain/profile/repositories/IProfileRepository';
import { UserProfile } from '../../domain/profile/entities/UserProfile';
import { apiClient } from '../../network/apiClient';

interface ProfileResponse {
  user_id: string;
  email: string;
  display_name: string;
  full_name: string | null;
  avatar_url: string | null;
}

@injectable()
export class ProfileRepository implements IProfileRepository {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ProfileResponse>('/api/v1/profile/me');
    const data = response.data;
    
    return {
      userId: data.user_id,
      email: data.email,
      displayName: data.display_name,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
    };
  }
}
