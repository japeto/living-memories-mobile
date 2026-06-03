import 'reflect-metadata';
import { container } from 'tsyringe';
import { MemoryRepository } from '../data/repositories/MemoryRepository';
import { AuthRepository } from '../data/auth/repositories/AuthRepository';
import { RegisterUseCase } from '../domain/auth/useCases/RegisterUseCase';
import { LoginUseCase } from '../domain/auth/useCases/LoginUseCase';
import { RestoreSessionUseCase } from '../domain/auth/useCases/RestoreSessionUseCase';
import { RecordMemoryUseCase } from '../domain/memories/useCases/RecordMemoryUseCase';

container.registerSingleton('IMemoryRepository', MemoryRepository);
container.registerSingleton('IAuthRepository', AuthRepository);
container.registerSingleton(RegisterUseCase);
container.registerSingleton(LoginUseCase);
container.registerSingleton(RestoreSessionUseCase);
container.registerSingleton(RecordMemoryUseCase);

export { container };
