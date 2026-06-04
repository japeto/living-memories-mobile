import { injectable, inject } from 'tsyringe';
import { IMemoryRepository } from '../repositories/IMemoryRepository';
import { Memory } from '../entities/Memory';

@injectable()
export class RecordMemoryUseCase {
  constructor(@inject('IMemoryRepository') private memoryRepository: IMemoryRepository) {}

  async execute(text: string): Promise<Memory> {
    if (!text) {
      throw new Error('Transcribed text is required to record a memory.');
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Pass the transcribed text to the repository (which sends it to API)
    return this.memoryRepository.uploadMemory(text, timeZone);
  }
}
