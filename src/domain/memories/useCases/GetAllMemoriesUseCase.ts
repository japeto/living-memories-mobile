import { inject, injectable } from 'tsyringe';
import { IMemoryRepository } from '../repositories/IMemoryRepository';
import { Memory } from '../entities/Memory';

@injectable()
export class GetAllMemoriesUseCase {
  constructor(
    @inject('IMemoryRepository')
    private memoryRepository: IMemoryRepository
  ) {}

  async execute(): Promise<Memory[]> {
    return this.memoryRepository.getMemories();
  }
}
