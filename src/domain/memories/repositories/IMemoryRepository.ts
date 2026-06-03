import { Memory } from '../entities/Memory';

export interface IMemoryRepository {
  getMemories(): Promise<Memory[]>;
  getTodayMemories(): Promise<Memory[]>;
  processNewMemory(): Promise<Memory>;
  uploadMemory(text: string): Promise<Memory>;
}
