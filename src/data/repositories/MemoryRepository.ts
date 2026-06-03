import { IMemoryRepository } from '../../domain/memories/repositories/IMemoryRepository';
import { Memory } from '../../domain/memories/entities/Memory';
import { uploadMemory, getMemories } from '../network/memoriesApiClient';

export class MemoryRepository implements IMemoryRepository {
  async getTodayMemories(): Promise<Memory[]> {
    return await getMemories();
  }

  async processNewMemory(): Promise<Memory> {
    throw new Error('Not implemented. Real implementation should not use this mock method.');
  }

  async uploadMemory(text: string): Promise<Memory> {
    return await uploadMemory(text);
  }
}
