import { apiClient } from './apiClient';
import { WellnessData } from '../../domain/wellness/entities/WellnessData';

export const wellnessApiClient = {
  getWeeklyWellness: async (): Promise<WellnessData | null> => {
    const response = await apiClient.get<WellnessData | null>('/api/v1/wellness/current-week');
    return response.data;
  },
};
