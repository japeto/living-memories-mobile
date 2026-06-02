import { Memory } from '../entities/Memory';

export interface IMemoryRepository {
  getTodayMemories(): Promise<Memory[]>;
  processNewMemory(): Promise<Memory>;
}
