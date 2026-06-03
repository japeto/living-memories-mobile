import { inject, injectable } from 'tsyringe';
import { IMemoryRepository } from '../repositories/IMemoryRepository';
import { Memory } from '../entities/Memory';

@injectable()
export class ProcessNewMemoryUseCase {
  constructor(
    @inject('IMemoryRepository') private repository: IMemoryRepository
  ) {}

  async execute(): Promise<Memory> {
    return this.repository.processNewMemory();
  }
}
