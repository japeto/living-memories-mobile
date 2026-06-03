import { injectable } from 'tsyringe';

@injectable()
export class TestUseCase {
  execute(): string {
    return 'Hello from Clean Architecture + DI!';
  }
}
