import 'reflect-metadata';
import { RecordMemoryUseCase } from '../RecordMemoryUseCase';
import { IMemoryRepository } from '../../repositories/IMemoryRepository';
import { Memory } from '../../entities/Memory';

describe('RecordMemoryUseCase', () => {
  let useCase: RecordMemoryUseCase;
  let mockMemoryRepository: jest.Mocked<IMemoryRepository>;

  const mockMemory: Memory = {
    id: 'mem-123',
    time: '12:00',
    day: 'Today',
    text: 'This is a test transcription',
    topic: 'General',
    mood: 'Happy',
  };

  beforeEach(() => {
    mockMemoryRepository = {
      getTodayMemories: jest.fn(),
      processNewMemory: jest.fn(),
      uploadMemory: jest.fn(),
    };

    useCase = new RecordMemoryUseCase(mockMemoryRepository);

    // Mock Intl.DateTimeFormat to have a deterministic timeZone
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () =>
            ({ timeZone: 'America/Mexico_City' }) as Intl.ResolvedDateTimeFormatOptions,
        }) as Intl.DateTimeFormat,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call repository.uploadMemory with correct parameters when text is provided', async () => {
    const transcribedText = 'Test transcribed text';

    mockMemoryRepository.uploadMemory.mockResolvedValue(mockMemory);

    const result = await useCase.execute(transcribedText);

    expect(mockMemoryRepository.uploadMemory).toHaveBeenCalledWith(
      transcribedText,
      'America/Mexico_City',
    );
    expect(mockMemoryRepository.uploadMemory).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockMemory);
  });

  it('should throw an error when transcribedText is empty', async () => {
    const transcribedText = '';

    await expect(useCase.execute(transcribedText)).rejects.toThrow(
      'Transcribed text is required to record a memory.',
    );
    expect(mockMemoryRepository.uploadMemory).not.toHaveBeenCalled();
  });
});
