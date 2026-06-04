import { MemoryRepository } from '../../repositories/MemoryRepository';
import { uploadMemory, getMemories } from '../../network/memoriesApiClient';
import { Memory } from '../../../domain/memories/entities/Memory';

jest.mock('../../network/memoriesApiClient');

describe('MemoryRepository', () => {
  let repository: MemoryRepository;

  const mockMemory: Memory = {
    id: 'mem-1',
    time: '12:00',
    day: 'Hoy',
    text: 'Memory text',
    topic: 'Topic',
    mood: 'Mood',
  };

  beforeEach(() => {
    repository = new MemoryRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodayMemories', () => {
    it('should return memories from getMemories', async () => {
      (getMemories as jest.Mock).mockResolvedValue([mockMemory]);

      const result = await repository.getTodayMemories();

      expect(getMemories).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockMemory]);
    });
  });

  describe('uploadMemory', () => {
    it('should upload a memory text and return the result', async () => {
      (uploadMemory as jest.Mock).mockResolvedValue(mockMemory);

      const result = await repository.uploadMemory('Memory text', 'America/Bogota');

      expect(uploadMemory).toHaveBeenCalledWith('Memory text', 'America/Bogota');
      expect(result).toEqual(mockMemory);
    });
  });

  describe('processNewMemory', () => {
    it('should throw Not implemented error', async () => {
      await expect(repository.processNewMemory()).rejects.toThrow(
        'Not implemented. Real implementation should not use this mock method.',
      );
    });
  });
});
