import 'reflect-metadata';
import { GetWeeklyWellnessUseCase } from '../GetWeeklyWellnessUseCase';
import { IWellnessRepository } from '../../repositories/IWellnessRepository';
import { WellnessData } from '../../entities/WellnessData';

describe('GetWeeklyWellnessUseCase', () => {
  it('should call the repository and return wellness data', async () => {
    // Arrange
    const mockData: WellnessData = {
      week: 'test week',
      moods: [],
      topics: []
    };
    
    const mockRepository: IWellnessRepository = {
      getWeeklyWellness: jest.fn().mockResolvedValue(mockData)
    };
    
    const useCase = new GetWeeklyWellnessUseCase(mockRepository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getWeeklyWellness).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it('should propagate errors from the repository', async () => {
    // Arrange
    const mockRepository: IWellnessRepository = {
      getWeeklyWellness: jest.fn().mockRejectedValue(new Error('Repo error'))
    };
    
    const useCase = new GetWeeklyWellnessUseCase(mockRepository);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('Repo error');
  });
});
