import 'reflect-metadata';
import { GetTodayMemoriesUseCase } from '../GetTodayMemoriesUseCase';
import { IMemoryRepository } from '../../repositories/IMemoryRepository';
import { Memory } from '../../entities/Memory';

describe('GetTodayMemoriesUseCase', () => {
  let useCase: GetTodayMemoriesUseCase;
  let mockMemoryRepository: jest.Mocked<IMemoryRepository>;

  const mockMemory: Memory = {
    id: 'mem-123',
    time: '12:00',
    day: 'Hoy',
    text: 'This is a test transcription',
    topic: 'General',
    mood: 'Happy'
  };

  beforeEach(() => {
    mockMemoryRepository = {
      getTodayMemories: jest.fn(),
      processNewMemory: jest.fn(),
      uploadMemory: jest.fn(),
    };

    useCase = new GetTodayMemoriesUseCase(mockMemoryRepository);
  });

  it('should return memories from the repository', async () => {
    mockMemoryRepository.getTodayMemories.mockResolvedValue([mockMemory]);

    const result = await useCase.execute();

    expect(mockMemoryRepository.getTodayMemories).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockMemory]);
  });
});
