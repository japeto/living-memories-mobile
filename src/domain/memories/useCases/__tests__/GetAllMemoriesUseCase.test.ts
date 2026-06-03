import { GetAllMemoriesUseCase } from '../GetAllMemoriesUseCase';
import { IMemoryRepository } from '../../repositories/IMemoryRepository';
import { Memory } from '../../entities/Memory';

describe('GetAllMemoriesUseCase', () => {
  let useCase: GetAllMemoriesUseCase;
  let mockMemoryRepository: jest.Mocked<IMemoryRepository>;

  beforeEach(() => {
    mockMemoryRepository = {
      getTodayMemories: jest.fn(),
      getMemories: jest.fn(),
      saveMemory: jest.fn(),
      getMemoryById: jest.fn(),
    } as any;
    useCase = new GetAllMemoriesUseCase(mockMemoryRepository);
  });

  it('debería retornar todas las memorias desde el repositorio', async () => {
    // Arrange
    const mockMemories: Memory[] = [
      {
        id: '1',
        title: 'Recuerdo de la infancia',
        date: new Date().toISOString(),
        summary: 'Resumen',
        tags: [],
        audioUrl: null,
      },
      {
        id: '2',
        title: 'Boda',
        date: new Date().toISOString(),
        summary: 'Resumen 2',
        tags: [],
        audioUrl: null,
      },
    ];
    mockMemoryRepository.getMemories.mockResolvedValue(mockMemories);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockMemoryRepository.getMemories).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockMemories);
  });

  it('debería propagar errores si el repositorio falla', async () => {
    // Arrange
    const error = new Error('Database error');
    mockMemoryRepository.getMemories.mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('Database error');
  });
});
