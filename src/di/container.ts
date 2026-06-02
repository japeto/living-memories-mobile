import 'reflect-metadata';
import { container } from 'tsyringe';
import { MockMemoryRepository } from '../data/repositories/MockMemoryRepository';

// Register implementations to interfaces
container.registerSingleton('IMemoryRepository', MockMemoryRepository);

export { container };
