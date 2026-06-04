import { wellnessApiClient } from '../wellnessApiClient';
import { apiClient } from '../apiClient';
import { WellnessData } from '../../../domain/wellness/entities/WellnessData';

jest.mock('../apiClient', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

describe('wellnessApiClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch wellness data and return response data', async () => {
    // Arrange
    const mockData: WellnessData = {
      week: 'test week',
      moods: [],
      topics: []
    };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

    // Act
    const result = await wellnessApiClient.getWeeklyWellness();

    // Assert
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/wellness/current-week');
    expect(result).toEqual(mockData);
  });

  it('should throw an error if the API request fails', async () => {
    // Arrange
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(wellnessApiClient.getWeeklyWellness()).rejects.toThrow('Network error');
  });
});
