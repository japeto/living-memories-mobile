import 'reflect-metadata';
import { WellnessRepository } from '../WellnessRepository';
import { wellnessApiClient } from '../../network/wellnessApiClient';
import { WellnessData } from '../../../domain/wellness/entities/WellnessData';

jest.mock('../../network/wellnessApiClient', () => ({
  wellnessApiClient: {
    getWeeklyWellness: jest.fn()
  }
}));

describe('WellnessRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the api client and return data', async () => {
    // Arrange
    const mockData: WellnessData = {
      week: 'test week',
      moods: [],
      topics: []
    };
    (wellnessApiClient.getWeeklyWellness as jest.Mock).mockResolvedValue(mockData);
    
    const repository = new WellnessRepository();

    // Act
    const result = await repository.getWeeklyWellness();

    // Assert
    expect(wellnessApiClient.getWeeklyWellness).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it('should propagate errors from the api client', async () => {
    // Arrange
    (wellnessApiClient.getWeeklyWellness as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const repository = new WellnessRepository();

    // Act & Assert
    await expect(repository.getWeeklyWellness()).rejects.toThrow('API error');
  });
});
