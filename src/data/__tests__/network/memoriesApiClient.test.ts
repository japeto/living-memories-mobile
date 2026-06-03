import { uploadMemory, getMemories, MemoryResponse } from '../../network/memoriesApiClient';
import { apiClient } from '../../network/apiClient';

jest.mock('../../network/apiClient');

describe('memoriesApiClient', () => {
  const mockDate = new Date('2026-06-03T10:00:00Z');
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockMemoryResponse: MemoryResponse = {
    id: 'mem-1',
    user_id: 'user-1',
    text: 'Test memory text',
    topic: 'General',
    mood: 'Happy',
    created_at: '2026-06-03T10:00:00Z',
  };

  describe('uploadMemory', () => {
    it('should POST to /api/v1/memories/upload with the correct text and map the response', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockMemoryResponse });

      const result = await uploadMemory('Test memory text');

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/memories/upload', {
        text: 'Test memory text'
      });
      expect(result).toEqual({
        id: 'mem-1',
        time: mockDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        day: 'Hoy',
        text: 'Test memory text',
        topic: 'General',
        mood: 'Happy',
        reminder: undefined
      });
    });
  });

  describe('getMemories', () => {
    it('should GET from /api/v1/memories and map the list of responses', async () => {
      const yesterdayMockDate = new Date('2026-06-02T10:00:00Z');
      const mockMemoryResponse2: MemoryResponse = {
        ...mockMemoryResponse,
        id: 'mem-2',
        created_at: '2026-06-02T10:00:00Z',
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockMemoryResponse, mockMemoryResponse2] });

      const result = await getMemories();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/memories');
      expect(result).toHaveLength(2);
      expect(result[0].day).toBe('Hoy');
      expect(result[1].day).toBe('Ayer');
      expect(result[1].time).toBe(yesterdayMockDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    });
  });
});
