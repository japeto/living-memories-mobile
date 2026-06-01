import { useState, useEffect } from 'react';
import { container } from 'tsyringe';
import { TestUseCase } from '../../domain/useCases/TestUseCase';

export function useTestViewModel() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Resolve the use case from the DI container
    const testUseCase = container.resolve(TestUseCase);
    setMessage(testUseCase.execute());
  }, []);

  return { message };
}
